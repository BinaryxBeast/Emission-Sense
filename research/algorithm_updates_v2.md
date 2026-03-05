# Emission-Sense V2 Algorithms

## 1. Real-World Driving Conditions
We implemented driving condition modifiers to better model actual emissions over base ARAI/NEDC factors.
- **Traffic Intensity**: High traffic (stop & go) inherently causes more braking, idling, and lower gear driving. Modeled as a global multiplier for NOx, CO, and PM (e.g. `+40%` for NOx in heavy traffic).
- **AC Usage**: Modeled as an accessory load that draws power directly from the engine, increasing fuel consumption and proportional emissions by 15-20%.
- **Idling Penalties**: Idle fuel consumption adds roughly 1.4kg CO2 per hour (or ~23g per minute) for an average car, alongside a massive hit to localized CO.

## 2. Advanced Cold-Start Logic (Trip Length)
Short trips never allow the catalytic converter to reach optimal light-off temperatures.
- **Extreme Short Trips (<5 km)**: Unburned Hydrocarbons (HC) and CO spike up to 3x standard emission factors.
- **Cold Climate Modifier**: Colder outside temperatures further amplify this cold-start ratio compared to warm climates where engine temperatures normalize faster.

## 3. Weight & Load Factors
- A heavier vehicle inherently requires more kinetic energy to move.
- We apply continuous exact kerb weight extraction from Gemini dynamically to scale the fuel efficiency.
- Load factors (1 person vs full cargo) exponentially raise the engine load, impacting CO2 generation per km.

## 4. Particulate Matter Enhancements (Tyres/Brakes)
Exhaust is not the only source of PM2.5. We've enhanced non-exhaust particulate calculations by scaling base wear factors utilizing compound modeling:
- **Performance Tyres**: Increase wear rates (+20%) compared to Eco/Hard compound tyres.
- **Brake Dust**: Discs generally produce slightly more atmospheric particulate matter than enclosed drum brake linings. Regenerative braking (EVs) reduces mechanical braking wear.

## 5. Gemini Smart Extraction Schema
We utilized an expanded JSON schema via the `gemini-2.5-flash` model:
- Detected exact displacements, cylinders, gearboxes, and fuel injection topologies (like PM-intensive GDI directly factored into coefficients).
- Derived "Confidence Scores" to enforce UI transparency on data quality.
