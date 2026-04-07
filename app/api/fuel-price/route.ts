import { NextResponse } from 'next/server';

/**
 * Indian average fuel prices (₹) — national approximate averages.
 * Petrol: ~₹96/l (Delhi ₹94.77, Mumbai ₹103.54, avg ~₹96)
 * Diesel: ~₹89/l (Delhi ₹87.67, Mumbai ₹90.03, avg ~₹89)
 * CNG:    ~₹79/kg (Delhi ₹77.26, Mumbai ₹80.50, avg ~₹79)
 * Hybrid: treated same as petrol for fuel cost
 * EV:     ₹8/kWh (approximate residential tariff in India)
 *
 * These reflect March 2026 national averages and can be updated as needed.
 * No external API key required; returns quickly and reliably.
 */
const INDIA_FUEL_PRICES: Record<string, number> = {
    petrol: 96,
    diesel: 89,
    cng: 79,
    hybrid: 96,
    ev: 8,       // ₹ per kWh
};

export async function GET() {
    return NextResponse.json(INDIA_FUEL_PRICES, {
        headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
