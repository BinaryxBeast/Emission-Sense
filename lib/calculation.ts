export type VehicleType = '2wheeler' | 'car' | 'suv' | 'bus' | 'truck';
export type FuelType = 'petrol' | 'diesel' | 'cng' | 'hybrid' | 'ev';
export type EmissionStandard = 'bs2' | 'bs3' | 'bs4' | 'bs6';
export type EngineSize = 'small' | 'medium' | 'large';
export type TripLength = 'short' | 'medium' | 'long';
export type ClimateZone = 'cool' | 'moderate' | 'hot';
export type MaintenanceLevel = 'good' | 'average' | 'poor';

export interface CalculationInput {
    vType: VehicleType;
    fType: FuelType;
    eStd: EmissionStandard;
    eSize: EngineSize;
    dTot: number;
    cityPct: number;
    age: number;
    maint: MaintenanceLevel;

    // New Advanced Fields
    engineCC?: number | null;
    cylinders?: number | null;
    turbocharged?: boolean;
    fuelInjection?: string | null;
    transmission?: string | null;
    fuelEfficiencyKmpl?: number | null;
    kerbWeightKg?: number | null;
    variant?: string | null;

    loadFactor?: number; // 1 (1 person), 1.5 (family), 2.0 (full load)
    avgSpeed?: number; // km/h
    acUsage?: 'None' | 'Moderate' | 'Heavy';
    trafficIntensity?: 'Low' | 'Medium' | 'High';
    city?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const EF_DB: Record<string, any> = {
    "2wheeler": {
        petrol: {
            bs2: { city: { CO2: 72, NOx: 0.35, PM25: 0.06, CO: 6.5, HC: 3.2 }, hwy: { CO2: 55, NOx: 0.25, PM25: 0.04, CO: 4.0, HC: 2.0 } },
            bs3: { city: { CO2: 65, NOx: 0.28, PM25: 0.05, CO: 4.8, HC: 2.4 }, hwy: { CO2: 50, NOx: 0.20, PM25: 0.03, CO: 3.0, HC: 1.5 } },
            bs4: { city: { CO2: 58, NOx: 0.18, PM25: 0.03, CO: 2.8, HC: 1.4 }, hwy: { CO2: 45, NOx: 0.12, PM25: 0.02, CO: 1.8, HC: 0.9 } },
            bs6: { city: { CO2: 50, NOx: 0.08, PM25: 0.015, CO: 1.2, HC: 0.6 }, hwy: { CO2: 40, NOx: 0.05, PM25: 0.01, CO: 0.8, HC: 0.4 } }
        },
        diesel: {
            bs2: { city: { CO2: 68, NOx: 0.50, PM25: 0.12, CO: 3.0, HC: 1.0 }, hwy: { CO2: 52, NOx: 0.35, PM25: 0.08, CO: 2.0, HC: 0.6 } },
            bs3: { city: { CO2: 62, NOx: 0.40, PM25: 0.09, CO: 2.2, HC: 0.8 }, hwy: { CO2: 48, NOx: 0.28, PM25: 0.06, CO: 1.5, HC: 0.5 } },
            bs4: { city: { CO2: 55, NOx: 0.28, PM25: 0.05, CO: 1.5, HC: 0.5 }, hwy: { CO2: 43, NOx: 0.20, PM25: 0.03, CO: 1.0, HC: 0.3 } },
            bs6: { city: { CO2: 48, NOx: 0.10, PM25: 0.02, CO: 0.8, HC: 0.3 }, hwy: { CO2: 38, NOx: 0.06, PM25: 0.01, CO: 0.5, HC: 0.2 } }
        },
        cng: {
            bs2: { city: { CO2: 55, NOx: 0.20, PM25: 0.02, CO: 4.0, HC: 3.5 }, hwy: { CO2: 42, NOx: 0.14, PM25: 0.01, CO: 2.5, HC: 2.2 } },
            bs3: { city: { CO2: 50, NOx: 0.16, PM25: 0.015, CO: 3.0, HC: 2.8 }, hwy: { CO2: 38, NOx: 0.11, PM25: 0.01, CO: 2.0, HC: 1.8 } },
            bs4: { city: { CO2: 45, NOx: 0.10, PM25: 0.01, CO: 2.0, HC: 1.6 }, hwy: { CO2: 35, NOx: 0.07, PM25: 0.005, CO: 1.2, HC: 1.0 } },
            bs6: { city: { CO2: 40, NOx: 0.05, PM25: 0.005, CO: 1.0, HC: 0.8 }, hwy: { CO2: 32, NOx: 0.03, PM25: 0.003, CO: 0.6, HC: 0.5 } }
        },
        hybrid: {
            bs2: { city: { CO2: 52, NOx: 0.22, PM25: 0.04, CO: 4.0, HC: 2.0 }, hwy: { CO2: 45, NOx: 0.18, PM25: 0.03, CO: 2.8, HC: 1.4 } },
            bs3: { city: { CO2: 46, NOx: 0.18, PM25: 0.03, CO: 3.0, HC: 1.5 }, hwy: { CO2: 40, NOx: 0.14, PM25: 0.02, CO: 2.0, HC: 1.0 } },
            bs4: { city: { CO2: 40, NOx: 0.12, PM25: 0.02, CO: 1.8, HC: 0.9 }, hwy: { CO2: 35, NOx: 0.08, PM25: 0.01, CO: 1.2, HC: 0.6 } },
            bs6: { city: { CO2: 35, NOx: 0.05, PM25: 0.01, CO: 0.8, HC: 0.4 }, hwy: { CO2: 30, NOx: 0.03, PM25: 0.006, CO: 0.5, HC: 0.3 } }
        },
        ev: {
            bs2: { city: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 }, hwy: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 } },
            bs3: { city: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 }, hwy: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 } },
            bs4: { city: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 }, hwy: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 } },
            bs6: { city: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 }, hwy: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 } }
        }
    },
    car: {
        petrol: {
            bs2: { city: { CO2: 210, NOx: 0.80, PM25: 0.06, CO: 12.0, HC: 2.8 }, hwy: { CO2: 155, NOx: 0.50, PM25: 0.04, CO: 6.0, HC: 1.5 } },
            bs3: { city: { CO2: 195, NOx: 0.55, PM25: 0.05, CO: 7.5, HC: 2.0 }, hwy: { CO2: 140, NOx: 0.35, PM25: 0.03, CO: 4.0, HC: 1.2 } },
            bs4: { city: { CO2: 175, NOx: 0.35, PM25: 0.03, CO: 4.5, HC: 1.2 }, hwy: { CO2: 125, NOx: 0.20, PM25: 0.02, CO: 2.5, HC: 0.7 } },
            bs6: { city: { CO2: 150, NOx: 0.12, PM25: 0.01, CO: 1.8, HC: 0.5 }, hwy: { CO2: 110, NOx: 0.06, PM25: 0.005, CO: 1.0, HC: 0.3 } }
        },
        diesel: {
            bs2: { city: { CO2: 190, NOx: 1.20, PM25: 0.18, CO: 5.0, HC: 1.0 }, hwy: { CO2: 140, NOx: 0.80, PM25: 0.12, CO: 3.0, HC: 0.6 } },
            bs3: { city: { CO2: 178, NOx: 0.90, PM25: 0.14, CO: 3.8, HC: 0.8 }, hwy: { CO2: 130, NOx: 0.60, PM25: 0.09, CO: 2.2, HC: 0.5 } },
            bs4: { city: { CO2: 165, NOx: 0.60, PM25: 0.08, CO: 2.5, HC: 0.5 }, hwy: { CO2: 120, NOx: 0.40, PM25: 0.05, CO: 1.5, HC: 0.3 } },
            bs6: { city: { CO2: 142, NOx: 0.18, PM25: 0.02, CO: 1.2, HC: 0.3 }, hwy: { CO2: 105, NOx: 0.10, PM25: 0.01, CO: 0.7, HC: 0.2 } }
        },
        cng: {
            bs2: { city: { CO2: 160, NOx: 0.45, PM25: 0.02, CO: 8.0, HC: 3.5 }, hwy: { CO2: 120, NOx: 0.30, PM25: 0.01, CO: 5.0, HC: 2.2 } },
            bs3: { city: { CO2: 148, NOx: 0.35, PM25: 0.015, CO: 5.5, HC: 2.8 }, hwy: { CO2: 110, NOx: 0.22, PM25: 0.01, CO: 3.5, HC: 1.8 } },
            bs4: { city: { CO2: 132, NOx: 0.22, PM25: 0.01, CO: 3.5, HC: 1.6 }, hwy: { CO2: 98, NOx: 0.14, PM25: 0.005, CO: 2.0, HC: 1.0 } },
            bs6: { city: { CO2: 115, NOx: 0.08, PM25: 0.005, CO: 1.5, HC: 0.8 }, hwy: { CO2: 85, NOx: 0.04, PM25: 0.003, CO: 0.8, HC: 0.5 } }
        },
        hybrid: {
            bs2: { city: { CO2: 145, NOx: 0.50, PM25: 0.04, CO: 7.5, HC: 1.8 }, hwy: { CO2: 120, NOx: 0.38, PM25: 0.03, CO: 4.5, HC: 1.1 } },
            bs3: { city: { CO2: 130, NOx: 0.35, PM25: 0.03, CO: 5.0, HC: 1.3 }, hwy: { CO2: 108, NOx: 0.25, PM25: 0.02, CO: 3.0, HC: 0.8 } },
            bs4: { city: { CO2: 115, NOx: 0.22, PM25: 0.02, CO: 3.0, HC: 0.8 }, hwy: { CO2: 95, NOx: 0.14, PM25: 0.01, CO: 1.8, HC: 0.5 } },
            bs6: { city: { CO2: 98, NOx: 0.08, PM25: 0.006, CO: 1.2, HC: 0.3 }, hwy: { CO2: 82, NOx: 0.04, PM25: 0.003, CO: 0.7, HC: 0.2 } }
        },
        ev: {
            bs2: { city: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 }, hwy: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 } },
            bs3: { city: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 }, hwy: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 } },
            bs4: { city: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 }, hwy: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 } },
            bs6: { city: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 }, hwy: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 } }
        }
    },
    suv: {
        petrol: {
            bs2: { city: { CO2: 280, NOx: 1.10, PM25: 0.08, CO: 14.0, HC: 3.5 }, hwy: { CO2: 200, NOx: 0.65, PM25: 0.05, CO: 7.0, HC: 1.8 } },
            bs3: { city: { CO2: 255, NOx: 0.75, PM25: 0.06, CO: 9.5, HC: 2.5 }, hwy: { CO2: 185, NOx: 0.45, PM25: 0.04, CO: 5.0, HC: 1.4 } },
            bs4: { city: { CO2: 230, NOx: 0.48, PM25: 0.04, CO: 5.8, HC: 1.5 }, hwy: { CO2: 165, NOx: 0.28, PM25: 0.02, CO: 3.2, HC: 0.9 } },
            bs6: { city: { CO2: 195, NOx: 0.16, PM25: 0.015, CO: 2.2, HC: 0.6 }, hwy: { CO2: 142, NOx: 0.08, PM25: 0.008, CO: 1.2, HC: 0.4 } }
        },
        diesel: {
            bs2: { city: { CO2: 260, NOx: 1.60, PM25: 0.24, CO: 6.5, HC: 1.2 }, hwy: { CO2: 185, NOx: 1.05, PM25: 0.15, CO: 3.8, HC: 0.7 } },
            bs3: { city: { CO2: 240, NOx: 1.20, PM25: 0.18, CO: 5.0, HC: 1.0 }, hwy: { CO2: 172, NOx: 0.80, PM25: 0.12, CO: 2.8, HC: 0.6 } },
            bs4: { city: { CO2: 218, NOx: 0.80, PM25: 0.10, CO: 3.2, HC: 0.6 }, hwy: { CO2: 158, NOx: 0.52, PM25: 0.06, CO: 2.0, HC: 0.4 } },
            bs6: { city: { CO2: 185, NOx: 0.24, PM25: 0.025, CO: 1.5, HC: 0.4 }, hwy: { CO2: 135, NOx: 0.14, PM25: 0.012, CO: 0.9, HC: 0.2 } }
        },
        cng: {
            bs2: { city: { CO2: 215, NOx: 0.60, PM25: 0.03, CO: 10.0, HC: 4.2 }, hwy: { CO2: 158, NOx: 0.38, PM25: 0.02, CO: 6.0, HC: 2.6 } },
            bs3: { city: { CO2: 198, NOx: 0.45, PM25: 0.02, CO: 7.0, HC: 3.4 }, hwy: { CO2: 145, NOx: 0.28, PM25: 0.015, CO: 4.5, HC: 2.2 } },
            bs4: { city: { CO2: 175, NOx: 0.28, PM25: 0.015, CO: 4.5, HC: 2.0 }, hwy: { CO2: 130, NOx: 0.18, PM25: 0.008, CO: 2.5, HC: 1.2 } },
            bs6: { city: { CO2: 150, NOx: 0.10, PM25: 0.006, CO: 1.8, HC: 1.0 }, hwy: { CO2: 112, NOx: 0.05, PM25: 0.004, CO: 1.0, HC: 0.6 } }
        },
        hybrid: {
            bs2: { city: { CO2: 195, NOx: 0.68, PM25: 0.05, CO: 9.0, HC: 2.2 }, hwy: { CO2: 155, NOx: 0.48, PM25: 0.04, CO: 5.0, HC: 1.4 } },
            bs3: { city: { CO2: 175, NOx: 0.48, PM25: 0.04, CO: 6.5, HC: 1.6 }, hwy: { CO2: 140, NOx: 0.32, PM25: 0.03, CO: 3.5, HC: 1.0 } },
            bs4: { city: { CO2: 155, NOx: 0.30, PM25: 0.025, CO: 3.8, HC: 1.0 }, hwy: { CO2: 125, NOx: 0.18, PM25: 0.015, CO: 2.2, HC: 0.6 } },
            bs6: { city: { CO2: 130, NOx: 0.10, PM25: 0.008, CO: 1.4, HC: 0.4 }, hwy: { CO2: 105, NOx: 0.05, PM25: 0.004, CO: 0.8, HC: 0.2 } }
        },
        ev: {
            bs2: { city: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 }, hwy: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 } },
            bs3: { city: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 }, hwy: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 } },
            bs4: { city: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 }, hwy: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 } },
            bs6: { city: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 }, hwy: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 } }
        }
    },
    bus: {
        petrol: {
            bs2: { city: { CO2: 850, NOx: 8.0, PM25: 0.3, CO: 25.0, HC: 5.0 }, hwy: { CO2: 650, NOx: 5.5, PM25: 0.2, CO: 15.0, HC: 3.0 } },
            bs3: { city: { CO2: 780, NOx: 6.0, PM25: 0.22, CO: 18.0, HC: 3.8 }, hwy: { CO2: 600, NOx: 4.0, PM25: 0.15, CO: 11.0, HC: 2.2 } },
            bs4: { city: { CO2: 700, NOx: 4.0, PM25: 0.15, CO: 12.0, HC: 2.5 }, hwy: { CO2: 540, NOx: 2.8, PM25: 0.10, CO: 7.0, HC: 1.5 } },
            bs6: { city: { CO2: 600, NOx: 1.5, PM25: 0.05, CO: 5.0, HC: 1.0 }, hwy: { CO2: 460, NOx: 0.8, PM25: 0.03, CO: 3.0, HC: 0.6 } }
        },
        diesel: {
            bs2: { city: { CO2: 780, NOx: 12.0, PM25: 0.6, CO: 10.0, HC: 2.5 }, hwy: { CO2: 600, NOx: 8.0, PM25: 0.4, CO: 6.0, HC: 1.5 } },
            bs3: { city: { CO2: 720, NOx: 9.0, PM25: 0.45, CO: 7.5, HC: 2.0 }, hwy: { CO2: 550, NOx: 6.0, PM25: 0.30, CO: 4.5, HC: 1.2 } },
            bs4: { city: { CO2: 650, NOx: 6.0, PM25: 0.25, CO: 5.0, HC: 1.2 }, hwy: { CO2: 500, NOx: 4.0, PM25: 0.16, CO: 3.0, HC: 0.7 } },
            bs6: { city: { CO2: 560, NOx: 2.0, PM25: 0.08, CO: 2.5, HC: 0.5 }, hwy: { CO2: 430, NOx: 1.2, PM25: 0.04, CO: 1.5, HC: 0.3 } }
        },
        cng: {
            bs2: { city: { CO2: 620, NOx: 4.5, PM25: 0.1, CO: 18.0, HC: 8.0 }, hwy: { CO2: 480, NOx: 3.0, PM25: 0.06, CO: 11.0, HC: 5.0 } },
            bs3: { city: { CO2: 570, NOx: 3.5, PM25: 0.08, CO: 13.0, HC: 6.0 }, hwy: { CO2: 440, NOx: 2.2, PM25: 0.05, CO: 8.0, HC: 3.8 } },
            bs4: { city: { CO2: 510, NOx: 2.2, PM25: 0.05, CO: 8.0, HC: 3.5 }, hwy: { CO2: 390, NOx: 1.4, PM25: 0.03, CO: 5.0, HC: 2.2 } },
            bs6: { city: { CO2: 440, NOx: 0.8, PM25: 0.02, CO: 3.5, HC: 1.5 }, hwy: { CO2: 340, NOx: 0.4, PM25: 0.01, CO: 2.0, HC: 0.8 } }
        },
        hybrid: {
            bs2: { city: { CO2: 600, NOx: 5.0, PM25: 0.2, CO: 16.0, HC: 3.2 }, hwy: { CO2: 480, NOx: 3.5, PM25: 0.14, CO: 10.0, HC: 2.0 } },
            bs3: { city: { CO2: 540, NOx: 3.8, PM25: 0.15, CO: 12.0, HC: 2.5 }, hwy: { CO2: 430, NOx: 2.6, PM25: 0.10, CO: 7.0, HC: 1.5 } },
            bs4: { city: { CO2: 480, NOx: 2.5, PM25: 0.10, CO: 7.5, HC: 1.6 }, hwy: { CO2: 380, NOx: 1.8, PM25: 0.06, CO: 4.5, HC: 1.0 } },
            bs6: { city: { CO2: 400, NOx: 1.0, PM25: 0.03, CO: 3.5, HC: 0.7 }, hwy: { CO2: 320, NOx: 0.5, PM25: 0.02, CO: 2.0, HC: 0.4 } }
        },
        ev: {
            bs2: { city: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 }, hwy: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 } },
            bs3: { city: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 }, hwy: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 } },
            bs4: { city: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 }, hwy: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 } },
            bs6: { city: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 }, hwy: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 } }
        }
    },
    truck: {
        petrol: {
            bs2: { city: { CO2: 950, NOx: 9.5, PM25: 0.35, CO: 28.0, HC: 5.5 }, hwy: { CO2: 720, NOx: 6.5, PM25: 0.22, CO: 16.0, HC: 3.2 } },
            bs3: { city: { CO2: 870, NOx: 7.0, PM25: 0.25, CO: 20.0, HC: 4.2 }, hwy: { CO2: 660, NOx: 4.8, PM25: 0.16, CO: 12.0, HC: 2.5 } },
            bs4: { city: { CO2: 780, NOx: 4.8, PM25: 0.18, CO: 14.0, HC: 2.8 }, hwy: { CO2: 600, NOx: 3.2, PM25: 0.12, CO: 8.0, HC: 1.6 } },
            bs6: { city: { CO2: 670, NOx: 1.8, PM25: 0.06, CO: 5.5, HC: 1.2 }, hwy: { CO2: 510, NOx: 1.0, PM25: 0.03, CO: 3.2, HC: 0.7 } }
        },
        diesel: {
            bs2: { city: { CO2: 880, NOx: 14.0, PM25: 0.7, CO: 12.0, HC: 3.0 }, hwy: { CO2: 670, NOx: 9.5, PM25: 0.45, CO: 7.0, HC: 1.8 } },
            bs3: { city: { CO2: 810, NOx: 10.5, PM25: 0.5, CO: 9.0, HC: 2.2 }, hwy: { CO2: 615, NOx: 7.0, PM25: 0.35, CO: 5.0, HC: 1.4 } },
            bs4: { city: { CO2: 730, NOx: 7.0, PM25: 0.30, CO: 6.0, HC: 1.5 }, hwy: { CO2: 560, NOx: 4.8, PM25: 0.20, CO: 3.5, HC: 0.8 } },
            bs6: { city: { CO2: 630, NOx: 2.5, PM25: 0.10, CO: 3.0, HC: 0.6 }, hwy: { CO2: 480, NOx: 1.5, PM25: 0.05, CO: 1.8, HC: 0.4 } }
        },
        cng: {
            bs2: { city: { CO2: 700, NOx: 5.5, PM25: 0.12, CO: 20.0, HC: 9.0 }, hwy: { CO2: 530, NOx: 3.5, PM25: 0.08, CO: 12.0, HC: 5.5 } },
            bs3: { city: { CO2: 640, NOx: 4.0, PM25: 0.09, CO: 15.0, HC: 7.0 }, hwy: { CO2: 490, NOx: 2.6, PM25: 0.06, CO: 9.0, HC: 4.2 } },
            bs4: { city: { CO2: 575, NOx: 2.5, PM25: 0.06, CO: 9.5, HC: 4.0 }, hwy: { CO2: 440, NOx: 1.6, PM25: 0.04, CO: 5.5, HC: 2.5 } },
            bs6: { city: { CO2: 500, NOx: 1.0, PM25: 0.025, CO: 4.0, HC: 1.8 }, hwy: { CO2: 380, NOx: 0.5, PM25: 0.012, CO: 2.2, HC: 1.0 } }
        },
        hybrid: {
            bs2: { city: { CO2: 670, NOx: 6.0, PM25: 0.22, CO: 18.0, HC: 3.5 }, hwy: { CO2: 530, NOx: 4.2, PM25: 0.15, CO: 11.0, HC: 2.2 } },
            bs3: { city: { CO2: 610, NOx: 4.5, PM25: 0.16, CO: 13.0, HC: 2.8 }, hwy: { CO2: 480, NOx: 3.0, PM25: 0.11, CO: 8.0, HC: 1.6 } },
            bs4: { city: { CO2: 540, NOx: 3.0, PM25: 0.12, CO: 8.5, HC: 1.8 }, hwy: { CO2: 420, NOx: 2.0, PM25: 0.08, CO: 5.0, HC: 1.0 } },
            bs6: { city: { CO2: 450, NOx: 1.2, PM25: 0.04, CO: 3.8, HC: 0.8 }, hwy: { CO2: 350, NOx: 0.6, PM25: 0.02, CO: 2.2, HC: 0.5 } }
        },
        ev: {
            bs2: { city: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 }, hwy: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 } },
            bs3: { city: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 }, hwy: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 } },
            bs4: { city: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 }, hwy: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 } },
            bs6: { city: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 }, hwy: { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 } }
        }
    }
};

