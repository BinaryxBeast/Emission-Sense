import os
import re

base_path = "/home/binaryxbeast/Desktop/asep_project/legacy/Research/"

# 1. Age_Factor.md
age_factor_content = """# Age-Related Deterioration Factor

A practical way to model age‑related deterioration in a web tool is to use a piecewise mileage‑based multiplier with gentle slopes at low mileage and steeper slopes at higher mileage, capped around 200–240 thousand km as suggested by European guidance and recent field studies.

Below is a simple function you can implement.

## Recommended multiplicative age function (by mileage)
Define a deterioration factor $F_{age,p}$ that multiplies your baseline emission factor $EF_{p,base}$ for pollutant $p$:

$$EF_{p,age}(m) = EF_{p,base} \\cdot F_{age,p}(m)$$

where $m$ is odometer mileage in km.

For NOx / CO / HC / PM on light‑duty gasoline and diesel vehicles, a simple piecewise‑linear function in mileage that approximates measurements from Zanfagna et al. (2022) and the large UK remote‑sensing study can look like this:

**0–50,000 km:**
$$F_{age,p}(m) = 1.0$$

**50,000–100,000 km:**
$$F_{age,p}(m) = 1.0 + s_{1,p} \\frac{m - 50,000}{50,000}$$
with $s_{1,p} \\approx 0.2$  
*(grows from 1.0 at 50k to 1.2 at 100k km)*

**100,000–160,000 km:**
$$F_{age,p}(m) = 1.2 + s_{2,p} \\frac{m - 100,000}{60,000}$$
with $s_{2,p} \\approx 0.3$  
*(grows from 1.2 at 100k to 1.5 at 160k km)*

**160,000–240,000 km:**
$$F_{age,p}(m) = 1.5 + s_{3,p} \\frac{m - 160,000}{80,000}$$
with $s_{3,p} \\approx 0.7$  
*(grows from 1.5 at 160k to 2.2 at 240k km)*

**>240,000 km:**
$$F_{age,p}(m) = F_{age,p}(240,000) = 2.2 \\text{ (cap)}$$

### Implementation Example (TypeScript)
```typescript
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
```

## Rationale from field data
A large remote‑sensing study (~197,000 gasoline and diesel cars) found that by 200,000 km, average real‑world NOx and PM from gasoline cars increase to about 2.5–3× and diesel to about 1.3–1.5× relative to 50,000 km, with variation by Euro standard and pollutant; the proposed function gives around 2.0–2.2× at 200–240k as a fleet‑average compromise.

The “High Mileage Emission Deterioration Factors from Euro 6” study on matched low‑ vs high‑mileage vehicles (up to 240,000 km) reports that for some pollutants, deterioration factors continue to grow beyond the regulatory durability limit (160,000 km), reaching roughly 1.5×–2× or more at 200–240k km.

TNO’s review of deterioration and the EMEP/EEA guidebook recommends capping deterioration factors around 9 years or 120–160k km in official inventories to avoid unbounded growth; many national inventories adopt similar caps.

TRUE’s U.S. remote‑sensing analysis shows that a small share of the oldest vehicles contributes a disproportionately large share of fleet emissions, consistent with average deterioration plus a tail of high emitters; those high emitters should be modeled separately via a maintenance factor rather than making $F_{age}$ extremely large for everyone.

## Simple linear age‑in‑years variant (if mileage unknown)
If you only have age in years, a cruder but easy‑to‑implement function is:

$$F_{age,p}(y) = \\min(1 + a_p \\cdot y, \\; F_{max,p})$$

For a combined “typical” pollutant factor (for NOx/CO/HC/PM) on a reasonably maintained fleet:
- Use $a_p \\approx 0.04$ per year ($\\approx 4\\%$/year).
- Cap $F_{max,p} \\approx 2.0$ at ~20 years.

So:
- 0–5 years → 1.0–1.2
- 10 years → 1.4
- 15 years → 1.6
- 20+ years → capped at 2.0

This roughly matches remote‑sensing evidence that average real‑world NOx/CO/HC from light‑duty vehicles increase by on the order of 40–80% over 10–20 years, with the remainder of the very large fleet effects coming from a small subset of high emitters which you should treat via a separate maintenance / gross‑emitter factor.

## How to combine with maintenance
In your tool:
1. Use $F_{age}$ for normal in‑use deterioration of vehicles that are not obviously malfunctioning.
2. Use a separate maintenance factor $F_{maint}$ (e.g. 1.0 for well‑maintained, 1.5–2.0 for moderately neglected, 3–5+ for gross emitters) informed by I/M and OBD repair studies.

Total multiplier becomes:
$$F_{total,p} = F_{age,p} \\cdot F_{maint,p}$$
"""

