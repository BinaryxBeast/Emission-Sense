import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const apiKeys = [
            process.env.GEMINI_API_KEY_V3,
            process.env.GEMINI_API_KEY_REC_1,
            process.env.GEMINI_API_KEY_REC_2,
            process.env.GEMINI_API_KEY_REC_3,
            process.env.GEMINI_API_KEY
        ].filter(Boolean) as string[];

        if (apiKeys.length === 0) {
            return NextResponse.json({ error: "Gemini API keys are not configured" }, { status: 500 });
        }

        const body = await req.json();
        const { 
            name, fuel_type, emission_standard, engine_size, age,
            daily_distance, city_highway_split, traffic_intensity, ac_usage, vehicle_load, 
            last_service_date, original_kmpl, current_kmpl,
            emissions, maintenance_score, emission_rating
        } = body;

        if (!name) {
            return NextResponse.json({ error: "Missing required vehicle data" }, { status: 400 });
        }

        // Backend Calculation for days since service
        let days_since_service = "Unknown";
        if (last_service_date) {
            try {
                // last_service_date might be DD/MM/YYYY or YYYY-MM-DD
                let dateObj: Date | null = null;
                if (last_service_date.includes('/')) {
                    const parts = last_service_date.split('/');
                    if (parts.length === 3) {
                        dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                    }
                } else if (last_service_date.includes('-')) {
                    dateObj = new Date(last_service_date);
                }
                
                if (dateObj && !isNaN(dateObj.getTime())) {
                    const diffTime = Math.abs(new Date().getTime() - dateObj.getTime());
                    days_since_service = String(Math.floor(diffTime / (1000 * 60 * 60 * 24)));
                }
            } catch {
                // Ignore parsing errors
            }
        }

        // Efficiency drop calculation
        let efficiency_drop = "0%";
        if (original_kmpl && current_kmpl && original_kmpl > 0 && current_kmpl < original_kmpl) {
            const drop = ((original_kmpl - current_kmpl) / original_kmpl) * 100;
            efficiency_drop = `-${drop.toFixed(1)}%`;
        }

        const isEV = fuel_type === 'ev' || fuel_type === 'EV';

        const prompt = `### PERSONA
You are the user's "Eco-Driving Buddy." You're car-savvy, environmentally conscious, and speak like a helpful friend who wants to save the user money and reduce their carbon footprint. Use a warm, encouraging, and conversational tone.

### THE DATA
I've got some details about your ride and how you drive:

1. The Vehicle Identity (The "Who")
- Identity: ${name}
- Fuel Type: ${isEV ? 'EV (Electric)' : fuel_type.toUpperCase()}${isEV ? '. Note: Since this is an EV, "Emissions" refers to battery health and grid impact rather than tailpipe smoke.' : ''}
- Standard: ${emission_standard ? emission_standard.toUpperCase().replace('BS', 'BS-') : "Unknown"}
- Age: ${age !== undefined ? age + " years old" : "Unknown"}
- Engine Size: ${engine_size || "Unknown"}
- Efficiency Baseline: ${original_kmpl ? original_kmpl + " km/unit (or km/l equivalent)" : "Unknown"}

2. Driving Logistics (The "How & Where")
- The Daily Grind: ${daily_distance || "Unknown"} km per day
- The Environment: ${city_highway_split || 50}% City / ${100 - (city_highway_split || 50)}% Highway
- Traffic Stress: ${traffic_intensity || "Unknown"} Intensity
- Load/AC: ${vehicle_load || "Unknown"} factor / AC: ${ac_usage || "Unknown"}

3. Maintenance & Health (The "Why")
- The Service Gap: ${days_since_service !== "Unknown" ? days_since_service + " days since last check" : "Unknown"}
- Efficiency Decay: ${original_kmpl && current_kmpl ? 'Earlier: ' + original_kmpl + ' vs. Now: ' + current_kmpl + ' (' + efficiency_drop + ' drop)' : "Unknown"}
${emissions ? `
4. Calculated Emissions & Impact (The "Result")
- Overall Rating: ${emission_rating || "Unknown"}
- Maintenance Score: ${maintenance_score !== undefined ? maintenance_score + "/100" : "Unknown"}
- Estimated Daily CO2: ${emissions.CO2 ? emissions.CO2.toFixed(1) + " gm" : "Unknown"}
- Estimated PM2.5: ${emissions.PM25 ? emissions.PM25.toFixed(2) + " g" : "Unknown"}
- Estimated NOx: ${emissions.NOx ? emissions.NOx.toFixed(2) + " g" : "Unknown"}` : ''}

### YOUR MISSION
Based on this info, give me 3 personalized "Pro-Tips." 

### GUIDELINES FOR VARIETY & STYLE:
1. NO REPETITION: Every time I ask, try to find a different angle. One time focus on fuel savings, another time on vehicle longevity, or the specific environmental impact of ${isEV ? 'EVs' : fuel_type.toUpperCase()}.
2. TALK LIKE A FRIEND: Use phrases like "Since you're mostly in city traffic," "Your ${name} will thank you if...", or "I noticed your AC usage is..."
3. BE DESCRIPTIVE & PROACTIVE: Don't just give a fact; explain the 'why' in a way that feels like a conversation. Diagnose issues based on the service gap, efficiency drop, or the calculated emission values (e.g., if PM2.5 or CO2 is high, or maintenance score is low). You have a limit of 45 words per description now—use them to add personality!
4. NUDGE, DON'T LECTURE: Instead of "Do X," say "You might want to try X."
5. TAILORED ACTIONS: If they have traffic stress ("Some stops"), suggest specific braking/idling tips. If they are overdue for service, bring it up nicely!

### OUTPUT FORMAT:
Return ONLY a JSON array of objects. Each object must have a 'title' and a 'description'. No markdown, no backticks, no "here is your JSON". Only the array.

Example JSON Structure:
[
  {
    "title": "A catchy, friendly title",
    "description": "A conversational, insightful tip specifically referencing the user's data (like their service gap or traffic style)."
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
            } catch (error) {
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
    } catch (error: unknown) {
        console.error("Gemini Recommendations Error:", error);

        const err = error as { status?: number, message?: string };
        if (err.status === 429 || (err.message && err.message.includes('429'))) {
            const delayMatch = err.message ? err.message.match(/retry in ([\d.]+)s/) : null;
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
