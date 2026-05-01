# Emission-Sense: Vehicle Pollution Estimation Methodology

**Version:** 2.0 | **Date:** April 2026  
**Context:** India-specific multi-pollutant road transport emission model

---

## Abstract

Emission-Sense calculates real-world vehicle pollution using a nine-stage multiplicative emission model. Starting from certified Bharat Stage (BS) base emission factors, the model applies scientifically grounded correction multipliers for vehicle age, maintenance, driving conditions, engine technology, cold-start phases, non-exhaust particulate matter, and evaporative hydrocarbons. The final output provides daily mass estimates (grams/day) for CO₂, NOₓ, PM₂.₅, CO, and HC.

---

## 1. Pollutants Tracked

| Pollutant | Unit | Relevance |
|-----------|------|-----------|
| CO₂ | kg/day | Primary greenhouse gas |
| NOₓ | g/day | Smog, respiratory irritant, acid rain |
| PM₂.₅ | g/day | Deep lung penetration |
| CO | g/day | Toxic asphyxiant |
| HC | g/day | Smog precursor, carcinogenic VOCs |

---

## 2. Stage 1 — Base Emission Factors (EF_DB)

Base EFs (g/km) derived from ARAI type-approval data aligned with BS limits and EMEP/EEA hot exhaust inventory data.

### Bharat Stage Type-Approval Limits (Petrol Passenger Car)

| Standard | Year (National) | CO (g/km) | HC (g/km) | NOₓ (g/km) | PM (g/km) | Euro Equiv. |
|----------|-----------------|-----------|-----------|------------|-----------|-------------|
| BS II | 2005 | 2.2 | 0.50 (HC+NOₓ) | — | — | Euro 2 |
| BS III | 2010 | 2.3 | 0.20 | 0.15 | 0.025 | Euro 3 |
| BS IV | 2017 | 1.0 | 0.10 | 0.08 | 0.025 | Euro 4 |
| BS VI | 2020 | 1.0 | 0.10 | 0.06 | 0.0045 | Euro 6 |

> **Sources:** DieselNet — *India Emission Standards* (dieselnet.com/standards/in); ARAI *Indian Emission Regulation Booklet*; MoRTH CMVR BS VI notification (2016).

### EF_DB Sample Values — Petrol Car, City (g/km)

| Standard | CO₂ | NOₓ | PM₂.₅ | CO | HC |
|----------|-----|-----|-------|----|----|
| BS II | 210 | 0.80 | 0.060 | 12.0 | 2.8 |
| BS III | 195 | 0.55 | 0.050 | 7.5 | 2.0 |
| BS IV | 175 | 0.35 | 0.030 | 4.5 | 1.2 |
| BS VI | 150 | 0.12 | 0.010 | 1.8 | 0.5 |

> CO₂ values consistent with Clean Air Task Force estimates (~144 g/km average for Indian petrol cars) and IPCC fuel-based calculations.

---

## 3. Stage 2 — Age & Mileage Deterioration

### Estimated Mileage
```
Odometer_est = Age_years × Daily_km × 365
```

### Toxic Pollutant Factor (f_age_toxic)

| Mileage Band | f_age_toxic | Note |
|-------------|-------------|------|
| 0 – 50,000 km | 1.00 | Catalyst in-spec |
| 50,000 – 100,000 km | 1.00 → 1.20 | Linear ramp |
| 100,000 – 160,000 km | 1.20 → 1.50 | Accelerated wear |
| 160,000 – 240,000 km | 1.50 → 2.20 | Gross emitter zone |
| > 240,000 km | 2.20 (cap) | — |

### CO₂-Specific Factor (f_age_co2)
```
f_age_co2 = 1.0 + 0.05 × (mileage − 50,000) / 150,000    [50k–200k km]
f_age_co2 = 1.05 (capped)
```
Fuel efficiency degrades ≤5%; catalyst-dependent toxics can double.

