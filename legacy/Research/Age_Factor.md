# Age-Related Deterioration Factor

A practical way to model age‑related deterioration in a web tool is to use a piecewise mileage‑based multiplier with gentle slopes at low mileage and steeper slopes at higher mileage, capped around 200–240 thousand km as suggested by European guidance and recent field studies.

Below is a simple function you can implement.

## Recommended multiplicative age function (by mileage)
Define a deterioration factor $F_{age,p}$ that multiplies your baseline emission factor $EF_{p,base}$ for pollutant $p$:

$$EF_{p,age}(m) = EF_{p,base} \cdot F_{age,p}(m)$$

where $m$ is odometer mileage in km.

For NOx / CO / HC / PM on light‑duty gasoline and diesel vehicles, a simple piecewise‑linear function in mileage that approximates measurements from Zanfagna et al. (2022) and the large UK remote‑sensing study can look like this:

**0–50,000 km:**
$$F_{age,p}(m) = 1.0$$

**50,000–100,000 km:**
$$F_{age,p}(m) = 1.0 + s_{1,p} \frac{m - 50,000}{50,000}$$
with $s_{1,p} \approx 0.2$  
*(grows from 1.0 at 50k to 1.2 at 100k km)*

**100,000–160,000 km:**
$$F_{age,p}(m) = 1.2 + s_{2,p} \frac{m - 100,000}{60,000}$$
with $s_{2,p} \approx 0.3$  
*(grows from 1.2 at 100k to 1.5 at 160k km)*

**160,000–240,000 km:**
$$F_{age,p}(m) = 1.5 + s_{3,p} \frac{m - 160,000}{80,000}$$
with $s_{3,p} \approx 0.7$  
*(grows from 1.5 at 160k to 2.2 at 240k km)*

**>240,000 km:**
$$F_{age,p}(m) = F_{age,p}(240,000) = 2.2 \text{ (cap)}$$

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

$$F_{age,p}(y) = \min(1 + a_p \cdot y, \; F_{max,p})$$

For a combined “typical” pollutant factor (for NOx/CO/HC/PM) on a reasonably maintained fleet:
- Use $a_p \approx 0.04$ per year ($\approx 4\%$/year).
- Cap $F_{max,p} \approx 2.0$ at ~20 years.

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
$$F_{total,p} = F_{age,p} \cdot F_{maint,p}$$