# 2. Fuel_CO2_Factors.md
fuel_co2_content = """# Fuel CO₂ Factors and Calculations

Here are commonly used tank‑to‑wheel CO₂ factors per litre and per kWh for the main fuels, plus typical grid‑electricity factors and worked examples.

## Fuel CO₂ factors (per litre and per kWh)
All fuel factors below are direct combustion (tailpipe) only, not full life‑cycle, unless noted.

| Fuel | CO₂ per litre (kg CO₂/L) | CO₂ per kWh of fuel energy (kg CO₂/kWh) | Key data & assumptions |
| --- | --- | --- | --- |
| Gasoline | ≈ 2.30 kg CO₂/L | ≈ 0.26 kg CO₂/kWh | GHG Protocol training doc uses 2.30 kg CO₂/L; typical net energy ≈31.5 MJ/L ≈8.76 kWh/L. |
| Diesel | ≈ 2.65 kg CO₂/L | ≈ 0.27 kg CO₂/kWh | GHG Protocol uses 2.6533 kg CO₂/L; net energy ≈35.8 MJ/L ≈9.94 kWh/L. |
| LPG | ≈ 1.5–1.6 kg CO₂/L | ≈ 0.23 kg CO₂/kWh | DEFRA‑based factors give ~0.23 kg CO₂/kWh; NCV ≈6.84 kWh/L. |
| CNG / natural gas | n/a per litre | ≈ 0.20 kg CO₂/kWh; ≈ 2.7–2.8 kg CO₂/kg | DEFRA factors: natural gas/CNG ≈0.20 kg CO₂/kWh; ≈ 2.75 kg CO₂/kg CH₄. |
| Electricity (India grid) | – | ≈ 0.71 kg CO₂/kWh delivered | Indian Central Electricity Authority baseline database v21 (0.710 kg/kWh). |
| Electricity (US average) | – | ≈ 0.39 kg CO₂/kWh delivered | US EPA equivalencies calculator gives ≈0.39 kg CO₂/kWh. |

*Notes:*
- Gasoline and diesel per‑litre factors come from GHG Protocol / EPA style inventories.
- LPG and natural gas/CNG per‑kWh factors come from DEFRA 2024 conversion factors.
- For CNG, it is more practical to use kg of gas or kWh rather than litres.

## Electricity grid CO₂ factors
Electricity factors are location‑specific:
- **India grid average (location‑based Scope 2):** 0.710 kg CO₂/kWh.
- **Lower‑carbon grid example (US average):** 0.39 kg CO₂/kWh.

For your tool you can:
- Default to `0.71 kg CO₂/kWh` for India.
- Allow override so users can plug in a custom grid factor or renewable tariff factor.

## Worked calculation examples

### 1. Petrol car: CO₂ from a given fuel volume
Assume a car uses 40 L of gasoline on city driving. Use gasoline factor 2.30 kg CO₂/L.

$$CO_2 = 40 \\text{ L} \\times 2.30 \\text{ kg CO}_2\\text{/L} = 92 \\text{ kg CO}_2$$

If the 40 L covers 500 km, emissions are:
$$92 \\text{ kg} / 500 \\text{ km} = 0.184 \\text{ kg/km} = 184 \\text{ g/km}$$

*(This lines up with typical petrol car CO₂ intensities: ~120–200 g/km)*

### 2. Diesel car: from fuel economy (L/100 km) to g CO₂/km
Assume a diesel car has 5.5 L/100 km fuel consumption.

Convert to L/km: 
$$5.5 / 100 = 0.055 \\text{ L/km}$$

Use diesel factor 2.6533 kg CO₂/L:
$$CO_2\\text{/km} = 0.055 \\text{ L/km} \\times 2.6533 \\text{ kg CO}_2\\text{/L} \\approx 0.146 \\text{ kg/km} = 146 \\text{ g/km}$$

### 3. LPG vehicle: converting per‑kWh factor to per‑litre
Suppose you have only per‑kWh LPG factors. Energy content: 6.84 kWh/L. Emission factor: 0.23 kg CO₂/kWh.

$$CO_2\\text{/L} = 6.84 \\text{ kWh/L} \\times 0.23 \\text{ kg CO}_2\\text{/kWh} \\approx 1.57 \\text{ kg CO}_2\\text{/L}$$

If an LPG taxi uses 8 L/100 km:
$$CO_2\\text{/km} = 0.08 \\text{ L/km} \\times 1.57 \\text{ kg/L} \\approx 0.126 \\text{ kg/km} = 126 \\text{ g/km}$$

### 4. CNG car: from energy use to CO₂
For CNG (or natural gas). DEFRA‑based factors give 0.20 kg CO₂/kWh. Engineering Toolbox gives 2.75 kg CO₂/kg CH₄.

If a CNG car uses 0.20 kg/km:
$$CO_2\\text{/km} = 0.20 \\text{ kg gas/km} \\times 2.75 \\text{ kg CO}_2\\text{/kg gas} = 0.55 \\text{ kg/km} = 550 \\text{ g/km}$$
*(Note: this is a very inefficient or heavy vehicle; typical passenger CNG cars consume less).*

Alternatively, if you know energy use is 0.7 kWh/km at the engine:
$$CO_2\\text{/km} = 0.7 \\text{ kWh/km} \\times 0.20 \\text{ kg CO}_2\\text{/kWh} = 0.14 \\text{ kg/km} = 140 \\text{ g/km}$$

### 5. BEV or PHEV in electric mode: from kWh/km to g CO₂/km
Assume BEV consumption: 0.18 kWh/km at the plug, and India grid factor: 0.71 kg CO₂/kWh.

$$CO_2\\text{/km} = 0.18 \\text{ kWh/km} \\times 0.71 \\text{ kg CO}_2\\text{/kWh} \\approx 0.128 \\text{ kg/km} = 128 \\text{ g/km}$$

If you change the grid factor to a cleaner system (e.g. US at 0.39 kg CO₂/kWh):
$$0.18 \\times 0.39 \\approx 0.070 \\text{ kg/km} = 70 \\text{ g/km}$$

---

## TypeScript Feature: CO₂ Calculator Utility
```typescript
/** 
 * Utility functions for calculating CO2 emissions based on fuel factors.
 */
export const FUEL_CO2_FACTORS = {
  GASOLINE_KG_PER_L: 2.30,
  DIESEL_KG_PER_L: 2.6533,
  LPG_KG_PER_L: 1.57,
  CNG_KG_PER_KG: 2.75,
  ELECTRIC_INDIA_KG_PER_KWH: 0.71
};

export function calculateTailpipeCO2FromEconomy(litersPer100Km: number, fuelFactorKgPerL: number): number {
  const litersPerKm = litersPer100Km / 100;
  return litersPerKm * fuelFactorKgPerL * 1000; // Returns g/km
}

export function calculateEVGridCO2(kwhPerKm: number, gridFactorKgPerKwh: number = FUEL_CO2_FACTORS.ELECTRIC_INDIA_KG_PER_KWH): number {
  return kwhPerKm * gridFactorKgPerKwh * 1000; // Returns g/km
}
```
"""

