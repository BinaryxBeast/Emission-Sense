# Model Architecture

The ASEP Emission Model follows a multi-layered approach to convert vehicle activity and health data into accurate pollutant estimates.

## Architecture Diagram

```mermaid
graph TD
    %% Input Layer
    subgraph Inputs ["1. Input Layer"]
        V[Vehicle Specs: Type, Fuel, Std, Tech]
        T[Trip Data: Distance, City%, AC, Traffic, Load]
        H[Health/Maint: Odometer, Service Logs, Engine Cond]
    end

    %% Database/Lookup
    subgraph Lookup ["2. Base Factor Retrieval"]
        DB[(EF_DB Database)]
        V --> DB
        T --> DB
        DB --> BEF[Base Emission Factors: CO2, NOx, PM2.5, CO, HC]
    end

    %% Core Modifiers
    subgraph Modifiers ["3. Core Correction Layers"]
        direction TB
        Age[Age/Mileage Deterioration]
        Maint[Maintenance Level Factors]
        Drive[Driving Conditions: AC, Traffic, Load]
        Tech[Tech Factors: Turbo, Injection, Trans]
        
        H --> Age
        H --> Maint
        T --> Drive
        V --> Tech
    end

    %% Advanced Modules
    subgraph Advanced ["4. Advanced Physics Modules"]
        direction LR
        Cold[Cold Start Excess Phase]
        NEE[Non-Exhaust PM2.5: Tyre/Brake]
        Evap[Evaporative HC: Running/Soak]
        Weight[Weight Penalty CO2]
    end

    %% Logic Processing
    BEF --> Processing{Logic Processing}
    Modifiers --> Processing
    
    Processing --> Hot[Hot Running Phase]
    Processing --> Cold
    Processing --> NEE
    Processing --> Evap
    Processing --> Weight

    %% Override / Alternative
    subgraph Overrides ["5. Specialized Calculation Paths"]
        FE[Fuel Efficiency Based CO2]
        Grid[EV Upstream Grid CO2]
    end

    Processing --> Overrides

    %% Health Penalties
    subgraph Health ["6. Health & Service Penalties"]
        Srv[Overdue Service: Oil, Filter, PUC]
        Cond[Real-world Condition: Smoke, Noise]
    end

    H --> Health

    %% Final Aggregation
    subgraph Output ["7. Final Aggregation"]
        Total[Total Emissions: g/km & Total kg]
        Hot + Cold + NEE + Evap + Overrides --> Total
        Health --> Total
    end

    style Total fill:#f96,stroke:#333,stroke-width:4px
    style DB fill:#69f,stroke:#333,stroke-width:2px
    style Overrides fill:#bfb,stroke:#333,stroke-dasharray: 5 5
```

## Description of Layers

1.  **Input Layer:** Captures static vehicle attributes, dynamic trip conditions, and historical maintenance data.
2.  **Base Factor Retrieval:** Queries the `EF_DB` (Emission Factor Database) for baseline values determined by Vehicle Type, Fuel Type, and Emission Standard (e.g., BS-IV, BS-VI).
3.  **Core Correction Layers:** Applies multi-dimensional multipliers. Toxic pollutants degrade up to **2.2x** via $f_{age}$, while CO2 degrades minimally.
4.  **Advanced Physics Modules:** 
    *   **Cold Start:** Models the first 1.5km of each trip using COPERT multipliers.
    *   **Non-Exhaust:** Calculates PM2.5 from tyre and brake wear (reduced by 10% for EV regenerative braking).
    *   **Evaporative:** Models HC losses for petrol/CNG vehicles.
5.  **Specialized Paths:** Allows for high-precision CO2 calculation if real-world Fuel Efficiency (km/pl) is known, or calculates upstream emissions for EVs based on Grid Intensity.
6.  **Health & Service Penalties:** Dynamic penalties for overdue oil changes, clogged air filters, and expired PUC certificates.
7.  **Final Aggregation:** Combines all components into a comprehensive emission profile.
