Emission Sense: EV Upstream (Grid) Emissions

When modeling emissions for Electric Vehicles (EVs), the standard tailpipe Base Emission Factors ($EF_{DB}$) are exactly zero. However, EVs consume electricity, shifting the environmental burden to the power grid. To calculate the true carbon footprint of an EV, we must calculate the Upstream Emissions (also known as Well-to-Wheel or Grid-to-Vehicle emissions).

This calculation relies on two major variables: the vehicle's electrical efficiency (kWh/km) and the carbon intensity of the local power grid ($g \text{ } CO_2 / kWh$).

1. The Indian Electric Grid Intensity Factor ($EF_{grid}$)

The Carbon Emission Factor of the grid dictates how heavily reliant a region is on fossil fuels (like coal) versus renewable energy (like solar, hydro, and nuclear).

In India, the Central Electricity Authority (CEA) regularly publishes the $CO_2$ Baseline Database for the Indian Power Sector. Because India's grid is heavily coal-dependent, the emission factor is significantly higher than the global average.

Global Average Grid Intensity: $\approx 450 \text{ g } CO_2 / \text{kWh}$

European Union Average: $\approx 250 \text{ g } CO_2 / \text{kWh}$

Indian National Grid Average ($EF_{grid\_in}$): $\approx 716 \text{ g } CO_2 / \text{kWh}$ ($0.716 \text{ kg/kWh}$)

(Note: If calculating for specific Indian states, this can vary. For example, states with massive hydro-power like Himachal Pradesh have a much lower grid factor, whereas coal-heavy states like Jharkhand are higher. For national modeling, $716 \text{ g/kWh}$ is the standard baseline).

2. EV Energy Consumption Rates ($E_{drain}$)

To find out how much electricity is pulled from the grid, we need the vehicle's electrical efficiency—how many kilowatt-hours (kWh) it takes to drive one kilometer.

If the specific vehicle data is unavailable via Gemini extraction, use the following standard baseline approximations:

Vehicle Class

Example Model

Avg. Energy Drain ($E_{drain}$)

2W (Scooter)

Ather 450X, Ola S1

$0.025 \text{ kWh/km}$

3W (Rickshaw)

Mahindra Treo

$0.060 \text{ kWh/km}$

PV (Car)

Tata Nexon EV, MG ZS

$0.140 \text{ kWh/km}$

LCV (Van)

Tata Ace EV

$0.250 \text{ kWh/km}$

HCV (Bus)

Tata Ultra EV Bus

$0.900 \text{ kWh/km}$

3. Charging Loss / Inefficiency ($\eta_{charge}$)

When electricity moves from the grid wall outlet into the chemical battery of the EV, heat is generated. This means drawing $10 \text{ kWh}$ of power from the grid might only put $9 \text{ kWh}$ into the battery.

Standard AC home chargers operate at roughly $90\%$ efficiency ($\eta_{charge} = 0.90$). This means the vehicle must draw more power from the grid than it actually consumes to move.

4. The Mathematical Equation

The total Upstream $CO_2$ emissions for an EV trip is calculated by multiplying the distance by the energy drain, adjusting for charging losses, and finally multiplying by the grid intensity factor.

$$E_{Upstream(CO2)} = D \times \left( \frac{E_{drain}}{\eta_{charge}} \right) \times EF_{grid}$$

Where:

$E_{Upstream(CO2)}$: Total $CO_2$ emitted at the power plant (grams).

$D$: Distance traveled (kilometers).

$E_{drain}$: Vehicle energy consumption ($kWh/km$).

$\eta_{charge}$: Charging efficiency ($\approx 0.90$).

$EF_{grid}$: Grid Carbon Intensity ($716 \text{ g/kWh}$ for India).

Example Comparison (EV vs. Petrol)

Petrol Car ($15 \text{ km/L}$): Driving $100 \text{ km}$ emits $\approx 15,300 \text{ g}$ of $CO_2$ directly from the tailpipe.

EV Car ($0.14 \text{ kWh/km}$): Driving $100 \text{ km}$ requires $(100 \times 0.14) / 0.90 = 15.55 \text{ kWh}$ from the grid. At the Indian grid factor of $716 \text{ g/kWh}$, this produces $15.55 \times 716 = \mathbf{11,133 \text{ g}}$ of $CO_2$.

Conclusion: Even on a dirty, coal-heavy grid like India's, an EV reduces $CO_2$ emissions by roughly 27% compared to a standard petrol car.

5. Software Implementation Reference

Here is the algorithmic logic to implement the EV Upstream (Grid) calculation in your engine:

def get_ev_upstream_co2(distance_km, vehicle_type="PV", custom_drain_kwh=None, grid_factor_g_kwh=716.0):
    """
    Calculates the Upstream (Grid) CO2 emissions for an Electric Vehicle.
    
    :param distance_km: Distance traveled in kilometers.
    :param vehicle_type: The class of the EV (2W, 3W, PV, LCV, HCV).
    :param custom_drain_kwh: Optional override for exact kWh/km if known.
    :param grid_factor_g_kwh: The grid intensity. Defaults to 716.0 g/kWh (India CEA Average).
    :return: Total grams of CO2 emitted by the power grid.
    """
    
    # 1. Define standard energy drain rates (kWh/km)
    base_drain_rates = {
        "2W": 0.025,
        "3W": 0.060,
        "PV": 0.140,  # Passenger Vehicle
        "LCV": 0.250,
        "HCV": 0.900
    }
    
    # 2. Select drain rate (prioritize custom exact drain if provided)
    if custom_drain_kwh is not None and custom_drain_kwh > 0:
        e_drain = custom_drain_kwh
    else:
        e_drain = base_drain_rates.get(vehicle_type, 0.140)
        
    # 3. Charging Efficiency Loss
    # AC charging is typically ~90% efficient
    charging_efficiency = 0.90
    
    # 4. Calculate total energy pulled from the grid
    # E_plug = Distance * (Drain / Efficiency)
    energy_pulled_from_grid_kwh = distance_km * (e_drain / charging_efficiency)
    
    # 5. Calculate Total CO2
    total_grid_co2_grams = energy_pulled_from_grid_kwh * grid_factor_g_kwh
    
    return round(total_grid_co2_grams, 3)

# --- Example Executions ---

# Standard Electric Car (PV) driving 50 km on the Indian Grid
# get_ev_upstream_co2(50.0, vehicle_type="PV")
# Math: 50 * (0.140 / 0.90) * 716.0 = 5568.889 grams of CO2

# Electric Scooter (2W) driving 15 km on the Indian Grid
# get_ev_upstream_co2(15.0, vehicle_type="2W")
# Math: 15 * (0.025 / 0.90) * 716.0 = 298.333 grams of CO2
