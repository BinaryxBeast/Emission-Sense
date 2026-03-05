Emission Sense: Fuel Efficiency Override ($f_{eco}$)

In standard emission modeling, $CO_2$ emissions are often estimated using generic base factors (like ARIA or EPA database averages) based on vehicle class and emission standards. However, because $CO_2$ production is directly and strictly proportional to the amount of carbon-based fuel combusted, a generic database average can be highly inaccurate for a specific user's vehicle.

The Fuel Efficiency Override acts as a high-precision calculation path. If the Emission Sense system (via Gemini data extraction or direct user input) can determine the exact "Fuel Efficiency" (in km/l) of the specific vehicle, it bypasses the base database and calculates $CO_2$ using exact chemical stoichiometry.

1. The Stoichiometry of Combustion (Carbon Mass Balance)

When hydrocarbon fuels burn, the carbon atoms ($C$) bond with oxygen ($O_2$) from the air to form Carbon Dioxide ($CO_2$). Because oxygen is added from the atmosphere, the resulting $CO_2$ gas weighs significantly more than the liquid fuel itself.

To calculate exact emissions, we rely on Strict Chemical Stoichiometric Constants:

Petrol (Gasoline): $2.30 \text{ kg } CO_2$ per liter ($2300 \text{ g/L}$).

Diesel: $2.68 \text{ kg } CO_2$ per liter ($2680 \text{ g/L}$).

CNG (Compressed Natural Gas): $2.66 \text{ kg } CO_2$ per kg ($2660 \text{ g/kg}$).

2. The Override Formula

When the exact Fuel Efficiency ($E_{fuel}$ in km/l) is available, the base $CO_2$ emission rate ($EF_{CO2}$) is overridden with the following formula:

$$EF_{CO2\_override} = \frac{C_{stoich}}{E_{fuel}}$$

Where:

$EF_{CO2\_override}$: The exact base $CO_2$ emission factor ($g/km$).

$C_{stoich}$: The stoichiometric constant for the specific fuel (e.g., $2300 \text{ g/L}$ for Petrol).

$E_{fuel}$: The vehicle's specific fuel efficiency ($km/l$).

Example Comparison:

Standard ARIA Database: Might list a generic SUV at $180 \text{ g/km } CO_2$.

Override Path: If Gemini extracts that this specific SUV gets exactly $10 \text{ km/l}$ on petrol, the strict calculation is $2300 / 10 = 230 \text{ g/km } CO_2$. The override provides a much more accurate baseline for that individual driver.

3. Interaction with Other Modifiers

It is crucial to understand that this override replaces the base database value ($EF_{DB}$), but it does not replace the driving and condition modifiers.

If a vehicle's official extracted fuel efficiency is $15 \text{ km/l}$ (yielding an $EF_{CO2\_override}$ of $153.3 \text{ g/km}$), that value is still subject to real-time trip penalties:

Air Conditioning ($f_{ac}$): Decreases real-time fuel efficiency, so it multiplies the $CO_2$ penalty.

Traffic ($f_{traffic}$): Stop-and-go driving burns more fuel, applying the traffic multiplier.

Weight Penalty ($f_{weight}$): Increases baseline fuel consumption.

Updated $CO_2$ Master Equation:


$$E_{Total(CO2)} = D \times \left( \frac{C_{stoich}}{E_{fuel}} \right) \times f_{drive} \times f_{weight}$$

(Note: Age Deterioration ($f_{age}$) and Maintenance ($f_{maint}$) are generally not applied to $CO_2$, as those factors primarily affect the catalytic converter's ability to neutralize toxic gases, not the mass balance of carbon).

4. Software Implementation Reference

Here is the algorithmic logic to implement the Fuel Efficiency Override into your calculation engine:

def get_base_co2_factor(fuel_type="Petrol", fuel_efficiency_kml=None, database_co2_gkm=None):
    """
    Calculates the base CO2 emission factor (g/km).
    Overrides the generic database value if exact fuel efficiency is available.
    """
    
    # 1. Define Stoichiometric Constants (grams of CO2 per unit of fuel)
    stoichiometric_constants = {
        "Petrol": 2300.0, # 2.30 kg/L
        "Diesel": 2680.0, # 2.68 kg/L
        "CNG": 2660.0,    # 2.66 kg/kg
        "EV": 0.0         # 0 tailpipe CO2
    }
    
    # 2. Check for Override Condition
    if fuel_efficiency_kml is not None and fuel_efficiency_kml > 0:
        # Execute Fuel Efficiency Override calculation
        c_stoich = stoichiometric_constants.get(fuel_type, 0.0)
        override_co2_gkm = c_stoich / fuel_efficiency_kml
        return round(override_co2_gkm, 3)
        
    # 3. Fallback to Database Factor
    elif database_co2_gkm is not None:
        # Use generic ARIA / EPA database factor
        return round(database_co2_gkm, 3)
        
    # 4. Error state (no data)
    return 0.0

# --- Example Executions ---

# Case A: Generic Database Fallback (Efficiency unknown)
# get_base_co2_factor(fuel_type="Petrol", database_co2_gkm=165.0)
# Returns: 165.0 g/km

# Case B: Gemini Extracted Efficiency (Override triggers)
# Extracted 14.5 km/l for a Petrol vehicle
# get_base_co2_factor(fuel_type="Petrol", fuel_efficiency_kml=14.5, database_co2_gkm=165.0)
# Returns: 2300 / 14.5 = 158.621 g/km (Highly accurate)
