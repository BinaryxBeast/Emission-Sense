Emission Sense: Driving Condition Modifiers ($f_{drive}$)

Standard emission databases (like $EF_{DB}$) are generated using vehicles driven on flat dynamometers under strictly controlled laboratory temperatures, without air conditioning or passenger payloads.

To bridge the gap between laboratory perfection and real-world reality, emission modeling systems use Driving Condition Modifiers ($f_{drive}$). This factor dynamically adjusts the baseline emissions by accounting for three major operational loads: Air Conditioning ($f_{ac}$), Traffic Intensity ($f_{traffic}$), and Vehicle Load Factor ($f_{load}$).

1. Air Conditioning Penalty ($f_{ac}$)

Air Conditioning (AC) compressors place a massive mechanical load on the engine. According to studies by the Lawrence Berkeley National Laboratory and the National Renewable Energy Laboratory (NREL), running an AC system can increase a vehicle's energy consumption by up to 22% on hot days.

Because $CO_2$ is directly proportional to fuel burned, the extra fuel required to turn the AC compressor creates an immediate spike in $CO_2$ and associated combustion byproducts.

The Multiplier Matrix

Off: $1.00$

Moderate AC (Maintains Temp): ~ $1.05$ to $1.10$

Heavy AC (Cooling a hot car/Max Blast): ~ $1.15$ to $1.20$

Implementation Values:

$CO_2$ & Fuel: $+15\%$ multiplier ($1.15$) under heavy use.

$NO_x$ & $CO$: The added engine load increases combustion temperatures and fuel flow, typically resulting in a $+10\%$ to $+15\%$ increase in toxic pollutants as well.

2. Traffic Intensity & Stop-and-Go ($f_{traffic}$)

Standard urban emission factors assume a relatively smooth "city cycle." However, heavy congestion introduces "Stop-and-Go" traffic.

Scientifically, an engine operates most efficiently at a steady cruising speed (steady-state). Accelerating the heavy mass of a vehicle from a dead stop requires high "Specific Tractive Power." During harsh accelerations, the engine control unit (ECU) runs a "rich air-fuel mixture" (more fuel than oxygen) to prevent stalling and maximize torque.

This transient operation completely disrupts the efficiency of the Catalytic Converter and causes massive spikes in incomplete combustion products:

$CO$ (Carbon Monoxide): Spikes by +50% ($1.5$ multiplier) because of the rich fuel mixture and lack of oxygen to form $CO_2$.

$NO_x$ (Nitrogen Oxides): Spikes by +40% ($1.4$ multiplier) due to extreme, sudden heat spikes in the combustion chamber during acceleration.

$PM_{2.5}$ (Particulates): Spikes by +30% ($1.3$ multiplier), particularly in diesel engines, as unburnt fuel exits the exhaust before it can fully combust.

The Traffic Formula

$$f_{traffic(i)} = 1.0 + (\text{Intensity\_Level} \times P_{traffic(i)})$$


(Where Intensity_Level scales from 0.0 for free-flowing to 1.0 for gridlock).

3. Load Factor / Tractive Payload ($f_{load}$)

Payload alters the fundamental physics of moving the vehicle. Every additional kilogram increases rolling resistance and inertial mass. According to Heavy-Duty emission studies, a fully loaded commercial truck emits up to 40% more $CO_2$ and $NO_x$ than an empty one. For passenger cars, every extra $100 \text{ kg}$ (e.g., an extra passenger) increases $CO_2$ by roughly $2\% - 5\%$.

The Load Factor represents the percentage of the vehicle's maximum carrying capacity currently being utilized, acting as a linear scalar.

The Load Formula

$$f_{load} = 1.0 + \left( \frac{\text{Current Payload}}{\text{Max Payload Capacity}} \times \beta_i \right)$$

Where $\beta_i$ (Max Penalty Constant) is:

Light Duty (Cars): $\beta \approx 0.15$ (A fully packed car emits $15\%$ more $CO_2$/$NO_x$).

Heavy Duty (Trucks): $\beta \approx 0.40$ (A fully loaded truck emits $40\%$ more $CO_2$/$NO_x$).

4. The Combined Driving Modifier

When calculating real-time emissions for a trip, these three sub-factors multiply together to form the master $f_{drive}$ variable for a specific pollutant ($i$):

$$f_{drive(i)} = f_{ac(i)} \times f_{traffic(i)} \times f_{load(i)}$$

Updating the Master Emission Equation

Integrating this into your Emission Sense master formula gives you a highly accurate, research-grade atmospheric model:

$$E_{i} = D \times EF_{db(i)} \times f_{age} \times f_{maint(i)} \times f_{drive(i)}$$

5. Software Implementation Reference

Here is how you can model this logic dynamically in your project:

def get_driving_modifier(pollutant, ac_level="Off", traffic="Normal", payload_pct=0.0, vehicle_type="PV"):
    
    # 1. AC Penalty (fac)
    ac_penalties = {
        "Off": 1.0,
        "Moderate": 1.05,
        "Heavy": 1.15  # 15% penalty
    }
    f_ac = ac_penalties.get(ac_level, 1.0)
    # AC affects CO2, NOx, and CO similarly due to direct engine load. PM is less affected.
    if pollutant == "PM2.5":
        f_ac = 1.0 + ((f_ac - 1.0) / 2) # Halve the AC penalty for PM
        
    # 2. Traffic Intensity Penalty (ftraffic)
    # Stop-and-go spikes: PM2.5 (+30%), NOx (+40%), CO (+50%), CO2 (+20%)
    traffic_matrix = {
        "Normal": {"CO2": 1.0, "NOx": 1.0, "CO": 1.0, "PM2.5": 1.0},
        "Stop-and-Go": {"CO2": 1.20, "NOx": 1.40, "CO": 1.50, "PM2.5": 1.30}
    }
    f_traffic = traffic_matrix.get(traffic, traffic_matrix["Normal"]).get(pollutant, 1.0)
    
    # 3. Load Factor Penalty (fload)
    # payload_pct is between 0.0 (empty) and 1.0 (fully loaded)
    beta = 0.40 if vehicle_type in ["HCV", "LCV"] else 0.15
    f_load = 1.0 + (payload_pct * beta)
    
    # The load factor primarily impacts CO2 and NOx (direct power correlation)
    if pollutant not in ["CO2", "NOx"]:
        f_load = 1.0 + ((f_load - 1.0) * 0.5) # Reduced load impact on CO/PM
        
    # Combine and return
    f_drive = f_ac * f_traffic * f_load
    return round(f_drive, 3)

# Example: Passenger car with Heavy AC, Stop-and-Go traffic, and 50% payload
# f_drive_NOx = 1.15 (AC) * 1.40 (Traffic) * 1.075 (Load) = 1.731
# This means NOx emissions are 73.1% higher than the baseline laboratory test!
