Emission Sense: Evaporative Emissions ($e_{evap}$)

When calculating vehicular pollution, tailpipe exhaust is only part of the story for Hydrocarbons (HC) and Volatile Organic Compounds (VOCs). A significant portion of atmospheric hydrocarbons comes from Evaporative Emissions—the physical evaporation of liquid fuel into a gas before it ever reaches the combustion chamber.

In modern emission inventories (like the EPA's MOVES model and European COPERT), Evaporative Emissions must be calculated separately as an additive value.

1. The Physics of Fuel Evaporation

Evaporative emissions are heavily dependent on the Reid Vapor Pressure (RVP) of the fuel. High-volatility fuels turn into gas easily, expanding in the fuel tank and fuel lines. If the pressure exceeds the capacity of the vehicle's EVAP (Evaporative Emission Control) system—usually a charcoal canister—the raw hydrocarbon vapors vent directly into the atmosphere.

These emissions occur through four primary mechanisms:

Running Losses: Evaporation driven by engine and exhaust heat warming the fuel lines and fuel tank while the vehicle is being driven.

Hot Soak: The spike in evaporation that occurs immediately after the engine is turned off. The cooling engine block radiates intense heat into the stationary fuel lines.

Diurnal Emissions: Evaporation caused by the natural daily rise in ambient temperature, which heats the fuel tank and causes the vapors inside to expand and vent, even if the car has been parked for days.

Refueling Emissions: Liquid fuel entering the tank physically pushes the saturated hydrocarbon vapors out of the filler neck into the air.

2. Fuel Type Dependency

Because evaporation requires a volatile liquid, $e_{evap}$ is strictly tied to the fuel type:

Petrol (Gasoline): High. Petrol is highly volatile. It is the primary source of all vehicular evaporative HC emissions.

Diesel: Negligible (~0.0). Diesel has a very low vapor pressure and a high flash point. It does not evaporate into the atmosphere under normal ambient temperatures.

CNG / LPG: Low (~0.1). While highly pressurized, these are sealed, closed-loop systems. Evaporative emissions here strictly come from microscopic leaks in valves or during the refueling decoupling process, rather than temperature-driven evaporation.

Electric (EV): Zero (0.0). No liquid combustible fuel.

3. Climate and Temperature Scaling ($f_{temp}$)

Ambient heat is the catalyst for evaporative emissions. The hotter the climate, the faster the liquid fuel vaporizes.

Climate Condition

Ambient Temp

Evaporation Multiplier ($f_{temp}$)

Cold

$< 10^\circ\text{C}$

$0.20\times$ (Minimal vaporization)

Temperate

$15^\circ\text{C} - 25^\circ\text{C}$

$1.00\times$ (Baseline)

Hot

$25^\circ\text{C} - 35^\circ\text{C}$

$2.50\times$ (High vaporization rate)

Extreme Heat

$> 35^\circ\text{C}$

$4.00\times$ (Canister saturation; heavy venting)

(Note: Vehicles with poor maintenance ($f_{maint}$) often have cracked EVAP hoses or saturated charcoal canisters, which can cause these emissions to spike even further.)

4. The Mathematical Model

For a trip-based calculator, evaporative emissions are calculated by combining Running Losses (distance-based) and Hot Soak (trip-based/event-based).

The Formula

$$E_{evap(HC)} = \left[ (D \times ER_{run}) + E_{soak} \right] \times f_{fuel} \times f_{temp} \times f_{maint(HC)}$$

Where:

$E_{evap(HC)}$: Total evaporative Hydrocarbons for the trip (grams).

$D$: Distance traveled (km).

$ER_{run}$: Base Running Loss rate ($\approx 0.05 \text{ g/km}$ for standard Petrol vehicles).

$E_{soak}$: Base Hot Soak penalty ($\approx 1.5 \text{ g}$ per trip/engine shutoff).

$f_{fuel}$: Fuel multiplier (Petrol = 1.0, Diesel = 0.0, CNG = 0.1).

$f_{temp}$: Climate heat multiplier.

$f_{maint(HC)}$: Maintenance penalty (cracked EVAP systems leak massive amounts of HC).

5. Software Implementation Reference

Here is how you can implement the evaporative emissions logic into your codebase. Note that this strictly calculates the addition of Hydrocarbons (HC).

def get_evaporative_emissions(distance_km, fuel_type="Petrol", climate="Temperate", f_maint=1.0):
    """
    Calculates the evaporative Hydrocarbon (HC) emissions for a single trip.
    Returns the value in grams of HC.
    """
    
    # 1. Fuel Dependency Multiplier
    # If it's not a volatile fuel, evaporative emissions are effectively zero.
    fuel_multipliers = {
        "Petrol": 1.0,
        "Diesel": 0.0,
        "EV": 0.0,
        "CNG": 0.1
    }
    f_fuel = fuel_multipliers.get(fuel_type, 0.0)
    
    # Early exit for zero-evap fuels to save computation
    if f_fuel == 0.0:
        return 0.0
        
    # 2. Climate / Temperature Multiplier
    temp_multipliers = {
        "Cold": 0.20,
        "Temperate": 1.00,
        "Hot": 2.50,
        "Extreme Heat": 4.00
    }
    f_temp = temp_multipliers.get(climate, 1.00)
    
    # 3. Base Emission Rates (grams)
    # Average baseline for a standard passenger car
    er_run = 0.05   # grams per km driven (Running Losses)
    e_soak = 1.5    # flat grams emitted after parking (Hot Soak)
    
    # 4. Calculate Raw Evap
    raw_evap = (distance_km * er_run) + e_soak
    
    # 5. Apply Modifiers
    # Note: Maintenance is critical here. A 'Poor' maintenance level (e.g., f_maint = 5.0 for HC)
    # usually means the EVAP charcoal canister is dead or hoses are cracked.
    total_evap_hc = raw_evap * f_fuel * f_temp * f_maint
    
    return round(total_evap_hc, 3)

# --- Example Executions ---

# Standard Petrol car, 20km trip, Temperate weather, Good maintenance
# get_evaporative_emissions(20.0, "Petrol", "Temperate", 1.0)
# Running: 20 * 0.05 = 1.0g
# Soak: 1.5g
# Total = (1.0 + 1.5) * 1.0 * 1.0 * 1.0 = 2.50 grams of HC

# Same Petrol car, 20km trip, Extreme Heat, Poor Maintenance (EVAP leak, f_maint=5.0)
# get_evaporative_emissions(20.0, "Petrol", "Extreme Heat", 5.0)
# Total = (1.0 + 1.5) * 1.0 * 4.0 * 5.0 = 50.00 grams of HC (Massive VOC pollution event)

# Diesel vehicle (any weather)
# get_evaporative_emissions(20.0, "Diesel", "Extreme Heat", 1.0)
# Total = 0.0 grams