import {
    getAgeDeteriorationFactor,
    getAgeDeteriorationFactorCO2,
    estimateMileage,
    MAINTENANCE_MULTIPLIERS,
    calculateEVGridCO2,
    FUEL_CO2_FACTORS,
    getDrivingConditionMultipliers,
    getTechMultipliers
} from './emissions';

// Non-Exhaust PM2.5 factors (mg/km) — EMEP/EEA 2023 Guidebook
// Separated into tyre wear and brake wear for accuracy
const NEE_FACTORS: Record<string, { tyre: number, brake: number }> = {
    '2wheeler': { tyre: 2.0, brake: 1.5 },   // Light 2W: minimal tyre/brake mass
    'car':      { tyre: 8.0, brake: 5.0 },    // Medium PV (Non-Exhaust_Emissions.md)
    'suv':      { tyre: 12.0, brake: 8.0 },   // Large SUV
    'bus':      { tyre: 30.0, brake: 20.0 },   // HCV
    'truck':    { tyre: 30.0, brake: 20.0 }    // HCV
};

// COPERT Cold-Start excess multipliers by pollutant (temperate 20°C baseline)
// Cold_Start.md lines 48-79: multipliers applied to the first 1.5km of each trip
const COLD_START_MULTIPLIERS: Record<string, Record<string, { petrol: number, diesel: number }>> = {
    CO2:  { temperate: { petrol: 1.20, diesel: 1.15 } },
    NOx:  { temperate: { petrol: 1.80, diesel: 2.00 } },
    PM25: { temperate: { petrol: 2.50, diesel: 3.00 } },
    CO:   { temperate: { petrol: 6.00, diesel: 2.00 } },
    HC:   { temperate: { petrol: 5.00, diesel: 2.50 } }
};

