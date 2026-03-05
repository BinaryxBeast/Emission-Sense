Emission Sense: Cold Start Excess ($e_{cold}$)

A vehicle's emission profile is not uniform from the moment the key is turned. The highest concentration of toxic pollutants is emitted during the first few minutes of driving—a phenomenon known as the Cold Start Excess.

Standard base emission factors ($EF_{DB}$) assume the vehicle is fully warmed up ("hot running"). To accurately model real-world emissions, especially for urban commuting, the $e_{cold}$ multiplier must be applied to the initial phase of the trip.

1. The Physics and Chemistry of a "Cold Start"

When an engine has been parked for several hours, both the engine block and the exhaust after-treatment systems cool down to the ambient air temperature. This creates two major pollution events upon startup:

Catalyst "Light-Off" Delay: Modern Three-Way Catalytic (TWC) converters and Diesel Oxidation Catalysts (DOC) are practically inert at room temperature. They require a minimum operating temperature of $300^\circ\text{C}$ to $400^\circ\text{C}$ (the "light-off" temperature) to begin neutralizing $NO_x$, $CO$, and $HC$. Reaching this temperature takes time and exhaust flow.

Fuel Vaporization & Rich Mixture: In a cold engine cylinder, liquid fuel does not vaporize efficiently. To prevent the engine from misfiring or stalling, the Engine Control Unit (ECU) deliberately injects a "rich mixture" (excess fuel). This unburnt fuel is pushed directly into the cold, non-functioning catalytic converter.

The Result: For the first 1.0 to 1.5 kilometers, tailpipe emissions of $CO$ and $HC$ can be 5 to 10 times higher than during hot running conditions.

2. The $1.5\text{ km}$ Multiplier Model

Based on European COPERT methodology and EPA MOVES models, the cold start phase is generally defined as the first $1.5\text{ km}$ of a trip (or roughly the first 3 to 5 minutes of driving).

The $e_{cold}$ factor acts as a heavy multiplier specifically applied to the distance traveled within this warm-up window.

Base $e_{cold}$ Multipliers (Standard $20^\circ\text{C}$ Ambient)

$CO_2$ / Fuel Consumption: $1.20\times$ (Due to the rich fuel mixture).

$NO_x$: $1.50\times$ to $2.00\times$ (Delayed Selective Catalytic Reduction / EGR efficiency).

$PM_{2.5}$: $2.00\times$ to $3.00\times$ (Cold cylinder walls promote heavy soot formation).

$CO$ & $HC$: $5.00\times$ to $8.00\times$ (Raw, untreated exhaust bypasses the cold catalyst).

3. Climate Scaling: Cold vs. Hot

Ambient temperature drastically alters how long the cold start phase lasts and how severe the multipliers are.

Hot Climate ($> 30^\circ\text{C}$): The engine block is already warm. The rich-mixture phase is brief, and the catalytic converter reaches light-off in as little as $0.5\text{ km}$. The $e_{cold}$ penalty is significantly reduced.

Cold Climate ($< 5^\circ\text{C}$): The engine requires maximum fuel enrichment to start. The dense, freezing metal of the engine block and exhaust pipes absorbs the exhaust heat, delaying catalyst light-off to $2.0\text{ km}$ or more. The $e_{cold}$ penalty is maximized.

Pollutant

Hot Climate ($> 30^\circ\text{C}$)

Temperate ($20^\circ\text{C}$)

Cold Climate ($< 5^\circ\text{C}$)

$CO_2$

$1.05\times$

$1.20\times$

$1.40\times$

$NO_x$

$1.20\times$

$1.80\times$

$2.50\times$

$PM_{2.5}$

$1.50\times$

$2.50\times$

$4.00\times$

$CO$

$2.00\times$

$6.00\times$

$12.00\times$

4. The Short Trip Penalty ($< 5\text{ km}$)

The cold start excess has a profound effect on the average emissions per kilometer of a trip.