> **Sources:** Ricardo — *Real-world emission deterioration study*; MDPI *Atmosphere* (2020) — "Emission Deterioration Factors"; EMEP/EEA Guidebook 2023 §1.A.3.b.i deterioration section.

---

## 4. Stage 3 — Maintenance Multipliers

| Maintenance | NOₓ | CO | PM₂.₅ | HC | CO₂ |
|------------|-----|----|----|----|----|
| Good | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 |
| Average | 1.20 | 1.50 | 1.50 | 1.50 | 1.05 |
| Poor (Gross Emitter) | 3.00 | 4.00 | 8.00 | 5.00 | 1.15 |

> **Sources:** EMEP/EEA Guidebook 2023 — Gross Emitter model; Borken-Kleefeld et al. (2017) *Environ. Sci. Technol.* — high-emitter fleet contribution; EPA MOVES3 maintenance adjustment factors.

---

## 5. Stage 4 — Driving Condition Multipliers

### AC Usage (research: AC increases fuel consumption 5–25%, typically 10–15%)

| AC | CO₂ | NOₓ | CO |
|----|-----|-----|-----|
| None | ×0.95 | ×0.95 | ×1.00 |
| Moderate | ×1.00 | ×1.00 | ×1.00 |
| Heavy | ×1.15 | ×1.25 | ×1.20 |

### Traffic Intensity

| Traffic | CO₂ | NOₓ | CO | PM₂.₅ |
|---------|-----|-----|-----|------|
| Low | ×0.90 | ×0.85 | ×0.80 | ×0.90 |
| Medium | ×1.00 | ×1.00 | ×1.00 | ×1.00 |
| High | ×1.20 | ×1.40 | ×1.50 | ×1.30 |

### Load Factor
```
CO₂ × (1 + (loadFactor − 1) × 0.10)
NOₓ × (1 + (loadFactor − 1) × 0.15)
```

> **Sources:** EMEP/EEA 2023 speed/traffic dependency; Dardiotis et al. (2013) *Appl. Energy* — AC real-world effects; EPA420-R-04-005 — AC fuel economy impact.

---

## 6. Stage 5 — Engine Technology Multipliers

| Technology | CO₂ | NOₓ | PM₂.₅ |
|-----------|-----|-----|------|
| Turbocharged | ×0.95 | ×1.10 | ×1.15 |
| GDI injection | ×1.00 | ×1.00 | ×1.50 |
| Automatic/AMT | ×1.05 | ×1.00 | ×1.00 |
| CVT | ×0.98 | ×1.00 | ×1.00 |

GDI PM₂.₅ factor: studies show 1–2× higher PM mass vs MPFI; elemental carbon 6–14× higher under cold-start.

> **Sources:** Khalek et al. (2010) SAE Int. J. *Fuels Lubr.*; MDPI *Energies* (2021) GDI vs PFI comparison; Concawe (2019) real-world GDI PM.

---

## 7. Stage 6 — Hot-Running Emissions

```
E_hot[p] = (adjEF_city[p] × d_city) + (adjEF_hwy[p] × d_hwy)

d_city = D_total × (cityPct / 100)
d_hwy  = D_total × (1 − cityPct / 100)
adjEF  = baseEF × f_age × f_maint × f_drive × f_tech
```

---

## 8. Stage 7 — Cold-Start Excess Emissions (COPERT)

```
d_cold  = min(1.5 km, D_total/n_trips) × n_trips
E_cold[p] = d_cold × adjEF_city[p] × (CS_mult[p] − 1.0)
```

### Cold-Start Multipliers (Temperate ~20°C)

| Pollutant | Petrol/CNG/Hybrid | Diesel |
|-----------|------------------|--------|
| CO₂ | 1.20 | 1.15 |
| NOₓ | 1.80 | 2.00 |
| PM₂.₅ | 2.50 | 3.00 |
| CO | 6.00 | 2.00 |
| HC | 5.00 | 2.50 |

> **Sources:** Ntziachristos & Samaras (2017) EMEP/EEA Guidebook cold-start chapter; André et al. (2006) *Atmos. Environ.* 40(27); COPERT 5 documentation (emisia.com).

