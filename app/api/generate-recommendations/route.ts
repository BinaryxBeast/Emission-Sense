import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const apiKeys = [
            process.env.GEMINI_API_KEY_REC_1,
            process.env.GEMINI_API_KEY_REC_2,
            process.env.GEMINI_API_KEY_REC_3,
            process.env.GEMINI_API_KEY
        ].filter(Boolean) as string[];

        if (apiKeys.length === 0) {
            return NextResponse.json({ error: "Gemini API keys are not configured" }, { status: 500 });
        }

        const body = await req.json();
        const { name, fuel_type, emission_standard, engine_size, city_highway_split, ac_usage, vehicle_load, maintenance_level } = body;

        if (!name) {
            return NextResponse.json({ error: "Missing required vehicle data" }, { status: 400 });
        }

        const prompt = `You are the "Emission-Sense Advisor," an AI expert in Indian automotive efficiency and environmental impact. Your goal is to provide 3 highly specific, actionable recommendations to a driver based on their vehicle data and driving habits.

### CONTEXTUAL DATA TO ANALYZE:
- Vehicle: ${name} (${fuel_type}, ${emission_standard}, ${engine_size})
- Driving Mix: ${city_highway_split}% City / ${100 - city_highway_split}% Highway
- AC Usage: ${ac_usage}
- Load: ${vehicle_load}
- Maintenance: ${maintenance_level}

### GUIDELINES FOR RECOMMENDATIONS:
1. SPECIFICITY: Don't give generic "drive less" advice. Reference the user's data (e.g., if they drive 70% in the city, suggest techniques for traffic).
2. TONE: Supportive, expert, and brief.
3. CATEGORIZATION:
   - Tip 1: Driving Habit (e.g., coasting, idling, or gear shifts).
   - Tip 2: Maintenance/Vehicle Care (specific to their age/maintenance level).
   - Tip 3: Environmental Context (based on climate or trip length).

### OUTPUT FORMAT:
Return ONLY a JSON array of objects. Each object must have a 'title' and a 'description'. Keep descriptions under 25 words. No markdown, no "here is the data", no backticks.

Example JSON Structure:
[
  {
    "title": "Optimized Gear Shifts",
    "description": "In heavy city traffic, shifting up early (below 2000 RPM) can reduce your 1.2L engine's fuel burn and NOx output."
  }
]`;

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
                console.warn("Gemini API Error with a recommendation key, trying next if available...");
                lastError = error;
            }
        }

        if (!generationSuccessful) {
            throw lastError;
        }

        if (text.startsWith('\`\`\`json')) {
            text = text.slice(7, -3).trim();
        } else if (text.startsWith('\`\`\`')) {
            text = text.slice(3, -3).trim();
        }

        const recommendations = JSON.parse(text);

        return NextResponse.json(recommendations);
    } catch (error: any) {
        console.error("Gemini Recommendations Error:", error);

        if (error.status === 429 || (error.message && error.message.includes('429'))) {
            const delayMatch = error.message ? error.message.match(/retry in ([\d.]+)s/) : null;
            const retryAfter = delayMatch ? Math.ceil(parseFloat(delayMatch[1])) : 60;

            return NextResponse.json({
                error: "Gemini API rate limit exceeded.",
                errorType: "rate_limit",
                retryAfter: retryAfter
            }, { status: 429 });
        }

        return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
    }
}
