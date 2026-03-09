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
    ELECTRIC_INDIA_KG_PER_KWH: 0.727, // CEA v20.0 (Dec 2024): 0.727 kg CO2/kWh weighted avg
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
    const chargingEfficiency = 0.90; // AC charging ~90% efficient (Grid_Emissions.md)
    // Energy pulled from grid = consumption / efficiency
    // Then multiply by grid CO2 factor and convert kg->g
    return (kwhPerKm / chargingEfficiency) * gridFactorKgPerKwh * distanceKm * 1000;
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

/**
 * CO2-specific age deterioration — fuel efficiency degrades at a much lower rate
 * than catalyst-dependent toxic pollutants. Research caps this at ~5%.
 * (Age_Deterioration_Factor.md line 108, Fuel_Efficiency_Override.md line 56)
 */
export function getAgeDeteriorationFactorCO2(mileageKm: number): number {
    if (mileageKm <= 50000) return 1.0;
    // Linear scale from 1.0 at 50k km to 1.05 at 200k km, then cap
    if (mileageKm <= 200000) return 1.0 + 0.05 * (mileageKm - 50000) / 150000;
    return 1.05;
}

// Estimate mileage from age and daily distance
export function estimateMileage(ageYears: number, dTotDaily: number): number {
    return ageYears * (dTotDaily * 365);
}

// --- MAINTENANCE & GROSS EMITTER FACTOR ---
// Maintenance_Factor.md research values — "Poor" = Gross Emitter model
// CO2 factors added (1.0/1.05/1.15) per research: poor maintenance
// reduces fuel efficiency by 5-15%, but doesn't cause 400%+ spikes
export const MAINTENANCE_MULTIPLIERS = {
    good:    { NOx: 1.0, CO: 1.0, PM25: 1.0, HC: 1.0, CO2: 1.0 },
    average: { NOx: 1.2, CO: 1.5, PM25: 1.5, HC: 1.5, CO2: 1.05 },
    poor:    { NOx: 3.0, CO: 4.0, PM25: 8.0, HC: 5.0, CO2: 1.15 } // Gross Emitter
};

// --- COLD START EXCESS ---
export function getColdStartRatio(fType: string, climate: string, isShortTrip: boolean, distPerTrip: number = 5): Record<string, number> {
    const r_cold: Record<string, number> = { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 };

    if (fType === 'ev') return r_cold;

    let tempMultiplier = 1.0;
    if (climate === 'cool') tempMultiplier = 2.0;
    if (climate === 'hot') tempMultiplier = 0.5;

    // Strongly penalize very short trips (<10 km is considered short, <5 km is extreme)
    let tripMultiplier = 0.5;
    if (isShortTrip || distPerTrip <= 10) {
        tripMultiplier = 1.5;
        if (distPerTrip <= 5) tripMultiplier = 3.0; // Extreme cold start penalty
    }

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

// --- DRIVING CONDITIONS MODIFIERS ---
export function getDrivingConditionMultipliers(
    acUsage: 'None' | 'Moderate' | 'Heavy' = 'Moderate',
    trafficIntensity: 'Low' | 'Medium' | 'High' = 'Medium',
    loadFactor: number = 1 // 1=Single, 1.5=Family, 2=Full
) {
    const mult = { CO2: 1.0, NOx: 1.0, PM25: 1.0, CO: 1.0, HC: 1.0 };

    if (acUsage === 'Heavy') {
        mult.CO2 *= 1.15; mult.NOx *= 1.25; mult.CO *= 1.2;
    } else if (acUsage === 'None') {
        mult.CO2 *= 0.95; mult.NOx *= 0.95;
    }

    if (trafficIntensity === 'High') {
        // Stop and go heavily spikes NOx, CO, and PM (brake wear)
        mult.CO2 *= 1.20; mult.NOx *= 1.40; mult.CO *= 1.50; mult.PM25 *= 1.30;
    } else if (trafficIntensity === 'Low') {
        mult.CO2 *= 0.90; mult.NOx *= 0.85; mult.CO *= 0.80; mult.PM25 *= 0.90;
    }

    // Weight affects fuel consumption almost linearly for CO2
    if (loadFactor > 1) {
        const excessLoad = loadFactor - 1;
        mult.CO2 *= (1 + (excessLoad * 0.1)); // Every extra roughly adds 10%
        mult.NOx *= (1 + (excessLoad * 0.15));
    }

    return mult;
}

// --- EXACT ENGINE & TECH MODIFIERS ---
export function getTechMultipliers(turbocharged: boolean, fuelInjection: string | null | undefined, transmission: string | null | undefined) {
    const mult = { CO2: 1.0, NOx: 1.0, PM25: 1.0, CO: 1.0, HC: 1.0 };

    // Turbocharged engines often have slightly better CO2 but can spike NOx/PM under load
    if (turbocharged) {
        mult.CO2 *= 0.95;
        mult.NOx *= 1.10;
        mult.PM25 *= 1.15;
    }

    // GDI produces higher PM than MPFI
    if (fuelInjection && fuelInjection.toUpperCase().includes('GDI')) {
        mult.PM25 *= 1.50;
    }

    // AT/AMT slightly worse than Manual typically, CVT better
    if (transmission) {
        const tx = transmission.toUpperCase();
        if (tx.includes('AUTO') || tx.includes('AMT')) {
            mult.CO2 *= 1.05;
        } else if (tx.includes('CVT')) {
            mult.CO2 *= 0.98;
        }
    }

    return mult;
}

// --- NON-EXHAUST (TYRE/BRAKE) MODIFIERS ---
export function getNonExhaustMultipliers(tyreType: string | undefined, brakeType: string | undefined) {
    let pm25Mult = 1.0;
    if (tyreType === 'Performance') pm25Mult *= 1.2; // Softer compound wears faster
    if (tyreType === 'Old') pm25Mult *= 1.3;
    if (tyreType === 'Eco') pm25Mult *= 0.85;

    if (brakeType === 'Disc') pm25Mult *= 1.1; // Better stopping but often more brake dust than enclosed drum depending on pad

    return pm25Mult;
}
