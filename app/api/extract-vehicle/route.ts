import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import google from 'googlethis';

export async function POST(req: NextRequest) {
    try {
        const apiKeys = [
            process.env.GEMINI_API_KEY_SEARCH_1,
            process.env.GEMINI_API_KEY_SEARCH_2,
            process.env.GEMINI_API_KEY_SEARCH_3,
            process.env.GEMINI_API_KEY
        ].filter(Boolean) as string[];

        if (apiKeys.length === 0) {
            return NextResponse.json({ error: "Gemini API keys are not configured" }, { status: 500 });
        }

        const body = await req.json();
        const { query } = body;

        if (!query) {
            return NextResponse.json({ error: "Missing query" }, { status: 400 });
        }

        const prompt = `You are a highly precise Indian Automotive Specification Engine. Your task is to identify a vehicle from a user query (text or image description) and return its technical specifications for environmental impact analysis.

### DATA MATCHING RULES (INDIA SPECIFIC):
1. EMISSION STANDARDS:
   - Pre-2005: bs2
   - 2005-2010: bs3
   - 2010-March 2020: bs4
   - April 2020-Present: bs6
   - All EVs: bs6 (for reporting purposes)
2. SPECIFICATIONS: Use internal knowledge of ARAI-certified data. For variants, prioritize the most popular trim if the specific one isn't mentioned.
3. LOGIC: For EVs, 'engine_cc', 'cylinders', and 'fuel_injection' MUST be null.

### OUTPUT FORMAT:
Return ONLY a valid JSON object. No markdown, no "here is the data", no backticks.

### SCHEMA:
{
  "name": "Full Model Name + Year (e.g., 'Maruti Suzuki Swift 2021')",
  "vehicle_category": "2wheeler | car | suv | bus | truck",
  "fuel_type": "petrol | diesel | cng | hybrid | ev",
  "emission_standard": "bs2 | bs3 | bs4 | bs6",
  "engine_size": "small (<1.2L) | medium (1.2-2.0L) | large (>2.0L)",
  "engine_cc": number | null,
  "cylinders": number | null,
  "turbocharged": boolean,
  "fuel_injection": "MPFI | CRDi | GDI | Carburetor | null",
  "transmission": "Manual | AMT | CVT | Torque Converter | DCT",
  "fuel_efficiency_kmpl": number,
  "kerb_weight_kg": number,
  "variant": "Detected trim level (e.g., 'VXi')",
  "image_keyword": "Color + Year + Make + Model search string",
  "wikipedia_search_term": "Best Wikipedia page title",
  "confidence_score": number (1-100)
}

### INPUT QUERY:
"${query}"`;

        let text = "";
        let generationSuccessful = false;
        let lastError = null;

        for (const key of apiKeys) {
            try {
                const genAI = new GoogleGenerativeAI(key);
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                const result = await model.generateContent(prompt);
                text = result.response.text().trim();
                generationSuccessful = true;
                break;
            } catch (error: any) {
                console.warn("Gemini API Error with a search key, trying next if available...");
                lastError = error;
            }
        }

        if (!generationSuccessful) {
            throw lastError;
        }

        let jsonString = text;
        if (jsonString.startsWith('\`\`\`json')) {
            jsonString = jsonString.slice(7, -3).trim();
        } else if (jsonString.startsWith('\`\`\`')) {
            jsonString = jsonString.slice(3, -3).trim();
        }

        const parsedData = JSON.parse(jsonString);

        const valid_vType = ['2wheeler', 'car', 'suv', 'bus', 'truck'];
        const valid_fType = ['petrol', 'diesel', 'cng', 'hybrid', 'ev'];
        const valid_eStd = ['bs2', 'bs3', 'bs4', 'bs6'];
        const valid_eSize = ['small', 'medium', 'large'];

        // Attempt to fetch image from Google Images
        let imageUrl = null;
        const searchTerm = parsedData.image_keyword || parsedData.name;

        if (searchTerm) {
            try {
                // Use googlethis to search for images
                const imageSearchTerm = `${searchTerm} official car photo`;
                const images = await google.image(imageSearchTerm, { safe: false });

                if (images && images.length > 0) {
                    // Try to prioritize reputable automotive sites
                    const reputableDomains = ['carwale.com', 'bikewale.com', 'zigwheels.com', 'cardekho.com', 'autocarindia.com', 'motorbeam.com', 'rushlane.com', 'team-bhp.com', 'v3cars.com', 'carandbike.com'];

                    let bestImage = null;
                    const brandKeywords = parsedData.name.split(' ')[0].toLowerCase();

                    // 1. Look for official domains or reputable domains
                    for (const img of images) {
                        const domain = img.origin?.website?.domain?.toLowerCase() || '';

                        if (domain.includes(brandKeywords) || reputableDomains.some(d => domain.includes(d))) {
                            // Basic check to avoid tiny thumbnails
                            if (img.width > 300 && img.height > 200) {
                                bestImage = img.url;
                                break;
                            }
                        }
                    }

                    // 2. If no reputable/official source, just take the first reasonably sized image
                    if (!bestImage) {
                        for (const img of images) {
                            if (img.width > 300 && img.height > 200) {
                                bestImage = img.url;
                                break;
                            }
                        }
                    }

                    // 3. Absolute fallback to the very first image
                    if (!bestImage && images.length > 0) {
                        bestImage = images[0].url;
                    }

                    imageUrl = bestImage;
                }
            } catch (e) {
                console.error("Google Image Fetch Error:", e);
            }
        }

        const responsePayload = {
            name: parsedData.name || 'Unknown Vehicle',
            vType: valid_vType.includes(parsedData.vehicle_category) ? parsedData.vehicle_category : 'car',
            fType: valid_fType.includes(parsedData.fuel_type) ? parsedData.fuel_type : 'petrol',
            eStd: valid_eStd.includes(parsedData.emission_standard) ? parsedData.emission_standard : 'bs4',
            eSize: valid_eSize.includes(parsedData.engine_size) ? parsedData.engine_size : 'medium',
            engineCC: parsedData.engine_cc || null,
            cylinders: parsedData.cylinders || null,
            turbocharged: parsedData.turbocharged || false,
            fuelInjection: parsedData.fuel_injection || null,
            transmission: parsedData.transmission || null,
            fuelEfficiencyKmpl: parsedData.fuel_efficiency_kmpl || null,
            kerbWeightKg: parsedData.kerb_weight_kg || null,
            variant: parsedData.variant || null,
            imageKeyword: parsedData.image_keyword || parsedData.name || 'car',
            imageUrl: imageUrl,
            confidence: parsedData.confidence_score || 100
        };

        return NextResponse.json(responsePayload);
    } catch (error: any) {
        console.error("Gemini API Error:", error);

        if (error.status === 429 || (error.message && error.message.includes('429'))) {
            // Extract retry delay from error message if available, else default to 60s
            const delayMatch = error.message ? error.message.match(/retry in ([\d.]+)s/) : null;
            const retryAfter = delayMatch ? Math.ceil(parseFloat(delayMatch[1])) : 60;

            return NextResponse.json({
                error: "Gemini API rate limit exceeded.",
                errorType: "rate_limit",
                retryAfter: retryAfter
            }, { status: 429 });
        }

        return NextResponse.json({ error: "Failed to recognize vehicle details" }, { status: 500 });
    }
}
