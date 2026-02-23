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
    trips: number;
    cityPct: number;
    age: number;
    maint: MaintenanceLevel;
    tripLen: TripLength;
    climate: ClimateZone;
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

import { getAgeDeteriorationFactor, estimateMileage, MAINTENANCE_MULTIPLIERS, getColdStartRatio, calculateEVGridCO2, FUEL_CO2_FACTORS } from './emissions';

export function calculateEmissions(inputs: CalculationInput) {
    const { vType, fType, eStd, dTot, trips, cityPct, age, maint, tripLen, climate } = inputs;
    const hwyPct = 100 - cityPct;

    let baseEF = EF_DB[vType]?.[fType]?.[eStd];
    if (!baseEF) {
        baseEF = {
            city: { CO2: 150, NOx: 0.2, PM25: 0.02, CO: 2.0, HC: 0.5 },
            hwy: { CO2: 120, NOx: 0.1, PM25: 0.01, CO: 1.0, HC: 0.2 }
        };
    }

    // 1. ADVANCED AGE Factor (Piecewise by mileage)
    let f_age = 1.0;
    if (fType !== 'ev') {
        const estMileage = estimateMileage(age, dTot); // age * daily * 365
        f_age = getAgeDeteriorationFactor(estMileage);
    }

    // 2. ADVANCED MAINTENANCE Factor (Gross Emitters)
    let f_maint: Record<string, number> = { NOx: 1.0, CO: 1.0, PM25: 1.0, HC: 1.0 };
    if (fType !== 'ev') {
        f_maint = MAINTENANCE_MULTIPLIERS[maint] || MAINTENANCE_MULTIPLIERS.average;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adjEF: Record<string, any> = { city: {}, hwy: {} };
    // Maintain CO2 without gross-emitter modifiers, only apply f_age for fuel efficiency drops
    adjEF.city['CO2'] = baseEF.city['CO2'] * f_age;
    adjEF.hwy['CO2'] = baseEF.hwy['CO2'] * f_age;

    ['NOx', 'PM25', 'CO', 'HC'].forEach(p => {
        const multiplier = f_age * (f_maint[p] || 1.0);
        adjEF.city[p] = baseEF.city[p] * multiplier;
        adjEF.hwy[p] = baseEF.hwy[p] * multiplier;
    });

    const d_city = dTot * (cityPct / 100);
    const d_hwy = dTot * (hwyPct / 100);

    const e_hot: Record<string, number> = { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 };
    Object.keys(e_hot).forEach(p => {
        e_hot[p] = (adjEF.city[p] * d_city) + (adjEF.hwy[p] * d_hwy);
    });

    // 3. ADVANCED COLD START MULTIPLIERS
    const e_cold: Record<string, number> = { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 };
    if (fType !== 'ev') {
        // Cold distance depends on number of starts (trips/2 usually cold)
        let cold_dist = Math.min((trips * 1.5), d_city); // Assume first 1.5km of cold start

        const r_cold_multiplier = getColdStartRatio(fType, climate, tripLen === 'short');

        Object.keys(e_cold).forEach(p => {
            // Cold start is base * multiplier * cold distance
            e_cold[p] = adjEF.city[p] * (r_cold_multiplier[p] || 0) * cold_dist;
        });
    }

    const nonExhaustBase: Record<string, number> = {
        '2wheeler': 0.015,
        'car': 0.035,
        'suv': 0.050,
        'bus': 0.150,
        'truck': 0.200
    };
    let ne_PM25 = nonExhaustBase[vType] * dTot;
    if (fType === 'ev') ne_PM25 *= 0.9;

    const e_non_exhaust = { CO2: 0, NOx: 0, PM25: ne_PM25, CO: 0, HC: 0 };

    let evap_HC = 0;
    if (fType === 'petrol' || fType === 'hybrid') evap_HC = 0.2 * dTot;
    if (fType === 'cng') evap_HC = 0.1 * dTot;
    if (climate === 'hot') evap_HC *= 1.5;

    const e_evap = { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: evap_HC };

    // 4. EV GRID CO2 FORMULA
    let finalCO2 = (e_hot.CO2 + e_cold.CO2) / 1000;
    if (fType === 'ev') {
        // Returns grams, so convert to kg
        finalCO2 = calculateEVGridCO2(vType, dTot, FUEL_CO2_FACTORS.ELECTRIC_INDIA_KG_PER_KWH) / 1000;
    }

    const total = {
        CO2: finalCO2,
        NOx: e_hot.NOx + e_cold.NOx,
        PM25: e_hot.PM25 + e_cold.PM25 + e_non_exhaust.PM25,
        CO: e_hot.CO + e_cold.CO,
        HC: e_hot.HC + e_cold.HC + e_evap.HC
    };

    return { total, e_hot, e_cold, e_non_exhaust, e_evap, d_city, d_hwy, adjEF, fType };
}
