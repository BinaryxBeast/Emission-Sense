/**
 * Advanced Emission Utilities
 * Extracted from legacy/Research documentation
 */

// --- FUEL CO2 FACTORS ---
export const FUEL_CO2_FACTORS = {
    GASOLINE_KG_PER_L: 2.30,
    DIESEL_KG_PER_L: 2.6533,
    LPG_KG_PER_L: 1.57,
    CNG_KG_PER_KG: 2.75,
    ELECTRIC_INDIA_KG_PER_KWH: 0.71, // 0.71 kg CO2/kWh
    ELECTRIC_US_KG_PER_KWH: 0.39,
};

// Generic EV Efficiency assumption (kWh/km)
// Typically 0.15 - 0.20 kWh/km for a car. Let's assume based on size.
const EV_EFFICIENCY_KWH_PER_KM: Record<string, number> = {
    '2wheeler': 0.03, // ~30 Wh/km
    'car': 0.15,      // ~150 Wh/km
    'suv': 0.22,      // ~220 Wh/km
    'bus': 1.20,      // ~1.2 kWh/km
    'truck': 1.50,
};

/**
 * Calculate upstream Grid CO2 emissions for EVs
 */
export function calculateEVGridCO2(vType: string, distanceKm: number, gridFactorKgPerKwh: number = FUEL_CO2_FACTORS.ELECTRIC_INDIA_KG_PER_KWH): number {
    const kwhPerKm = EV_EFFICIENCY_KWH_PER_KM[vType] || 0.15;
    // kg / km * distance -> total kg -> * 1000 -> g
    return kwhPerKm * gridFactorKgPerKwh * distanceKm * 1000;
}

// --- AGE DETERIORATION FACTOR ---
/**
 * Calculates the age-related emission deterioration factor based on vehicle mileage.
 * @param mileageKm Odometer reading in kilometers.
 * @returns Multiplicative deterioration factor (1.0 to 2.2).
 */
export function getAgeDeteriorationFactor(mileageKm: number): number {
    if (mileageKm <= 50000) return 1.0;
    if (mileageKm <= 100000) return 1.0 + 0.2 * (mileageKm - 50000) / 50000;
    if (mileageKm <= 160000) return 1.2 + 0.3 * (mileageKm - 100000) / 60000;
    if (mileageKm <= 240000) return 1.5 + 0.7 * (mileageKm - 160000) / 80000;
    return 2.2;
}

// Estimate mileage from age and daily distance
export function estimateMileage(ageYears: number, dTotDaily: number): number {
    return ageYears * (dTotDaily * 365);
}

// --- MAINTENANCE & GROSS EMITTER FACTOR ---
export const MAINTENANCE_MULTIPLIERS = {
    good: { NOx: 1.0, CO: 1.0, PM25: 1.0, HC: 1.0 },
    average: { NOx: 1.3, CO: 1.5, PM25: 1.25, HC: 1.5 },
    poor: { NOx: 2.5, CO: 3.5, PM25: 2.0, HC: 3.5 } // Gross Emitter Model
};

// --- COLD START EXCESS ---
// Base excess multiplier (returns % extra per km driven cold)
// Formula: E_p_total = E_p_hot * (1 + R_cold_p)
export function getColdStartRatio(fType: string, climate: string, isShortTrip: boolean): Record<string, number> {
    const r_cold: Record<string, number> = { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 };

    // Default EV is 0
    if (fType === 'ev') return r_cold;

    let tempMultiplier = 1.0; // Moderate
    if (climate === 'cool') tempMultiplier = 2.0; // 0–10°C band
    if (climate === 'hot') tempMultiplier = 0.5;  // >=20°C band

    let tripMultiplier = isShortTrip ? 1.5 : 0.5;

    if (fType === 'petrol' || fType === 'cng' || fType === 'hybrid') {
        r_cold.CO2 = 0.15 * tempMultiplier * tripMultiplier;
        r_cold.NOx = 0.30 * tempMultiplier * tripMultiplier;
        r_cold.PM25 = 0.10 * tempMultiplier * tripMultiplier;
        r_cold.CO = 1.50 * tempMultiplier * tripMultiplier;
        r_cold.HC = 1.20 * tempMultiplier * tripMultiplier;
    } else if (fType === 'diesel') {
        r_cold.CO2 = 0.10 * tempMultiplier * tripMultiplier;
        r_cold.NOx = 0.50 * tempMultiplier * tripMultiplier;
        r_cold.PM25 = 0.80 * tempMultiplier * tripMultiplier;
        r_cold.CO = 0.50 * tempMultiplier * tripMultiplier;
        r_cold.HC = 0.40 * tempMultiplier * tripMultiplier;
    }

    return r_cold;
}