export function calculateEmissions(inputs: CalculationInput) {
    const {
        vType, fType, eStd, dTot, cityPct, age, maint,
        turbocharged, fuelInjection, transmission, fuelEfficiencyKmpl, kerbWeightKg,
        loadFactor = 1, acUsage = 'Moderate', trafficIntensity = 'Medium'
    } = inputs;
    const hwyPct = 100 - cityPct;

    let baseEF = EF_DB[vType]?.[fType]?.[eStd];
    if (!baseEF) {
        baseEF = {
            city: { CO2: 150, NOx: 0.2, PM25: 0.02, CO: 2.0, HC: 0.5 },
            hwy: { CO2: 120, NOx: 0.1, PM25: 0.01, CO: 1.0, HC: 0.2 }
        };
    }

    // 1. AGE DETERIORATION — separate factors for toxic vs CO2
    // Research: CO2 degrades max ~5%, toxic pollutants degrade up to 2.2x
    let f_age_toxic = 1.0;
    let f_age_co2 = 1.0;
    if (fType !== 'ev') {
        const estMileage = estimateMileage(age, dTot);
        f_age_toxic = getAgeDeteriorationFactor(estMileage);
        f_age_co2 = getAgeDeteriorationFactorCO2(estMileage);
    }

    // 2. MAINTENANCE Factor (Gross Emitters) — now includes CO2
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let f_maint: any = { NOx: 1.0, CO: 1.0, PM25: 1.0, HC: 1.0, CO2: 1.0 };
    if (fType !== 'ev') {
        f_maint = MAINTENANCE_MULTIPLIERS[maint] ?? MAINTENANCE_MULTIPLIERS.average;
    }

    // 3. DRIVING CONDITIONS & TECH FACTORS
    const f_drive = getDrivingConditionMultipliers(acUsage, trafficIntensity, loadFactor);
    const f_tech = getTechMultipliers(turbocharged || false, fuelInjection, transmission);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adjEF = { city: {} as any, hwy: {} as any };

    // CO2: apply CO2-specific age factor and CO2 maint factor (mild)
    adjEF.city['CO2'] = baseEF.city['CO2'] * f_age_co2 * (f_maint.CO2 || 1.0) * f_drive.CO2 * f_tech.CO2;
    adjEF.hwy['CO2'] = baseEF.hwy['CO2'] * f_age_co2 * (f_maint.CO2 || 1.0) * f_drive.CO2 * f_tech.CO2;

    // Toxic pollutants: full age + maintenance + driving + tech
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ['NOx', 'PM25', 'CO', 'HC'].forEach((p: any) => {
        const multiplier = f_age_toxic * (f_maint[p as keyof typeof f_maint] || 1.0) * (f_drive[p as keyof typeof f_drive] || 1.0) * (f_tech[p as keyof typeof f_tech] || 1.0);
        adjEF.city[p] = baseEF.city[p] * multiplier;
        adjEF.hwy[p] = baseEF.hwy[p] * multiplier;
    });

    // 4. WEIGHT PENALTY — 4% per 100kg over 1500kg (vehicle_weight_penalty.md)
    // Only affects CO2; toxic pollutants already sized by factory for weight class
    if (kerbWeightKg && kerbWeightKg > 1500) {
        const excessSteps = (kerbWeightKg - 1500) / 100;
        const k_weight_city = 0.04; // 4% per 100kg in city
        const k_weight_hwy = 0.03;  // 3% per 100kg on highway (less acceleration)
        adjEF.city['CO2'] *= (1 + excessSteps * k_weight_city);
        adjEF.hwy['CO2'] *= (1 + excessSteps * k_weight_hwy);
    }

    const d_city = dTot * (cityPct / 100);
    const d_hwy = dTot * (hwyPct / 100);

    // Hot-running emissions (fully warmed engine)
    const e_hot = { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.keys(e_hot).forEach((p: any) => {
        e_hot[p as keyof typeof e_hot] = (adjEF.city[p] * d_city) + (adjEF.hwy[p] * d_hwy);
    });

    // 5. COPERT COLD-START PHASE SPLIT (Cold_Start.md)
    // Split each trip into: cold phase (first 1.5km) + hot phase (rest)
    // Assume ~2 trips per day (dTot / 2 = avg trip distance)
    const e_cold = { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 };
    let d_cold_total = 0;
    if (fType !== 'ev') {
        const numTrips = 2; // assumed daily trips
        const avgTripDist = dTot / numTrips;
        const coldDistPerTrip = Math.min(1.5, avgTripDist); // max 1.5km cold phase per trip
        d_cold_total = coldDistPerTrip * numTrips; // total cold-phase km per day

        // Determine fuel-class for multiplier lookup
        const fuelClass = (fType === 'diesel') ? 'diesel' : 'petrol'; // petrol covers petrol/cng/hybrid

        // Average city EF for the cold phase (cold start mainly in city driving)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Object.keys(e_cold).forEach((p: any) => {
            const coldMult = COLD_START_MULTIPLIERS[p]?.temperate?.[fuelClass] || 1.0;
            // Cold-start excess = cold_distance × base_EF × (cold_multiplier - 1.0)
            // This is the ADDITIONAL emission beyond what hot-running would produce
            const baseEfCity = adjEF.city[p] || 0;
            e_cold[p as keyof typeof e_cold] = d_cold_total * baseEfCity * (coldMult - 1.0);
        });
    }

    // 6. NON-EXHAUST PM2.5 — separate tyre + brake (Non-Exhaust_Emissions.md)
    const neeFactors = NEE_FACTORS[vType] || NEE_FACTORS['car'];
    let tyrePM25 = (neeFactors.tyre * dTot) / 1000; // mg/km → g
    let brakePM25 = (neeFactors.brake * dTot) / 1000;

    // EV regenerative braking reduces brake wear by 10%, but NOT tyre wear
    if (fType === 'ev') {
        brakePM25 *= 0.90;
    }

    const ne_PM25 = tyrePM25 + brakePM25;
    const e_non_exhaust = {
        CO2: 0, NOx: 0, PM25: ne_PM25, CO: 0, HC: 0,
        tyrePM25, brakePM25 // detailed breakdown
    };

    // 7. EVAPORATIVE HC — running loss + hot soak (Evaporative_Emissions.md)
    // E_evap = (D × 0.05 g/km + 1.5g per trip) × f_fuel
    let evap_HC = 0;
    const numTripsEvap = 2; // assumed daily trips for hot-soak events
    if (fType === 'petrol' || fType === 'hybrid') {
        evap_HC = (dTot * 0.05) + (1.5 * numTripsEvap); // running loss + hot soak
    } else if (fType === 'cng') {
        evap_HC = ((dTot * 0.05) + (1.5 * numTripsEvap)) * 0.1; // CNG: 10% of petrol evap
    }
    // Diesel and EV: 0 evaporative emissions

    const e_evap = { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: evap_HC };

    // 8. FUEL EFFICIENCY BASED CO2 & EV GRID
    let finalCO2 = (e_hot.CO2 + e_cold.CO2) / 1000;

    // Override CO2 calculation if real-world precise fuel efficiency is provided
    if (fuelEfficiencyKmpl && fuelEfficiencyKmpl > 0 && fType !== 'ev') {
        const litersConsumed = dTot / fuelEfficiencyKmpl;
        let fuelCo2Kg = 0;
        if (fType === 'petrol' || fType === 'hybrid') fuelCo2Kg = litersConsumed * FUEL_CO2_FACTORS.GASOLINE_KG_PER_L;
        if (fType === 'diesel') fuelCo2Kg = litersConsumed * FUEL_CO2_FACTORS.DIESEL_KG_PER_L;
        if (fType === 'cng') fuelCo2Kg = litersConsumed * FUEL_CO2_FACTORS.CNG_KG_PER_KG;

        // Apply driving penalties (AC, traffic, load) and maintenance CO2 to fuel-based calc
        fuelCo2Kg *= f_drive.CO2 * (f_maint.CO2 || 1.0);

        // Apply weight penalty if available
        if (kerbWeightKg && kerbWeightKg > 1500) {
            const excessSteps = (kerbWeightKg - 1500) / 100;
            fuelCo2Kg *= (1 + excessSteps * 0.04);
        }

        // Add cold start overhead
        finalCO2 = fuelCo2Kg + (e_cold.CO2 / 1000);
    }

    if (fType === 'ev') {
        finalCO2 = calculateEVGridCO2(vType, dTot, FUEL_CO2_FACTORS.ELECTRIC_INDIA_KG_PER_KWH) / 1000;
        // Penalize AC via increased EV consumption
        if (acUsage === 'Heavy') finalCO2 *= 1.20;
        else if (acUsage === 'Moderate') finalCO2 *= 1.08;
    }

    const total = {
        CO2: finalCO2,
        NOx: e_hot.NOx + e_cold.NOx,
        PM25: e_hot.PM25 + e_cold.PM25 + e_non_exhaust.PM25,
        CO: e_hot.CO + e_cold.CO,
        HC: e_hot.HC + e_cold.HC + e_evap.HC
    };

    return { total, e_hot, e_cold, e_non_exhaust, e_evap, d_city, d_hwy, d_cold_total, adjEF, fType };
}

