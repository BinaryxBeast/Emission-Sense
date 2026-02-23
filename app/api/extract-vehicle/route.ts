import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: NextRequest) {
    try {
        if (!apiKey) {
            return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
        }

        const body = await req.json();
        const { query } = body;

        if (!query) {
            return NextResponse.json({ error: "Missing query" }, { status: 400 });
        }
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
      You are a specialized Indian automotive database.
      Extract structured vehicle details from this query: "${query}".
      
      Return ONLY JSON. Do not include introductory text, explanations, or markdown code blocks.
      
      The object must strictly match this schema:
      {
        "name": "Cleaned up name of the vehicle (e.g., 'Honda City 2018', 'Ola S1 Pro')",
        "vehicle_category": "MUST BE EXACTLY ONE OF: '2wheeler', 'car', 'suv', 'bus', 'truck'",
        "fuel_type": "MUST BE EXACTLY ONE OF: 'petrol', 'diesel', 'cng', 'hybrid', 'ev'",
        "emission_standard": "MUST BE EXACTLY ONE OF: 'bs2', 'bs3', 'bs4', 'bs6'",
        "engine_size": "MUST BE EXACTLY ONE OF: 'small', 'medium', 'large'. (<1.2L/<150cc is small, 1.2-2.0L/150-500cc is medium, >2.0L/>500cc is large)",
        "image_keyword": "A highly specific 3-to-4 word search term to find a photo of this vehicle on the internet (e.g., '2022 Mahindra Thar white', 'Honda City 2018 silver')",
        "wikipedia_search_term": "The exact title or best search query for the Wikipedia article of this vehicle model (e.g., 'Mahindra Thar', 'Honda City', 'Ola S1')",
        "confidence_score": "An integer from 1 to 100 representing how confident you are in this extraction"
      }
      
      Data Matching and Logic Rules:
      - If the vehicle was sold before 2005, the emission_standard MUST be 'bs2' or 'bs3'.
      - If the vehicle was sold between 2010 and 2019, the emission_standard MUST be 'bs4'.
      - If the vehicle was sold in 2020 or later, or if it is an EV, the emission_standard MUST be 'bs6'.
      - If the user input is vague (like 'Honda City' without a year), identify the best fit or most common modern version. Set the confidence_score lower (e.g., below 70) if you had to guess the year or fuel type.
    `;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        let jsonString = text;
        if (jsonString.startsWith('```json')) {
            jsonString = jsonString.slice(7, -3).trim();
        } else if (jsonString.startsWith('```')) {
            jsonString = jsonString.slice(3, -3).trim();
        }

        const parsedData = JSON.parse(jsonString);

        const valid_vType = ['2wheeler', 'car', 'suv', 'bus', 'truck'];
        const valid_fType = ['petrol', 'diesel', 'cng', 'hybrid', 'ev'];
        const valid_eStd = ['bs2', 'bs3', 'bs4', 'bs6'];
        const valid_eSize = ['small', 'medium', 'large'];

        // Attempt to fetch image from Wikipedia
        let imageUrl = null;
        const searchTerm = parsedData.wikipedia_search_term || parsedData.name;
        if (searchTerm) {
            try {
                const wikiSearchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&utf8=&format=json&origin=*`);
                const wikiSearchData = await wikiSearchRes.json();
                const title = wikiSearchData.query?.search?.[0]?.title;
                if (title) {
                    const wikiImageRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=600&origin=*`);
                    const wikiImageData = await wikiImageRes.json();
                    const pages = wikiImageData.query?.pages;
                    if (pages) {
                        const page = Object.values(pages)[0] as any;
                        if (page?.thumbnail?.source) {
                            imageUrl = page.thumbnail.source;
                        }
                    }
                }
            } catch (e) {
                console.error("Wikipedia Image Fetch Error:", e);
            }
        }

        const responsePayload = {
            name: parsedData.name || 'Unknown Vehicle',
            vType: valid_vType.includes(parsedData.vehicle_category) ? parsedData.vehicle_category : 'car',
            fType: valid_fType.includes(parsedData.fuel_type) ? parsedData.fuel_type : 'petrol',
            eStd: valid_eStd.includes(parsedData.emission_standard) ? parsedData.emission_standard : 'bs4',
            eSize: valid_eSize.includes(parsedData.engine_size) ? parsedData.engine_size : 'medium',
            imageKeyword: parsedData.image_keyword || parsedData.name || 'car',
            imageUrl: imageUrl,
            confidence: parsedData.confidence_score || 100
        };

        return NextResponse.json(responsePayload);
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: "Failed to recognize vehicle details" }, { status: 500 });
    }
}