---

## 9. Stage 8 — Non-Exhaust PM₂.₅ (EMEP/EEA 2023)

```
PM_tyre         = EF_tyre  (mg/km) × D_total / 1000    [g]
PM_brake        = EF_brake (mg/km) × D_total / 1000    [g]
PM_non_exhaust  = PM_tyre + PM_brake

EVs: PM_brake × 0.90  (10% reduction via regenerative braking)
```

### Non-Exhaust EF Table (PM₂.₅, mg/km)

| Vehicle | Tyre | Brake | Reference |
|---------|------|-------|-----------|
| 2-Wheeler | 2.0 | 1.5 | EMEP/EEA NFR 1.A.3.b.vi |
| Car | 8.0 | 5.0 | EMEP/EEA Tier 2 |
| SUV | 12.0 | 8.0 | EMEP/EEA Tier 2 |
| Bus/Truck | 30.0 | 20.0 | EMEP/EEA HCV table |

PM₂.₅ fraction of tyre TSP ≈ 0.42 (EMEP/EEA 2023, NFR 1.A.3.b.vi).

> **Sources:** EMEP/EEA Guidebook 2023 NFR 1.A.3.b.vi; Grigoratos & Martini (2015) *Environ. Sci. Pollut. Res.* 22(4):2491–2504; Harrison et al. (2021) *Environ. Int.* 149:106363.

---

## 10. Stage 9 — Evaporative HC

```
E_evap = (D_total × 0.05 g/km) + (1.5 g/trip × n_trips)   [petrol/hybrid]
E_evap × 0.10                                               [CNG]
E_evap = 0                                                  [diesel/EV]
```

| Component | Factor | Unit |
|-----------|--------|------|
| Running loss | 0.05 | g/km |
| Hot-soak | 1.5 | g/trip |

> **Sources:** EMEP/EEA 2023 NFR 1.A.3.b.v — evaporative emissions; US EPA MOVES3 evaporative model; UNECE GTR 19.

---

## 11. CO₂ — Two Calculation Paths

### Path A: EF_DB lookup (fuel efficiency unknown)
```
finalCO2 = (E_hot_CO2 + E_cold_CO2) / 1000    [kg]
```

### Path B: Fuel-efficiency override (preferred)
```
L_consumed = D_total / KMPL
CO2_fuel   = L_consumed × CO2_factor × f_drive_CO2 × f_maint_CO2 × f_weight
finalCO2   = CO2_fuel + (E_cold_CO2 / 1000)
```

### Fuel CO₂ Factors

| Fuel | Factor | Unit | Source |
|------|--------|------|--------|
| Petrol | 2.30 | kg/L | IPCC 2006 Vol.2 Ch.1 |
| Diesel | 2.6533 | kg/L | IPCC 2006 Vol.2 Ch.1 |
| CNG | 2.75 | kg/kg | IPCC (56,100 kg/TJ × ~49 MJ/kg NCV) |

---

## 12. EV Grid CO₂

```
CO2_ev = (kWh/km ÷ 0.90) × 0.727 kg/kWh × D_total    [kg]
```

| Vehicle | kWh/km |
|---------|--------|
| 2-Wheeler | 0.030 |
| Car | 0.150 |
| SUV | 0.220 |
| Bus | 1.200 |
| Truck | 1.500 |

> Grid EF = **0.727 kg CO₂/kWh** = CEA v20.0 (Dec 2024), FY 2023–24 weighted average.  
> **Source:** CEA — *CO₂ Baseline Database for Indian Power Sector v20.0* (December 2024).

---

## 13. Vehicle Weight Penalty (CO₂)

```
excess_steps = (kerbWeight_kg − 1500) / 100
CO2_city *= (1 + excess_steps × 0.04)    [4%/100 kg, city]
CO2_hwy  *= (1 + excess_steps × 0.03)    [3%/100 kg, highway]
```

> **Source:** UNECE GRPE WLTP mass sensitivity working papers; ICCT mass-CO₂ regression for EU passenger cars (~3.5%/100 kg).