with open(f"{base_path}Age_Factor.md", "w") as f:
    f.write(age_factor_content)
    
with open(f"{base_path}Fuel_CO2_Factors.md", "w") as f:
    f.write(fuel_co2_content)

# Wrapping JSON docs
def wrap_json_doc(filename, title, feature_ts_snippet):
    filepath = f"{base_path}{filename}"
    with open(filepath, "r") as f:
        content = f.read().strip()
        
    # Remove existing markdown code wrapper if it manually has it just in case
    content = re.sub(r"^```json\s*", "", content)
    content = re.sub(r"```\s*$", "", content)

    markdown = f"# {title}\\n\\n"
    markdown += "This document contains data parameters and properties for related modeling logic.\\n\\n"
    markdown += "## Source Data\\n"
    markdown += "```json\\n" + content + "\\n```\\n\\n"
    markdown += "## Programming Implementation Feature\\n\\n"
    markdown += "```typescript\\n" + feature_ts_snippet + "\\n```\\n"

    with open(filepath, "w") as f:
        f.write(markdown)

# 3. 20to30km.md
feature_20to30km = """export interface CitySpeedEmissionFactors {
    vehicle_class: string;
    notes: string;
    CO2_g_per_km: { range: [number, number], source: string };
    CO_g_per_km: { range: [number, number], source: string };
    HC_g_per_km?: { range: [number, number], source: string };
    NOx_g_per_km?: { range: [number, number], source: string };
    PM_g_per_km?: { range: [number, number], source: string };
    HC_plus_NOx_g_per_km?: { range: [number, number], source: string };
}"""
wrap_json_doc("20to30km.md", "City Speed Emissions (20–30 km/h)", feature_20to30km)

