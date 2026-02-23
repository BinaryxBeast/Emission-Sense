# Fuel CO₂ Factors and Calculations

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

$$CO_2 = 40 \text{ L} \times 2.30 \text{ kg CO}_2\text{/L} = 92 \text{ kg CO}_2$$

If the 40 L covers 500 km, emissions are:
$$92 \text{ kg} / 500 \text{ km} = 0.184 \text{ kg/km} = 184 \text{ g/km}$$

*(This lines up with typical petrol car CO₂ intensities: ~120–200 g/km)*

### 2. Diesel car: from fuel economy (L/100 km) to g CO₂/km
Assume a diesel car has 5.5 L/100 km fuel consumption.

Convert to L/km: 
$$5.5 / 100 = 0.055 \text{ L/km}$$

Use diesel factor 2.6533 kg CO₂/L:
$$CO_2\text{/km} = 0.055 \text{ L/km} \times 2.6533 \text{ kg CO}_2\text{/L} \approx 0.146 \text{ kg/km} = 146 \text{ g/km}$$

### 3. LPG vehicle: converting per‑kWh factor to per‑litre
Suppose you have only per‑kWh LPG factors. Energy content: 6.84 kWh/L. Emission factor: 0.23 kg CO₂/kWh.

$$CO_2\text{/L} = 6.84 \text{ kWh/L} \times 0.23 \text{ kg CO}_2\text{/kWh} \approx 1.57 \text{ kg CO}_2\text{/L}$$

If an LPG taxi uses 8 L/100 km:
$$CO_2\text{/km} = 0.08 \text{ L/km} \times 1.57 \text{ kg/L} \approx 0.126 \text{ kg/km} = 126 \text{ g/km}$$

### 4. CNG car: from energy use to CO₂
For CNG (or natural gas). DEFRA‑based factors give 0.20 kg CO₂/kWh. Engineering Toolbox gives 2.75 kg CO₂/kg CH₄.

If a CNG car uses 0.20 kg/km:
$$CO_2\text{/km} = 0.20 \text{ kg gas/km} \times 2.75 \text{ kg CO}_2\text{/kg gas} = 0.55 \text{ kg/km} = 550 \text{ g/km}$$
*(Note: this is a very inefficient or heavy vehicle; typical passenger CNG cars consume less).*

Alternatively, if you know energy use is 0.7 kWh/km at the engine:
$$CO_2\text{/km} = 0.7 \text{ kWh/km} \times 0.20 \text{ kg CO}_2\text{/kWh} = 0.14 \text{ kg/km} = 140 \text{ g/km}$$

### 5. BEV or PHEV in electric mode: from kWh/km to g CO₂/km
Assume BEV consumption: 0.18 kWh/km at the plug, and India grid factor: 0.71 kg CO₂/kWh.

$$CO_2\text{/km} = 0.18 \text{ kWh/km} \times 0.71 \text{ kg CO}_2\text{/kWh} \approx 0.128 \text{ kg/km} = 128 \text{ g/km}$$

If you change the grid factor to a cleaner system (e.g. US at 0.39 kg CO₂/kWh):
$$0.18 \times 0.39 \approx 0.070 \text{ kg/km} = 70 \text{ g/km}$$

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