---

## 14. Service & Health Multipliers

| Condition | Affected Pollutant | Formula |
|-----------|--------------------|---------|
| Oil overdue | CO | `1 + min(months_overdue × 0.05, 0.30)` |
| PUC expired (>180d) | CO, HC | CO +10%; HC +7% |
| PUC severely expired (>270d) | CO, HC | CO +20%; HC +15% |
| Air filter clogged | CO₂ | `+3% per 90-day interval overdue` |
| Mileage drop | CO₂ | `+ (orig−curr)/orig` fractional penalty |
| Rough engine noise | NOₓ | `+15%` |
| Poor engine condition | PM₂.₅ | `×1.3` (average), `×1.8` (poor) |
| Visible smoke | PM₂.₅ | `×1.3` (low), `×2.2` (high) |

> **Sources:** SIAM service interval standards; CMVR Rule 115B — PUC validity 180 days; EMEP I&M program gross-emitter research.

---

## 15. Final Output

```
Total_CO₂   = finalCO2 × co2_mult                                     [kg/day]
Total_NOₓ   = (E_hot_NOx  + E_cold_NOx)  × nox_mult                   [g/day]
Total_PM₂.₅ = (E_hot_PM25 + E_cold_PM25 + PM_non_exhaust) × pm25_mult  [g/day]
Total_CO    = (E_hot_CO   + E_cold_CO)   × co_mult                    [g/day]
Total_HC    = (E_hot_HC   + E_cold_HC   + E_evap_HC) × hc_mult         [g/day]
```

---

## 16. Complete Reference List

1. DieselNet — *India Emission Standards*, dieselnet.com/standards/in (Rev. 2018)
2. ARAI — *Indian Emission Regulation Booklet*, Automotive Research Association of India, Pune
3. MoRTH — CMVR BS VI Notification, Ministry of Road Transport & Highways (2016)
4. EMEP/EEA — *Air Pollutant Emission Inventory Guidebook 2023*, European Environment Agency
   - §1.A.3.b.i: Hot exhaust road transport
   - §1.A.3.b.ii: Cold-start excess emissions
   - §1.A.3.b.v: Evaporative emissions
   - §1.A.3.b.vi: Tyre and brake wear (NFR code)
5. COPERT 5 — emisia.com — Cold-start emission methodology documentation
6. IPCC (2006) — *Guidelines for National GHG Inventories*, Vol. 2 Energy, Ch. 1
7. GHG Protocol — *Mobile Combustion Technical Guidance*, WRI (2015)
8. CEA — *CO₂ Baseline Database for the Indian Power Sector, Version 20.0* (December 2024)
9. Ntziachristos, L. & Samaras, Z. (2017) — Hot/cold-start EF update, EMEP/EEA Guidebook
10. André, M. et al. (2006) — "Cold-start excess emissions", *Atmos. Environ.* 40(27)
11. Grigoratos, T. & Martini, G. (2015) — "Brake wear PM: a review", *Environ. Sci. Pollut. Res.* 22(4):2491–2504
12. Harrison, R.M. et al. (2021) — "Non-exhaust vehicle PM", *Environ. Int.* 149:106363
13. Khalek, I.A. et al. (2010) — "Gaseous and PM from a 2009 GDI engine", SAE Int. J. Fuels Lubr.
14. Borken-Kleefeld, J. et al. (2017) — "Identifying high emitters", *Environ. Sci. Technol.* 51(7)
15. Dardiotis, C. et al. (2013) — "Low-temperature cold-start gaseous emissions", *Appl. Energy* 111:468–478
16. EPA (2004) — *Fuel Economy and Emissions: Effects of AC*, EPA420-R-04-005
17. UNECE GTR 19 — *Worldwide Harmonized Evaporative Emission Test Procedure*
18. Clean Air Task Force (2022) — *India On-Road Vehicle Emissions: CO₂ Estimates*
19. ICCT (2021) — *Mass and CO₂ correlation for passenger vehicles*
