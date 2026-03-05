Emission Sense: Vehicle Weight Penalty ($f_{weight}$)

While the Load Factor ($f_{load}$) accounts for temporary cargo and passengers, the Vehicle Weight Penalty ($f_{weight}$) addresses the permanent, baseline mass of the vehicle itself—known as the Kerb Weight.

As automotive trends shift toward heavier SUVs and larger battery packs in EVs, baseline vehicle weight has become a critical variable in accurately calculating $CO_2$ emissions. This document defines the mathematical penalty for vehicles exceeding the standard 1500 kg threshold.

1. The Physics of Kerb Weight and Emissions

The relationship between vehicle mass and $CO_2$ emissions is governed by basic Newtonian physics and thermodynamics. Moving a vehicle requires the engine to overcome two primary mass-dependent forces:

Inertial Resistance ($F = ma$): To accelerate from a stop, the engine must apply force proportional to the vehicle's mass. A 2000 kg SUV requires significantly more kinetic energy to reach 50 km/h than a 1200 kg hatchback.

Rolling Resistance ($F_r = c_{rr} \times N$): The friction between the tires and the road surface is directly proportional to the normal force ($N$), which is determined by the vehicle's weight. Heavier vehicles cause more tire deformation, requiring more continuous engine power to maintain cruising speed.

Because $CO_2$ output is perfectly linear with fuel burned to generate this power, an increase in Kerb Weight results in an unavoidable, proportional increase in $CO_2$.

2. The 1500 kg Baseline Threshold

In modern emission modeling, 1500 kg represents the approximate average weight of a standard, efficient C-segment passenger car (e.g., a Honda Civic or Toyota Corolla).

Vehicles $\le 1500$ kg: Treated as the baseline ($f_{weight} = 1.0$). Their weight is already accounted for in standard Base Emission Factors ($EF_{DB}$).

Vehicles $> 1500$ kg: Trigger the proportional weight penalty. This commonly applies to mid-size/full-size SUVs, pickup trucks, and luxury sedans.

3. The Proportional Penalty Formula

Automotive engineering research indicates that for every 100 kg of additional weight added to a vehicle, fuel consumption and $CO_2$ emissions increase by approximately 3% to 5%.

To implement this proportionally for vehicles over 1500 kg, we use the following linear scaling formula:

$$f_{weight(CO_2)} = 1.0 + \max\left(0, \frac{W_{kerb} - 1500}{100} \times k_{weight}\right)$$

Where:

$W_{kerb}$: The unladen Kerb Weight of the vehicle in kilograms.

$1500$: The baseline threshold in kilograms.

$100$: The weight step size for the calculation.

$k_{weight}$: The proportional penalty constant. Industry standard is $\approx 0.04$ ($4\%$ increase per 100 kg over the limit).

Example Scenarios (using $k_{weight} = 0.04$):

1300 kg Hatchback: $f_{weight} = 1.0$ (No penalty, under threshold).

1500 kg Sedan: $f_{weight} = 1.0$ (Exactly at threshold).

1900 kg Crossover SUV: Exceeds by 400 kg. $(400 / 100) \times 0.04 = 0.16$.

$f_{weight} = 1.16$ (+16% $CO_2$ penalty).

2500 kg Large SUV: Exceeds by 1000 kg. $(1000 / 100) \times 0.04 = 0.40$.

$f_{weight} = 1.40$ (+40% $CO_2$ penalty).

4. Interaction with Other Pollutants

It is important to note that the Weight Penalty strictly targets $CO_2$ (and by extension, fuel economy).

Unlike Age Deterioration ($f_{age}$) or Maintenance ($f_{maint}$) which heavily impact toxic pollutants like $NO_x$ and $CO$, the catalytic converter size and exhaust tuning of a heavier vehicle are scaled up at the factory to meet legal $NO_x/CO$ limits for its weight class. Therefore:

$f_{weight(CO_2)} = \text{Calculated via formula above}$

$f_{weight(NO_x, PM, CO, HC)} = 1.0$ (No artificial penalty applied to base $EF_{DB}$).

5. Software Implementation Reference

Here is a Python function you can integrate into your Emission Sense calculator to dynamically apply the Kerb Weight penalty:

def get_weight_penalty(pollutant, kerb_weight_kg, threshold=1500, k_weight=0.04):
    """
    Calculates the proportional emission penalty for heavy vehicles.
    
    :param pollutant: The specific gas being calculated (e.g., "CO2", "NOx").
    :param kerb_weight_kg: The empty weight of the vehicle in kilograms.
    :param threshold: The weight limit before penalties apply (default 1500kg).
    :param k_weight: The penalty multiplier per 100kg over the threshold (default 4%).
    :return: The weight penalty multiplier (float).
    """
    
    # Weight penalty only applies to CO2
    if pollutant != "CO2":
        return 1.0
        
    # No penalty for vehicles under or exactly at the threshold
    if kerb_weight_kg <= threshold:
        return 1.0
        
    # Calculate the penalty for excess weight
    excess_weight = kerb_weight_kg - threshold
    penalty_steps = excess_weight / 100.0
    
    f_weight = 1.0 + (penalty_steps * k_weight)
    
    return round(f_weight, 3)

# --- Example Executions ---
# sedan_penalty = get_weight_penalty("CO2", 1450)     # Returns 1.0
# suv_penalty   = get_weight_penalty("CO2", 2100)     # Returns 1.24 (+24% CO2)
# suv_nox       = get_weight_penalty("NOx", 2100)     # Returns 1.0 (Doesn't affect NOx)
