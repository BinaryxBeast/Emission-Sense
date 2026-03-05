4. Exact Engine & Tech Penalties ($f_{tech}$)

Beyond fuel type and general vehicle class, specific engine architectures and transmission types permanently alter the emission profile. These are static hardware multipliers applied to the base rate.

A. Turbocharged Engines

Turbochargers force compressed air into the engine, allowing a smaller engine to produce the power of a larger one. While this improves overall thermal efficiency, it alters combustion dynamics:

$CO_2$ (Fuel Economy): -5% ($0.95$ multiplier). Downsized turbo engines generally burn less fuel than naturally aspirated equivalents.

$PM_{2.5}$: +15% ($1.15$ multiplier). Forced induction can create localized rich fuel pockets in the cylinder before the flame front propagates, leading to more soot.

$NO_x$: +10% ($1.10$ multiplier). The higher pressure translates to higher peak cylinder temperatures, which accelerates the formation of nitrogen oxides.

B. Gasoline Direct Injection (GDI)

Unlike older Port Fuel Injection (PFI) engines that mix fuel and air outside the cylinder, GDI injects fuel directly into the combustion chamber at extreme pressures.

$PM_{2.5}$: +50% ($1.50$ multiplier). The extremely short mixing time prevents the fuel from fully vaporizing before spark ignition. This results in microscopic liquid fuel droplets burning unevenly, creating vastly more particulate matter (soot) than a traditional petrol engine.

C. Transmission Types

The transmission dictates how effectively engine RPM is converted to wheel speed, primarily impacting fuel consumption and therefore $CO_2$.

Automatic (Torque Converter) / AMT: +5% $CO_2$ ($1.05$ multiplier). Hydraulic losses in traditional automatics and shift-lags in Automated Manual Transmissions cause slight drops in efficiency compared to a perfect manual driver.

CVT (Continuously Variable Transmission): -5% $CO_2$ ($0.95$ multiplier). CVTs have infinite gear ratios, keeping the engine at its absolute most efficient RPM at almost all times, mathematically reducing fuel burn.

5. The Combined Modifiers

When calculating real-time emissions, the operational variables ($f_{drive}$) and hardware variables ($f_{tech}$) combine:

$$f_{drive(i)} = f_{ac(i)} \times f_{traffic(i)} \times f_{load(i)}$$

Updating the Master Emission Equation

Integrating these new variables into your Emission Sense master formula gives you a highly accurate, research-grade atmospheric model that accounts for base standards, age, mechanical health, hardware tech, and real-time driving conditions:

$$E_{i} = D \times EF_{db(i)} \times f_{age} \times f_{maint(i)} \times f_{tech(i)} \times f_{drive(i)}$$

6. Software Implementation Reference

Here is how you can model this complete logic dynamically in your project:

def get_tech_modifier(pollutant, engine_tech="NA", injection="PFI", transmission="Manual"):
    f_tech = 1.0
    
    # 1. Turbocharger impacts
    if engine_tech == "Turbo":
        if pollutant == "CO2": f_tech *= 0.95
        elif pollutant == "PM2.5": f_tech *= 1.15
        elif pollutant == "NOx": f_tech *= 1.10
            
    # 2. GDI impacts
    if injection == "GDI" and pollutant == "PM2.5":
        f_tech *= 1.50
        
    # 3. Transmission impacts (Primarily affects CO2)
    if pollutant == "CO2":
        if transmission in ["Auto", "AMT"]: 
            f_tech *= 1.05
        elif transmission == "CVT": 
            f_tech *= 0.95
            
    return round(f_tech, 3)

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

# Example Usage:
# base_pm25 = 0.025 # g/km
# f_tech_pm25 = get_tech_modifier("PM2.5", engine_tech="Turbo", injection="GDI", transmission="Auto")
# f_drive_pm25 = get_driving_modifier("PM2.5", ac_level="Heavy", traffic="Stop-and-Go")
# 
# final_pm25 = base_pm25 * f_tech_pm25 * f_drive_pm25