# 4. Cold_start_emission.md
feature_cold = """export interface ColdStartMultiplier {
    vehicle_type: string;
    pollutant_group: string;
    ambient_temp_band_C: string;
    trip_type: string;
    multiplier_range: [number, number];
    interpretation: string;
    references: string[];
}

export function applyColdStartMultiplier(hotEmission: number, multiplierValue: number): number {
    return hotEmission * multiplierValue;
}"""
wrap_json_doc("Cold_start_emission.md", "Cold Start Emission Multipliers", feature_cold)

# 5. Fuel_Consumption.md
feature_fuel_cons = """export interface FuelConsumptionFormula {
    description: string;
    assumptions: Record<string, any>;
    formulas: Record<string, any>;
    example: Record<string, any>;
}

export function calculateCO2Emission(fcLitersPer100Km: number, efKgPerLiter: number): number {
    // Computes Fuel_cons * EF * 10 directly
    return fcLitersPer100Km * efKgPerLiter * 10;
}"""
wrap_json_doc("Fuel_Consumption.md", "Fuel Consumption and Tailpipe Calculations", feature_fuel_cons)

# 6. emission_factors.md
feature_ef = """export interface EmissionFactorModel {
    id: string;
    name: string;
    description: string;
    emission_processes: string[];
    core_equation: string;
    notes: string;
}

export interface EmissionFactorRow {
    vehicle_class: string;
    fuel: string;
    metric: string;
    CO2_ef: string;
    NOx_ef: string;
    PM_ef: string;
    VOC_ef: string;
}

export interface AppEmissionData {
    factors: EmissionFactorModel[];
    emission_factors_table: {
        rows: EmissionFactorRow[];
    };
    formulas: Record<string, any>;
    adjustments: Record<string, any>;
}"""
wrap_json_doc("emission_factors.md", "Master Emission Factors Model and Attributes", feature_ef)
