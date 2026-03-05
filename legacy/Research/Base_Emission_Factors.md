Emission Sense: Base Emission Factors ($EF_{DB}$) Research

This document provides the technical foundation for calculating vehicle emissions based on activity data. It covers the categorization of pollutants, the mathematical formulas for base rates, and the adjustments required for real-world scenarios.

1. The General Emission Equation

The total emission for a specific pollutant is calculated by multiplying the distance traveled by the specific factor retrieved from the database ($EF_{DB}$), adjusted by environmental and behavioral variables.

$$E_{i} = \sum (D \times EF_{db(v, f, s, t)} \times f_{age} \times CF_{env} \times CF_{style})$$

Variables:

$E_{i}$: Total mass of pollutant $i$ (grams).

$D$: Distance traveled (kilometers).

$EF_{db}$: Base Emission Factor ($g/km$).

$f_{age}$: Age Deterioration correction factor.

$CF_{env}$: Environmental/Traffic correction factor.

$CF_{style}$: Driving style/behavior correction factor.

2. Categorization Framework

To accurately select an $EF_{DB}$, the system must categorize the vehicle based on the following four pillars:

A. Vehicle Type ($v$)

Category

Description

2W

Two-wheelers (Scooters, Motorcycles < 150cc and > 150cc)

3W

Three-wheelers (Passenger and Goods carriers)

PV

Passenger Vehicles (Hatchbacks, Sedans, SUVs)

LCV

Light Commercial Vehicles (Delivery vans)

HCV

Heavy Commercial Vehicles (Trucks, Buses)

B. Fuel Type ($f$)

Petrol: High $CO$, lower $NO_x$.

Diesel: High $NO_x$ and $PM_{2.5}$.

CNG/LPG: Lower $PM$ and $CO_2$.

Electric (EV): $0$ Tailpipe emissions (Use "Well-to-Wheel" factors if needed).

C. Emission Standards ($s$)

In India, the Bharat Stage (BS) standards define the legal limits which serve as the $EF_{DB}$ baseline:

BS-II & BS-III: Legacy vehicles (High pollution).

BS-IV: Standard for vehicles manufactured 2010–2020.

BS-VI: Current stringent standard (Deep reduction in $NO_x$ and $PM$).

D. Driving Cycle ($t$)

City (Urban): Low speed, frequent idling, stop-and-go. Higher $g/km$.

Highway: Steady high speed, optimal engine temperature. Lower $g/km$.

3. Pollutant-Specific Base Factors ($g/km$)

Below are the approximate base emission factors derived from BS-IV and BS-VI limits for Passenger Vehicles.

Passenger Cars (Diesel)

Standard

$CO$

$NO_x$

$PM_{2.5}$

$HC + NO_x$

BS-IV

0.50

0.25

0.025

0.30

BS-VI

0.50

0.08

0.0045

0.17

Passenger Cars (Petrol)

Standard

$CO$

$NO_x$

$PM_{2.5}$

$HC$

BS-IV

1.00

0.08

-

0.10

BS-VI

1.00

0.06

-

0.06

4. $CO_2$ Calculation (Carbon Mass Balance)

$CO_2$ is not a toxic pollutant limited by BS standards in the same way; it is a function of fuel efficiency.

$$EF_{CO2} = \frac{\text{Fuel Consumption (L/km)} \times \text{Density (g/L)} \times \text{Carbon Content} \times 44}{12}$$

Standard $CO_2$ Factors:

Petrol: ~2,310 $g/L$

Diesel: ~2,680 $g/L$

CNG: ~2,660 $g/kg$

5. Correction Factors ($CF$)

Driving Cycle Adjustment ($CF_{env}$)

Condition

Multiplier for $NO_x$

Multiplier for $CO$

Highway

1.0

1.0

City/Urban

1.4

1.6

Idle (per min)

Calculated as $g/min$

Calculated as $g/min$

Driving Style Adjustment ($CF_{style}$)

Driving behavior heavily impacts the air-fuel mixture and combustion efficiency. "Aggressive" driving (rapid acceleration and hard braking) drastically spikes transient emissions.

Smooth (Eco-Driving): $1.0\times$ multiplier (Baseline lab conditions).

Aggressive Driving: Forces the engine to run "rich" (excess fuel) and creates extreme combustion chamber heat, circumventing the catalytic converter's efficiency.

$NO_x$ Multiplier: $\sim 1.50\times$ to $2.00\times$ (Due to heat spikes).

$PM_{2.5}$ Multiplier: $\sim 1.50\times$ to $2.00\times$ (Due to unburnt fuel under heavy load).

$CO_2$ & $CO$ Multiplier: $\sim 1.20\times$ to $1.30\times$ (Due to increased fuel consumption).

Age Deterioration Factor ($f_{age}$)

Vehicle emissions increase over time due to the chemical and physical degradation of exhaust after-treatment systems (such as Catalytic Converters and Diesel Particulate Filters) and engine wear. In accordance with methodologies outlined in the EMEP/EEA air pollutant emission inventory guidebook and COPERT models, deterioration is modeled as a linear function of accumulated mileage, up to a maximum "useful life" cap.

1. Odometer Reading (Actual Mileage)
The most accurate method to calculate emission degradation is by using the exact Odometer Reading. This eliminates the guesswork of relying on broad age estimates. If the exact odometer reading is completely unavailable, accumulated mileage can be approximated as a fallback:

$$\text{Estimated Mileage} = \text{Age (Years)} \times \text{Daily Distance (km)} \times 365$$

2. Calculating the Deterioration Multiplier ($f_{age}$)
The multiplier scales linearly from 1.0 (brand new vehicle) up to a maximum of 2.2 (severely degraded/end-of-life vehicle) based on a standard lifetime threshold (e.g., $160,000 \text{ km}$).

$$f_{age} = 1.0 + \left( \frac{\text{Actual Odometer Reading}}{\text{Max Lifetime Mileage}} \times (2.2 - 1.0) \right)$$

Implementation Rules for $f_{age}$:

Base state: At $0 \text{ km}$, $f_{age} = 1.0$.

Scaling: For a typical passenger car, if the "Max Lifetime Mileage" is set to $160,000 \text{ km}$, the factor increases steadily as actual mileage grows.

The Cap: Emissions do not deteriorate infinitely. Once a vehicle surpasses the maximum lifetime mileage, the degradation plateaus. Therefore, you must cap the equation:
$f_{age} \le 2.2$

Note on $CO_2$: The deterioration factor $f_{age}$ primarily applies to toxic pollutants ($NO_x, CO, HC, PM$). $CO_2$ emissions deteriorate at a much slower, near-negligible rate (mostly tied to minor losses in fuel efficiency) and generally do not use the 2.2 multiplier scale.

6. Implementation Logic Flow

Input: User provides Odometer_Reading (primary), Vehicle_Type, Fuel_Type, Standard, Cycle, and Driving_Style. (Provide Age (Years) and Daily_Distance only if Odometer is missing).

Calculate Mileage: Use Odometer_Reading directly. If missing, fall back to Estimated_Mileage = Age * Daily_Distance * 365.

Lookup: Query the $EF_{DB}$ table for the base $g/km$ values.

Apply CF: * Calculate $f_{age}$ using the linear scaling formula with the precise odometer reading (capping at 2.2).

Fetch $CF_{style}$ multipliers based on whether driving was Smooth or Aggressive.

Multiply base values by the Cycle_Multiplier ($CF_{env}$), $CF_{style}$, and $f_{age}$.

Aggregate: Sum total grams for the trip.

Convert: Convert grams to kg for $CO_2$ reporting.