If a user drives $100\text{ km}$, the massive pollution generated in the first $1.5\text{ km}$ is diluted over the remaining $98.5\text{ km}$ of clean, hot-running driving. However, if a user drives only $3\text{ km}$ (e.g., to a local grocery store), the cold start phase makes up 50% of the total trip.

This means extreme short trips are disproportionately terrible for urban air quality, often averaging $300\%$ to $400\%$ more toxic emissions per kilometer than a highway commute.

5. Integrating the Mathematical Equation

To calculate a full trip accurately, the distance ($D$) must be split into two phases: the Cold Phase ($D_{cold} \le 1.5\text{ km}$) and the Hot Phase ($D_{hot} = D - D_{cold}$).

Phase 1: Cold Emissions

$$E_{cold\_phase(i)} = D_{cold} \times \left( EF_{db(i)} \times e_{cold(i, temp)} \times f_{age} \times f_{maint} \right)$$

Phase 2: Hot Emissions

$$E_{hot\_phase(i)} = D_{hot} \times \left( EF_{db(i)} \times f_{drive} \times f_{age} \times f_{maint} \right)$$


(Note: $f_{drive}$ traffic modifiers are usually applied to the hot phase, as the cold multiplier overrides standard traffic mechanics).

Total Moving Emissions

$$E_{Moving(i)} = E_{cold\_phase(i)} + E_{hot\_phase(i)}$$

6. Software Implementation Reference

Here is the algorithmic logic to calculate the cold start penalty for any given trip:

def calculate_trip_with_cold_start(pollutant, total_distance_km, climate="Temperate", base_ef=1.0, f_age=1.0):
    """
    Calculates total trip emissions by splitting the trip into a cold-start phase 
    (first 1.5km) and a hot-running phase.
    """
    
    # 1. Define Climate Multipliers for the Cold Phase
    climate_matrix = {
        "Hot":       {"CO2": 1.05, "NOx": 1.20, "PM2.5": 1.50, "CO": 2.00},
        "Temperate": {"CO2": 1.20, "NOx": 1.80, "PM2.5": 2.50, "CO": 6.00},
        "Cold":      {"CO2": 1.40, "NOx": 2.50, "PM2.5": 4.00, "CO": 12.00}
    }
    
    # Fetch the e_cold multiplier (default to 1.0 if pollutant not found)
    e_cold = climate_matrix.get(climate, climate_matrix["Temperate"]).get(pollutant, 1.0)
    
    # 2. Split the Distance
    max_cold_distance = 1.5 # The cold start window is exactly 1.5 km
    
    if total_distance_km <= max_cold_distance:
        d_cold = total_distance_km
        d_hot = 0.0
    else:
        d_cold = max_cold_distance
        d_hot = total_distance_km - max_cold_distance
        
    # 3. Calculate Phase Emissions
    # Cold phase: base EF * Age factor * Cold Multiplier
    emissions_cold = d_cold * (base_ef * f_age * e_cold)
    
    # Hot phase: base EF * Age factor (no cold multiplier)
    emissions_hot = d_hot * (base_ef * f_age)
    
    # 4. Total Trip Emissions
    total_emissions = emissions_cold + emissions_hot
    average_g_per_km = total_emissions / total_distance_km
    
    return {
        "total_grams": round(total_emissions, 3),
        "average_g_per_km": round(average_g_per_km, 3),
        "cold_phase_grams": round(emissions_cold, 3)
    }

# --- Example Executions (Demonstrating the Short Trip Penalty) ---
# Assuming a base NOx factor of 0.10 g/km in a Cold Climate:
#
# Short Trip (3 km):
# result = calculate_trip_with_cold_start("NOx", 3.0, "Cold", base_ef=0.10)
# Cold Phase (1.5km): 1.5 * (0.10 * 2.5) = 0.375g
# Hot Phase (1.5km):  1.5 * 0.10 = 0.150g
# Total = 0.525g  |  Average = 0.175 g/km (+75% above base rate)
#
# Long Trip (50 km):
# result = calculate_trip_with_cold_start("NOx", 50.0, "Cold", base_ef=0.10)
# Total = 5.225g  |  Average = 0.104 g/km (Nearly identical to base rate)
