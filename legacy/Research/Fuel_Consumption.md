# Fuel Consumption and Tailpipe Calculations\n\nThis document contains data parameters and properties for related modeling logic.\n\n## Source Data\n```json\n{
"description": "Conversion of fuel consumption in L/100 km to g CO₂/km for gasoline, with a worked example.",
"assumptions": {
"fuel": "Gasoline (petrol)",
"co2_factor_kg_per_litre": 2.3,
"co2_factor_source": "Burning 1 L of gasoline produces about 2.3 kg CO₂ according to Natural Resources Canada and similar guidance."

},
"formulas": {
"stepwise": {
"inputs": {
"FC_L_per_100km": "Fuel consumption in litres per 100 km (L/100 km)",
"EF_kg_per_L": "CO₂ emission factor in kg CO₂ per litre of fuel (kg/L)"
},
"intermediate": {
"FC_L_per_km": "FC_L_per_100km / 100"
},
"output": {
"E_CO2_g_per_km": "FC_L_per_km * EF_kg_per_L * 1000"
},
"units": {
"FC_L_per_100km": "L/100 km",
"FC_L_per_km": "L/km",
"EF_kg_per_L": "kg CO₂/L",
"E_CO2_g_per_km": "g CO₂/km"
}
},
"compact": {
"expression": "E_CO2_g_per_km = FC_L_per_100km * EF_kg_per_L * 10",
"derivation": "Since FC_L_per_km = FC_L_per_100km / 100 and 1 kg = 1000 g, we get E_CO2_g_per_km = (FC_L_per_100km / 100) * EF_kg_per_L * 1000 = FC_L_per_100km * EF_kg_per_L * 10.",
"example_with_gasoline_factor": "For gasoline with EF_kg_per_L = 2.3, E_CO2_g_per_km = FC_L_per_100km * 23."

}
},
"example": {
"description": "Car using 7.5 L/100 km of gasoline.",
"inputs": {
"FC_L_per_100km": 7.5,
"EF_kg_per_L": 2.3
},
"calculation_stepwise": {
"FC_L_per_km": 0.075,
"E_CO2_kg_per_km": 0.1725,
"E_CO2_g_per_km": 172.5,
"explanation": "FC_L_per_km = 7.5 / 100 = 0.075 L/km; E_CO2_kg_per_km = 0.075 * 2.3 = 0.1725 kg/km; E_CO2_g_per_km = 0.1725 * 1000 = 172.5 g/km."
},
"calculation_compact": {
"expression": "E_CO2_g_per_km = 7.5 * 2.3 * 10",
"result_g_per_km": 172.5,
"explanation": "E_CO2_g_per_km = FC_L_per_100km * EF_kg_per_L * 10 = 7.5 * 2.3 * 10 = 172.5 g/km."
},
"interpretation": "A gasoline car that consumes 7.5 L/100 km emits about 173 g CO₂ per km at the tailpipe, consistent with standard chemistry-based factors for petrol."

}
}\n```\n\n## Programming Implementation Feature\n\n```typescript\nexport interface FuelConsumptionFormula {
    description: string;
    assumptions: Record<string, any>;
    formulas: Record<string, any>;
    example: Record<string, any>;
}

export function calculateCO2Emission(fcLitersPer100Km: number, efKgPerLiter: number): number {
    // Computes Fuel_cons * EF * 10 directly
    return fcLitersPer100Km * efKgPerLiter * 10;
}\n```\n