# Master Emission Factors Model and Attributes\n\nThis document contains data parameters and properties for related modeling logic.\n\n## Source Data\n```json\nHere is a structured JSON schema for the main factors, formulas, typical values, adjustments, and reference models you can use to estimate vehicle tailpipe and evaporative emissions in a web tool.

{
  "factors": [
    {
      "id": "fuel_type",
      "name": "Fuel type",
      "description": "Fuel carbon content, hydrogen-to-carbon ratio, volatility and sulfur content determine CO2 per unit fuel, pollutant emission factors, and evaporative VOC potential (e.g., petrol vs diesel vs CNG vs LPG vs electricity). [web:4][web:13]",
      "emission_processes": ["tailpipe_hot", "tailpipe_cold", "evaporative", "upstream_fuel_cycle"],
      "core_equation": "E_p = EF_p,dist(fuel, vehicle_class, standard, speed) * VKT * F_age * F_maint * F_cold * F_temp * F_load",
      "units": {
        "E_p": "g pollutant p",
        "EF_p,dist": "g/km",
        "VKT": "km"
      },
      "notes": "Use fuel-specific emission factors from EMEP/EEA (COPERT), MOVES, or GREET for CO2, CH4, N2O and pollutants. [web:13][web:14][web:19]"
    },
    {
      "id": "vehicle_class_mass",
      "name": "Vehicle class and mass",
      "description": "Vehicle category (passenger car, light commercial vehicle, heavy-duty truck, bus, motorcycle) and reference mass strongly influence base emission factors and speed-dependence functions. [web:4][web:13]",
      "emission_processes": ["tailpipe_hot", "tailpipe_cold"],
      "core_equation": "EF_p,dist = f_p,dist(vehicle_class, mass, fuel, emission_standard, speed)",
      "units": {
        "EF_p,dist": "g/km"
      },
      "notes": "Use model-specific classes (e.g., COPERT vehicle categories, MOVES source type IDs) and map user inputs to these classes. [web:13][web:14]"
    },
    {
      "id": "engine_size_power",
      "name": "Engine size and rated power",
      "description": "Engine displacement and power correlate with fuel consumption and hence CO2 and some pollutant emission factors, especially under high load. [web:13][web:14]",
      "emission_processes": ["tailpipe_hot"],
      "core_equation": "Fuel_rate = P_engine * SFC(P_engine, speed); E_CO2 = Fuel_rate * CI_fuel * t",
      "units": {
        "Fuel_rate": "L/h or kg/h",
        "P_engine": "kW",
        "SFC": "L/kWh or kg/kWh",
        "CI_fuel": "g CO2/L or g CO2/kg",
        "t": "h"
      },
      "notes": "In high-level web tools, engine size can be proxied via vehicle class plus user-supplied fuel economy; detailed engine maps are usually not required. [web:13]"
    },
    {
      "id": "emission_standard_technology",
      "name": "Emission standard and aftertreatment technology",
      "description": "Euro / Bharat / Tier standard and presence of three-way catalysts, DPF, SCR, GDI vs PFI injection, etc., are primary determinants of baseline pollutant emission factors. [web:4][web:10][web:13]",
      "emission_processes": ["tailpipe_hot", "tailpipe_cold"],
      "core_equation": "EF_p,base = EF_p,dist(standard, fuel, class, speed) from inventory model tables",
      "units": {
        "EF_p,base": "g/km"
      },
      "notes": "Map user vehicle age/model-year to regulatory standard, then pull EF from COPERT/EMEP/EEA or MOVES. [web:13][web:14]"
    },
    {
      "id": "vehicle_age_mileage",
      "name": "Vehicle age and cumulative mileage",
      "description": "As vehicles age and accumulate mileage, emission controls deteriorate and malfunction probability rises, increasing real-world emission factors, especially for NOx, CO, VOC and PM. [web:6][web:20][web:23]",
      "emission_processes": ["tailpipe_hot", "tailpipe_cold", "evaporative"],
      "core_equation": "EF_p,age = EF_p,base * F_age_p(age_years, mileage_km)",
      "units": {
        "EF_p,age": "g/km"
      },
      "notes": "Use deterioration factors by mileage/age for each pollutant and fuel from EMEP/EEA, HBEFA, or published deterioration studies. [web:6][web:20][web:23]"
    },
    {
      "id": "maintenance_state",
      "name": "Maintenance state and malfunction",
      "description": "Poor maintenance and failed emission controls create high-emitting vehicles that can dominate fleet emissions; repairs can reduce NOx and CO by tens of percent. [web:6][web:21][web:24][web:26]",
      "emission_processes": ["tailpipe_hot", "tailpipe_cold", "evaporative"],
      "core_equation": "EF_p,maint = EF_p,age * F_maint_p(maintenance_class)",
      "units": {
        "EF_p,maint": "g/km"
      },
      "notes": "Represent maintenance as discrete states (e.g., normal, moderately poorly maintained, gross emitter) with multiplicative factors backed by I/M and repair studies. [web:21][web:24][web:26]"
    },
    {
      "id": "ambient_temperature",
      "name": "Ambient temperature",
      "description": "Low temperatures increase cold-start excess emissions and may increase fuel consumption; high temperatures increase evaporative VOC losses and A/C use. [web:4][web:10][web:13]",
      "emission_processes": ["tailpipe_cold", "evaporative", "tailpipe_hot"],
      "core_equation": "F_temp_p = 1 + k_p * (T_ref - T_amb)",
      "units": {
        "T_ref": "°C",
        "T_amb": "°C"
      },
      "notes": "Use temperature-dependent cold excess emission ratios and evaporative emission functions from COPERT/EMEP/EEA. [web:13]"
    },
    {
      "id": "cold_start_and_trip_length",
      "name": "Cold starts and average trip length",
      "description": "Short trips and more cold starts increase per-km emissions due to catalyst light-off delay and rich mixtures during warm-up. [web:13][web:14]",
      "emission_processes": ["tailpipe_cold"],
      "core_equation": "E_p,total = E_p,hot + N_start * (E_p,cold_per_start - E_p,hot_per_start)",
      "units": {
        "E_p,total": "g",
        "E_p,hot": "g",
        "N_start": "starts",
        "E_p,cold_per_start": "g/start",
        "E_p,hot_per_start": "g/start"
      },
      "notes": "EMEP/EEA and COPERT parameterize cold-excess factors as a function of ambient temperature and driven distance after start. [web:13]"
    },
    {
      "id": "speed_and_drive_cycle",
      "name": "Average speed and drive cycle",
      "description": "Emission factors vary non-linearly with speed and transient dynamics (idling, acceleration, deceleration); urban stop-and-go usually has higher per-km emissions than steady highway. [web:4][web:10][web:13][web:14]",
      "emission_processes": ["tailpipe_hot", "tailpipe_cold"],
      "core_equation": "EF_p,dist(v) = a_p + b_p * v + c_p * v^2 (piecewise by speed range)",
      "units": {
        "v": "km/h",
        "EF_p,dist": "g/km"
      },
      "notes": "Use average-speed or operating-mode based EF functions from COPERT (speed curves) or MOVES (operating mode distributions). [web:13][web:14]"
    },
    {
      "id": "road_type_gradient_congestion",
      "name": "Road type, gradient, congestion",
      "description": "Urban, rural, and motorway segments and road gradient affect typical speeds, accelerations, and engine loads, altering emission factors per km. [web:4][web:10][web:13]",
      "emission_processes": ["tailpipe_hot"],
      "core_equation": "E_p = Σ_r (EF_p,dist,r * VKT_r), where r ∈ {urban,rural,highway}",
      "units": {
        "E_p": "g",
        "VKT_r": "km"
      },
      "notes": "Use separate speed-EMEP/EEA or COPERT factors for each road type and grade band. [web:10][web:13]"
    },
    {
      "id": "payload_and_load",
      "name": "Payload and vehicle loading",
      "description": "Higher payload increases required tractive energy, leading to higher fuel use and emissions per km for trucks and buses. [web:4][web:13]",
      "emission_processes": ["tailpipe_hot"],
      "core_equation": "F_load = 1 + k_load * (payload / payload_ref)",
      "units": {
        "payload": "kg"
      },
      "notes": "Where detailed load-specific curves are unavailable, apply a simple proportional factor to fuel-based emissions for heavy-duty vehicles. [web:13]"
    },
    {
      "id": "driving_behavior",
      "name": "Driving behavior (eco vs aggressive)",
      "description": "Aggressive driving with frequent hard accelerations can substantially increase NOx, CO, VOC and fuel consumption relative to eco-driving. [web:4][web:10][web:13]",
      "emission_processes": ["tailpipe_hot"],
      "core_equation": "F_style = {eco: 0.9, normal: 1.0, aggressive: 1.2–1.4}",
      "units": {
        "F_style": "dimensionless multiplicative factor"
      },
      "notes": "You can calibrate F_style using comparisons between different drive cycles (e.g., WLTP vs real-world) from inventory models. [web:4][web:13]"
    },
    {
      "id": "fuel_quality",
      "name": "Fuel quality and volatility",
      "description": "Sulfur content, aromatics, and Reid vapor pressure (RVP) of fuels affect catalyst performance and evaporative VOC emissions. [web:4][web:10][web:13]",
      "emission_processes": ["tailpipe_hot", "tailpipe_cold", "evaporative"],
      "core_equation": "E_VOC,evap ∝ RVP * (1 + k_T * (T_amb - T_ref)); F_SO2 ∝ sulfur_content",
      "units": {
        "RVP": "kPa",
        "sulfur_content": "ppm"
      },
      "notes": "EMEP/EEA evaporative models explicitly use fuel RVP and temperature for diurnal and hot-soak emissions. [web:13]"
    },
    {
      "id": "idling_and_engine_hours",
      "name": "Idling time and engine-hours",
      "description": "Extended idling for trucks and buses produces emissions without distance traveled and should be calculated per engine-hour. [web:4][web:10][web:14]",
      "emission_processes": ["tailpipe_hot"],
      "core_equation": "E_p,idle = EF_p,idle * H_engine",
      "units": {
        "EF_p,idle": "g/h",
        "H_engine": "h"
      },
      "notes": "MOVES and EMEP/EEA provide idle emission factors or operating-mode specific factors that can be applied per hour. [web:10][web:14]"
    },
    {
      "id": "evaporative_processes",
      "name": "Evaporative processes (parked and running)",
      "description": "Diurnal breathing losses, hot-soak after engine-off, running losses and refueling vapors emit VOCs from petrol vehicles and infrastructure. [web:4][web:10][web:13]",
      "emission_processes": ["evaporative"],
      "core_equation": "E_VOC,evap = E_diurnal + E_hotsoak + E_running + E_refuel",
      "units": {
        "E_*": "g VOC"
      },
      "notes": "COPERT and EMEP/EEA split evaporative VOC into these components with temperature-, fuel- and technology-specific factors. [web:13]"
    },
    {
      "id": "parking_conditions",
      "name": "Parking conditions and soak duration",
      "description": "Soak time and ambient temperature profile over the day affect both hot-soak and diurnal evaporative emissions. [web:10][web:13]",
      "emission_processes": ["evaporative"],
      "core_equation": "E_diurnal ∝ ΔT_day * RVP * parking_time; E_hotsoak ∝ fuel_temp_at_shutdown",
      "units": {},
      "notes": "Inventory models parameterize these via daily minimum/maximum temperatures, soak times and parking location (garage vs outdoor). [web:13]"
    },
    {
      "id": "air_conditioning_and_accessories",
      "name": "A/C and accessory use",
      "description": "Use of air conditioning and electrical accessories increases engine load for ICEVs and electricity demand for BEVs, raising energy use and emissions. [web:13][web:19][web:25]",
      "emission_processes": ["tailpipe_hot", "upstream_fuel_cycle"],
      "core_equation": "F_AC = 1 + k_AC(T_amb, humidity, road_type)",
      "units": {},
      "notes": "COPERT and GREET capture A/C impacts via increased energy consumption under hot conditions. [web:13][web:19][web:25]"
    },
    {
      "id": "electricity_mix_for_bev",
      "name": "Electric grid mix for BEV/PHEV",
      "description": "For BEVs and electric driving of PHEVs, upstream emissions depend on grid carbon intensity and transmission losses, not tailpipe exhaust. [web:16][web:19][web:25]",
      "emission_processes": ["upstream_fuel_cycle"],
      "core_equation": "E_CO2,BEV = E_use * CI_grid,well_to_wheel",
      "units": {
        "E_use": "kWh/vehicle-km",
        "CI_grid,well_to_wheel": "g CO2-eq/kWh"
      },
      "notes": "Use GREET or national grid factors to compute well-to-wheel gCO2/km for BEVs and electric-mode PHEVs. [web:16][web:19][web:25]"
    }
  ],
  "formulas": {
    "distance_based_tailpipe": {
      "description": "Generic multiplicative model for distance-based tailpipe emissions per pollutant p using emission factors in g/km. [web:4][web:10][web:13][web:14]",
      "equation": "E_p = EF_p,dist(vehicle_class, fuel, standard, speed, road_type) * VKT * F_age_p * F_maint_p * F_speed_p * F_cold_p * F_temp_p * F_style * F_load",
      "variables_units": {
        "E_p": "g or kg of pollutant p over the trip or period",
        "EF_p,dist": "g/km",
        "VKT": "vehicle-km",
        "F_*": "dimensionless correction factors"
      },
      "use_when": "User provides distance traveled (trip length or annual VKT) and vehicle type; EF_p,dist are taken from COPERT/EMEP/EEA or MOVES. [web:13][web:14]"
    },
    "fuel_based_tailpipe": {
      "description": "Fuel-based model where emissions scale with fuel consumed and an emission factor in g/L or g/kg. [web:4][web:10][web:13][web:19]",
      "equation": "E_p = EF_p,fuel(fuel, standard, technology) * Fuel_cons",
      "variables_units": {
        "E_p": "g pollutant p",
        "EF_p,fuel": "g/L (liquid fuels) or g/kg (gaseous fuels)",
        "Fuel_cons": "L or kg of fuel"
      },
      "use_when": "User provides fuel consumption directly, or it can be computed from VKT and fuel economy; especially natural for CO2 using stoichiometric carbon content. [web:4][web:19]"
    },
    "energy_based_tailpipe": {
      "description": "Power- or energy-based model where emissions scale with useful engine or motor energy output and EF in g/kWh. [web:13][web:14][web:19]",
      "equation": "E_p = EF_p,energy(engine_tech) * E_out",
      "variables_units": {
        "E_p": "g pollutant p",
        "EF_p,energy": "g/kWh",
        "E_out": "kWh useful mechanical or electrical energy"
      },
      "use_when": "Used in detailed simulations (e.g., microsimulation or drive-cycle models) where engine power or battery power time series are known. [web:14][web:19]"
    },
    "distance_to_fuel_conversion": {
      "description": "Relates vehicle-km to fuel consumed via fuel economy. [web:4][web:10]",
      "equation": "Fuel_cons = VKT / FE or Fuel_cons = VKT * FC",
      "variables_units": {
        "Fuel_cons": "L or kg of fuel",
        "VKT": "km",
        "FE": "km/L or km/kg",
        "FC": "L/km or kg/km"
      },
      "use_when": "User inputs distance and fuel economy (or L/100 km), enabling conversion to fuel for fuel-based calculations."
    },
    "distance_to_hours_conversion": {
      "description": "Relates distance to engine-hours using average speed; for idling, hours are direct input. [web:4][web:10][web:14]",
      "equation": "H_engine = VKT / v_avg + H_idle",
      "variables_units": {
        "H_engine": "h",
        "VKT": "km",
        "v_avg": "km/h",
        "H_idle": "h"
      },
      "use_when": "User provides distance and time or average speed; apply when idle emission factors (g/h) or operating-mode models are used. [web:14]"
    },
    "cold_start_correction": {
      "description": "Cold-start excess emissions modeled as a multiplicative factor on hot emissions, depending on ambient temperature and distance after start. [web:13][web:14]",
      "equation": "E_p = E_p,hot * [1 + R_cold_p(T_amb, d_trip)], with R_cold_p = (E_p,total - E_p,hot)/E_p,hot",
      "variables_units": {
        "E_p": "g pollutant p per trip",
        "E_p,hot": "g pollutant p assuming fully warm engine",
        "R_cold_p": "dimensionless cold-excess ratio"
      },
      "use_when": "Estimate per-trip or per-day emissions where number of starts, trip lengths and ambient temperature are known; use R_cold_p from COPERT/EMEP/EEA tables. [web:13]"
    },
    "temperature_correction": {
      "description": "Linearized temperature factor applied to warm and cold emissions for pollutants sensitive to ambient temperature. [web:10][web:13]",
      "equation": "F_temp_p = 1 + k1_p * (T_ref - T_amb) for cold-start; similar but smaller magnitude for hot emissions",
      "variables_units": {
        "T_ref": "reference temperature, e.g. 20 °C",
        "T_amb": "ambient temperature, °C",
        "k1_p": "per-degree sensitivity (1/°C)"
      },
      "use_when": "Apply when the tool knows ambient temperature; calibrate k1_p from COPERT or EMEP/EEA guidebook temperature sensitivity factors. [web:13]"
    },
    "speed_curve": {
      "description": "Average-speed based emission factor function, typically quadratic or piecewise polynomial in speed. [web:4][web:10][web:13]",
      "equation": "EF_p,dist(v) = a_p + b_p * v + c_p * v^2 for given vehicle_class, fuel, standard; coefficients from models",
      "variables_units": {
        "EF_p,dist": "g/km",
        "v": "km/h"
      },
      "use_when": "User provides average speed by road type; plug into coefficients from COPERT or national emission factor sets (e.g., NAEI). [web:4][web:10][web:13]"
    },
    "evaporative_emissions_model": {
      "description": "Aggregate model for petrol evaporative VOC emissions with components for diurnal, hot-soak, running and refueling losses. [web:4][web:10][web:13]",
      "equation": "E_VOC,evap = EF_diurnal * N_days + EF_hotsoak * N_hotsoak + EF_running * VKT_urban + EF_refuel * Fuel_cons",
      "variables_units": {
        "E_VOC,evap": "g VOC",
        "EF_diurnal": "g/day",
        "EF_hotsoak": "g/event",
        "EF_running": "g/km",
        "EF_refuel": "g/L",
        "N_days": "parking days",
        "N_hotsoak": "hot soak events"
      },
      "use_when": "Use when modeling VOC; parameters come from COPERT/EMEP/EEA and depend on fuel RVP, temperature and control technology. [web:13]"
    },
    "upstream_bev_emissions": {
      "description": "Upstream well-to-wheel emissions for BEVs based on electricity use per km and grid carbon intensity. [web:16][web:19][web:25]",
      "equation": "E_CO2e,BEV = VKT * E_use * CI_grid,WTW",
      "variables_units": {
        "E_CO2e,BEV": "g CO2-eq",
        "VKT": "km",
        "E_use": "kWh/km",
        "CI_grid,WTW": "g CO2-eq/kWh"
      },
      "use_when": "Used for BEVs and PHEVs in electric mode; grid intensity and upstream losses from GREET or national conversion factors. [web:16][web:19][web:25]"
    }
  },
  "emission_factors_table": {
    "description": "Illustrative typical real-world emission factor ranges for modern vehicles; actual web tool should pull official values from EMEP/EEA (COPERT), MOVES or national inventories. [web:4][web:10][web:13][web:14][web:19]",
    "columns": [
      "vehicle_class",
      "fuel",
      "metric",
      "CO2_ef",
      "NOx_ef",
      "PM_ef",
      "VOC_ef",
      "source_hint"
    ],
    "units": {
      "CO2_ef": "g/km (tailpipe, or WTW note for BEV)",
      "NOx_ef": "g/km",
      "PM_ef": "g/km",
      "VOC_ef": "g/km"
    },
    "rows": [
      {
        "vehicle_class": "Small passenger car (Euro 6/VI)",
        "fuel": "Petrol/gasoline",
        "metric": "Urban mixed driving",
        "CO2_ef": "120-180",
        "NOx_ef": "0.02-0.08",
        "PM_ef": "0.0005-0.004",
        "VOC_ef": "0.02-0.08",
        "source_hint": "Use COPERT/EMEP/EEA PC petrol Euro 6 EF(v) curves. [web:4][web:10][web:13]"
      },
      {
        "vehicle_class": "Small passenger car (Euro 6/VI)",
        "fuel": "Diesel",
        "metric": "Urban mixed driving",
        "CO2_ef": "110-160",
        "NOx_ef": "0.04-0.25",
        "PM_ef": "0.0005-0.004",
        "VOC_ef": "0.005-0.03",
        "source_hint": "Real-world NOx often higher than certification limits; use MOVES or EMEP/EEA real-world adjustments. [web:4][web:10][web:13][web:14]"
      },
      {
        "vehicle_class": "Medium car / SUV",
        "fuel": "Petrol/gasoline",
        "metric": "Combined driving",
        "CO2_ef": "150-220",
        "NOx_ef": "0.03-0.1",
        "PM_ef": "0.001-0.005",
        "VOC_ef": "0.03-0.1",
        "source_hint": "Scale COPERT/MOVES factors for higher vehicle mass and fuel consumption. [web:4][web:10][web:13][web:14]"
      },
      {
        "vehicle_class": "Light commercial vehicle (LCV)",
        "fuel": "Diesel",
        "metric": "Urban delivery",
        "CO2_ef": "180-260",
        "NOx_ef": "0.15-0.6",
        "PM_ef": "0.003-0.02",
        "VOC_ef": "0.01-0.05",
        "source_hint": "Use COPERT LCV classes and speed-specific EF; similar in MOVES source types 31/32. [web:4][web:10][web:13][web:14]"
      },
      {
        "vehicle_class": "Heavy-duty truck (HGV)",
        "fuel": "Diesel",
        "metric": "Highway freight (gross weight 26-40 t)",
        "CO2_ef": "600-900",
        "NOx_ef": "1.0-4.0",
        "PM_ef": "0.03-0.15",
        "VOC_ef": "0.05-0.2",
        "source_hint": "Use COPERT heavy-duty EF by weight class and speed; MOVES heavy-duty source types give g/km or g/ton-mile. [web:4][web:10][web:13][web:14]"
      },
      {
        "vehicle_class": "City bus",
        "fuel": "Diesel",
        "metric": "Urban bus duty cycle",
        "CO2_ef": "800-1300",
        "NOx_ef": "2.0-6.0",
        "PM_ef": "0.05-0.25",
        "VOC_ef": "0.05-0.2",
        "source_hint": "Use bus-specific duty cycles and EF from COPERT / national inventories; MOVES project-level for transit buses. [web:4][web:10][web:13][web:14]"
      },
      {
        "vehicle_class": "City bus",
        "fuel": "CNG",
        "metric": "Urban bus duty cycle",
        "CO2_ef": "700-1100",
        "NOx_ef": "0.5-3.0",
        "PM_ef": "0.005-0.05",
        "VOC_ef": "0.1-0.4",
        "source_hint": "CNG typically lowers PM and NOx vs diesel but may increase methane; use COPERT gas-fuel EF and GREET for methane leakage. [web:13][web:19]"
      },
      {
        "vehicle_class": "Motorcycle",
        "fuel": "Petrol/gasoline",
        "metric": "Urban mixed driving",
        "CO2_ef": "70-130",
        "NOx_ef": "0.02-0.15",
        "PM_ef": "0.001-0.01",
        "VOC_ef": "0.3-1.0",
        "source_hint": "Use motorcycle/moped categories in COPERT and MOVES; VOC often high relative to cars. [web:4][web:10][web:13][web:14]"
      },
      {
        "vehicle_class": "Battery electric vehicle",
        "fuel": "Electricity",
        "metric": "Upstream WTW (no tailpipe)",
        "CO2_ef": "50-150",
        "NOx_ef": "0.02-0.1",
        "PM_ef": "0.01-0.05",
        "VOC_ef": "0.005-0.03",
        "source_hint": "Compute from typical BEV consumption 0.13-0.25 kWh/km times grid CI 200-600 gCO2/kWh using GREET or national factors. [web:16][web:19][web:25]"
      }
    ]
  },
  "adjustments": {
    "age_and_mileage": {
      "description": "Recommended deterioration multipliers for emission factors as a function of vehicle mileage, approximated from EMEP/EEA, HBEFA and recent deterioration studies. [web:6][web:20][web:23]",
      "mileage_bands_km": [
        {
          "band": "0-50000",
          "petrol_NOx_factor": "1.0",
          "petrol_CO_factor": "1.0",
          "petrol_PM_factor": "1.0",
          "diesel_NOx_factor": "1.0",
          "diesel_PM_factor": "1.0",
          "note": "Baseline type-approval or inventory factors; minimal deterioration assumed. [web:6][web:23]"
        },
        {
          "band": "50000-100000",
          "petrol_NOx_factor": "1.1",
          "petrol_CO_factor": "1.1-1.3",
          "petrol_PM_factor": "1.0-1.1",
          "diesel_NOx_factor": "1.1-1.2",
          "diesel_PM_factor": "1.0-1.1",
          "note": "Early in-use deterioration; studies show modest increases in NOx, CO and VOC. [web:6][web:20][web:23]"
        },
        {
          "band": "100000-160000",
          "petrol_NOx_factor": "1.2-1.5",
          "petrol_CO_factor": "1.5-2.0",
          "petrol_PM_factor": "1.1-1.3",
          "diesel_NOx_factor": "1.2-1.5",
          "diesel_PM_factor": "1.1-1.3",
          "note": "EMEP/EEA and HBEFA cap many deterioration factors around this mileage; remote sensing shows up to ~2.5-3x for some older gasoline vehicles. [web:6][web:9][web:12][web:23]"
        },
        {
          "band": "160000-240000",
          "petrol_NOx_factor": "1.5-2.5",
          "petrol_CO_factor": "2.0-3.0",
          "petrol_PM_factor": "1.3-1.8",
          "diesel_NOx_factor": "1.5-2.0",
          "diesel_PM_factor": "1.3-1.8",
          "note": "High-mileage deterioration; high-mileage study of Euro 6 and earlier finds diesel factors up to ~1.5x and gasoline factors up to ~2.5-3x vs 50 000 km. [web:20][web:23]"
        },
        {
          "band": ">240000",
          "petrol_NOx_factor": "2.0-3.0",
          "petrol_CO_factor": "3.0-4.0",
          "petrol_PM_factor": "1.5-2.5",
          "diesel_NOx_factor": "1.8-2.5",
          "diesel_PM_factor": "1.5-2.5",
          "note": "Limited data; inventories often cap factors, but some remote sensing suggests very high emitters at extreme mileage. [web:6][web:20][web:23]"
        }
      ],
      "functional_form": "Optionally approximate F_age_p(mileage) with a piecewise-linear function passing through midpoints of these bands; keep F_age_p >= 1.0 and cap beyond 9-10 years or 200000-240000 km as in EMEP/EEA practice. [web:6]"
    },
    "maintenance_state": {
      "description": "Multiplicative maintenance factors reflecting poor maintenance or malfunctioning emission controls; default values guided by I/M and repair studies. [web:6][web:21][web:24][web:26]",
      "states": [
        {
          "state": "well_maintained",
          "F_maint_all": "1.0",
          "note": "Vehicle passes inspection, no fault codes, routine servicing performed; use age/mileage factors only. [web:6][web:21]"
        },
        {
          "state": "moderately_poor_maintenance",
          "F_maint_NOx": "1.2-1.5",
          "F_maint_CO": "1.5-2.0",
          "F_maint_VOC": "1.5-2.0",
          "F_maint_PM": "1.2-1.6",
          "note": "Minor faults, infrequent servicing; emission controls partially degraded; consistent with moderate differences seen in remote sensing and inspection datasets. [web:6][web:12][web:23]"
        },
        {
          "state": "gross_emitter",
          "F_maint_NOx": "2.0-5.0",
          "F_maint_CO": "3.0-10.0",
          "F_maint_VOC": "3.0-10.0",
          "F_maint_PM": "2.0-5.0",
          "note": "Major malfunction (e.g., failed catalyst, EGR/DPF/SCR faults); repair studies show repairs can cut NOx and opacity by 50-80% or more, implying pre-repair factors of several times normal. [web:21][web:24][web:26]"
        }
      ]
    },
    "speed_and_road_type": {
      "description": "Average-speed correction factors relative to a reference speed (e.g., 50 km/h) for each road type and pollutant, derived from COPERT speed curves. [web:4][web:10][web:13]",
      "example_relative_factors": [
        {
          "vehicle_class": "Passenger car petrol Euro 6",
          "speed_kmh": 20,
          "road_type": "urban",
          "F_speed_CO": "1.5-2.0",
          "F_speed_NOx": "1.2-1.5",
          "F_speed_PM": "1.2",
          "note": "Stop-and-go driving at low speed increases CO and NOx relative to moderate speeds. [web:4][web:10][web:13]"
        },
        {
          "vehicle_class": "Passenger car petrol Euro 6",
          "speed_kmh": 50,
          "road_type": "urban/arterial",
          "F_speed_CO": "1.0",
          "F_speed_NOx": "1.0",
          "F_speed_PM": "1.0",
          "note": "Reference speed where EF_p,dist are often defined in emission factor tables. [web:4][web:10]"
        },
        {
          "vehicle_class": "Passenger car diesel Euro 6",
          "speed_kmh": 100,
          "road_type": "motorway",
          "F_speed_CO": "0.6-0.9",
          "F_speed_NOx": "1.0-1.3",
          "F_speed_PM": "0.8-1.0",
          "note": "Higher speeds can reduce CO/VOC but increase NOx due to higher engine load and combustion temperature. [web:4][web:10][web:13]"
        }
      ],
      "implementation_note": "In a web tool, store COPERT/MOVES speed-dependent EF_p,dist(v) directly and compute F_speed_p(v) as EF_p,dist(v)/EF_p,dist(v_ref). [web:13][web:14]"
    },
    "cold_start": {
      "description": "Cold start excess emissions as multiplicative factors on hot emissions, depending on fuel, technology, ambient temperature and distance driven after start. [web:13][web:14]",
      "example_factors": [
        {
          "vehicle_class": "Petrol car Euro 6",
          "T_amb_C": "20",
          "trip_length_km": "10",
          "F_cold_CO": "1.1-1.2",
          "F_cold_NOx": "1.05-1.1",
          "F_cold_VOC": "1.1-1.2",
          "note": "Mild cold-start impact at warm ambient temperatures and moderate trip length. [web:13]"
        },
        {
          "vehicle_class": "Petrol car Euro 6",
          "T_amb_C": "0",
          "trip_length_km": "3",
          "F_cold_CO": "2.0-3.0",
          "F_cold_NOx": "1.5-2.0",
          "F_cold_VOC": "2.0-3.0",
          "note": "Short trips at low temperatures produce large cold-start excess emissions. [web:13][web:14]"
        },
        {
          "vehicle_class": "Diesel car Euro 6",
          "T_amb_C": "0",
          "trip_length_km": "3",
          "F_cold_NOx": "1.2-1.6",
          "F_cold_PM": "1.2-1.5",
          "note": "Diesel cold-start effects generally smaller than gasoline for CO/VOC but relevant for NOx and PM. [web:13]"
        }
      ],
      "implementation_note": "Use EMEP/EEA cold-excess ratios per km or per start and integrate over user-specified number of cold starts and trip lengths. [web:13]"
    },
    "ambient_temperature": {
      "description": "Temperature adjustments for both tailpipe and evaporative emissions. [web:4][web:10][web:13]",
      "tailpipe_rules_of_thumb": [
        {
          "effect": "Cold-start emissions",
          "approx_change": "+2-4% per °C below 20 °C for CO and VOC on short trips",
          "note": "Based on EMEP/EEA and COPERT cold excess functions; implement by scaling R_cold_p. [web:13]"
        },
        {
          "effect": "Fuel consumption",
          "approx_change": "Up to +10-20% fuel use at -7 °C vs 20 °C for short urban trips",
          "note": "EMEP/EEA and national factors often embed this in cold correction on CO2 and pollutants. [web:4][web:10][web:13]"
        }
      ],
      "evaporative_rules_of_thumb": [
        {
          "effect": "Diurnal VOC emissions",
          "approx_change": "Proportional to daily temperature swing and absolute temperature; hot climates and high RVP fuels give highest diurnal losses.",
          "note": "Implement using EMEP/EEA equations with fuel RVP, min/max T, parking time. [web:10][web:13]"
        }
      ]
    },
    "evaporative_losses": {
      "description": "Approximate shares and sensitivity of evaporative VOC components. [web:4][web:10][web:13]",
      "components": [
        {
          "type": "Diurnal",
          "share_of_total_VOC": "30-50% for uncontrolled petrol vehicles, lower with canister controls",
          "key_drivers": "Fuel RVP, daily temperature swing, canister presence and purge strategy. [web:10][web:13]"
        },
        {
          "type": "Hot soak",
          "share_of_total_VOC": "20-40%",
          "key_drivers": "Engine/fuel temperature at shutdown, soak duration, ambient temperature. [web:10][web:13]"
        },
        {
          "type": "Running losses",
          "share_of_total_VOC": "10-30%",
          "key_drivers": "Fuel system design, underhood temperature, driving pattern. [web:10][web:13]"
        },
        {
          "type": "Refueling",
          "share_of_total_VOC": "10-30% without vapor recovery, much lower with Stage II controls",
          "key_drivers": "Presence of vapor recovery, throughput, fuel temperature. [web:10][web:13]"
        }
      ],
      "implementation_note": "For high-level tools, represent evaporative VOC as a fraction of tailpipe VOC using technology- and climate-dependent ratios from EMEP/EEA. [web:10][web:13]"
    }
  },
  "references": {
    "models_and_guidelines": [
      {
        "name": "EMEP/EEA Air Pollutant Emission Inventory Guidebook – Road Transport (COPERT methodology)",
        "description": "Official European guidebook for road-transport emission factors and methods, including speed-, temperature-, cold-start- and deterioration-dependent functions for tailpipe and evaporative emissions. [web:4][web:10][web:13]",
        "url": "https://www.eea.europa.eu/publications/emep-eea-guidebook-2023"
      },
      {
        "name": "COPERT model",
        "description": "EU standard software implementing EMEP/EEA road-transport methods, providing EF by vehicle class, fuel, emission standard and speed, including hot, cold and evaporative components. [web:1][web:7][web:13]",
        "url": "https://www.emisia.com/utilities/copert/"
      },
      {
        "name": "US EPA MOVES (MOtor Vehicle Emission Simulator)",
        "description": "US on-road mobile-source model estimating exhaust and evaporative emissions by vehicle source type, operating mode, age, fuel, and road type at project to national scales. [web:2][web:5][web:8][web:11][web:14]",
        "url": "https://www.epa.gov/moves"
      },
      {
        "name": "UK NAEI Road Transport Emission Factors",
        "description": "National emission factor sets derived largely from COPERT and EMEP/EEA, giving implied g/km factors for UK fleet and road types; useful as typical values. [web:4][web:10]",
        "url": "https://naei.beis.gov.uk/resources"
      },
      {
        "name": "GREET (Greenhouse gases, Regulated Emissions, and Energy use in Transportation) model",
        "description": "Argonne National Laboratory life-cycle model for well-to-wheel and vehicle-cycle energy use and emissions from conventional and alternative fuel/vehicle systems, including upstream electricity and fuel production. [web:16][web:19][web:22][web:25]",
        "url": "https://greet.anl.gov/"
      }
    ],
    "ageing_and_maintenance_peer_reviewed": [
      {
        "name": "Gasoline and diesel passenger car emissions deterioration using on-road remote sensing",
        "description": "Large remote-sensing study (≈197,000 vehicles) quantifying mileage-based deterioration for NOx, PM, CO and NH3, finding diesel NOx generally <1.5x at 200 000 km and gasoline up to ≈2.5-3x vs 50 000 km depending on Euro standard. [web:23]",
        "citation_hint": "Atmospheric Environment, 2022; use its deterioration gradients to calibrate F_age_p(mileage). [web:23]",
        "url": "https://doi.org/10.1016/j.atmosenv.2022.118944"
      },
      {
        "name": "High Mileage Emission Deterioration Factors from Euro 6 Positive and Compression Ignition Vehicles",
        "description": "Study of matched low- and high-mileage Euro 6 petrol, diesel and CNG vehicles using chassis dynamometer, RDE and remote sensing to derive high-mileage deterioration factors beyond 160 000 km. [web:20]",
        "citation_hint": "SAE Technical Paper 2022-01-1028; supports higher F_age values at 200 000-240 000 km. [web:20]",
        "url": "https://doi.org/10.4271/2022-01-1028"
      },
      {
        "name": "In-use compliance and deterioration of vehicle emissions",
        "description": "TNO technical report reviewing deterioration factors used in European inventories and measurement data, recommending caps around 9 years or 120 000 km and providing pollutant-specific deterioration percentages. [web:6]",
        "citation_hint": "Use to align age/mileage correction caps with EMEP/EEA practice. [web:6]",
        "url": "https://publications.tno.nl/publication/34620126/7LqhUz/TNO-2015-R11043.pdf"
      },
      {
        "name": "Emissions distributions by vehicle age and policy implications (TRUE Initiative)",
        "description": "Analysis of emissions distributions by age showing older vehicles, though few, contribute disproportionately to total fleet emissions due to deterioration and malfunctions. [web:9][web:12]",
        "citation_hint": "Supports modeling a small fraction of gross emitters with very high F_maint factors. [web:9][web:12]",
        "url": "https://theicct.org/publication/us-emissions-deterioration-true-initiative-2020/"
      },
      {
        "name": "Vehicle Emissions and Smog Checks with a Changing Fleet",
        "description": "Econometric analysis of California’s smog-check program showing emissions repairs for older vehicles significantly reduce ambient CO and NOx, quantifying benefits of maintenance. [web:21][web:26]",
        "citation_hint": "Use to justify strong maintenance factors and benefits of moving vehicles from gross-emitter to well-maintained states. [web:21][web:26]",
        "url": "https://www.nber.org/papers/w23966"
      },
      {
        "name": "Evaluation of emissions benefits of OBD-based repairs for heavy-duty vehicles",
        "description": "Study showing OBD-based repairs can reduce NOx emissions of malfunctioning heavy-duty diesel vehicles by 46–81% and opacity by ~43%, implying high pre-repair emission multipliers. [web:24][web:29]",
        "citation_hint": "Supports using F_maint_NOx and F_maint_PM values of 2–5x for gross emitters before repair. [web:24]",
        "url": "https://doi.org/10.1016/j.envint.2021.106375"
      }
    ]
  }
}\n```\n\n## Programming Implementation Feature\n\n```typescript\nexport interface EmissionFactorModel {
    id: string;
    name: string;
    description: string;
    emission_processes: string[];
    core_equation: string;
    notes: string;
}

export interface EmissionFactorRow {
    vehicle_class: string;
    fuel: string;
    metric: string;
    CO2_ef: string;
    NOx_ef: string;
    PM_ef: string;
    VOC_ef: string;
}

export interface AppEmissionData {
    factors: EmissionFactorModel[];
    emission_factors_table: {
        rows: EmissionFactorRow[];
    };
    formulas: Record<string, any>;
    adjustments: Record<string, any>;
}\n```\n