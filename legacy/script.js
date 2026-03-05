// ===== Tab Navigation =====
const navBtns = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        navBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.getAttribute('data-tab');
        document.getElementById(tab + '-tab').classList.add('active');
        if (tab === 'map' && !map) initMap();
    });
});

// ===== Multi-Step Form =====
const steps = document.querySelectorAll('.form-step');
const indicators = document.querySelectorAll('.step-indicator');
let currentStep = 1;

function goToStep(n) {
    steps.forEach(s => s.classList.remove('active'));
    indicators.forEach(ind => {
        const sn = parseInt(ind.dataset.step);
        ind.classList.remove('active', 'done');
        if (sn < n) ind.classList.add('done');
        if (sn === n) ind.classList.add('active');
    });
    document.querySelector(`.form-step[data-step="${n}"]`).classList.add('active');
    currentStep = n;
}

document.getElementById('step1Next').addEventListener('click', () => goToStep(2));
document.getElementById('step2Prev').addEventListener('click', () => goToStep(1));
document.getElementById('step2Next').addEventListener('click', () => goToStep(3));
document.getElementById('step3Prev').addEventListener('click', () => goToStep(2));

// City % slider
const citySlider = document.getElementById('cityPercent');
const cityText = document.getElementById('cityPercentText');
citySlider.addEventListener('input', () => {
    const v = citySlider.value;
    cityText.textContent = `${v}% City`;
    citySlider.style.background = `linear-gradient(to right, #00e676 ${v}%, rgba(255,255,255,0.1) ${v}%)`;
});
citySlider.dispatchEvent(new Event('input'));

// ===== EMISSION FACTOR DATABASE =====
// Based on India-specific WRI/Shakti factors, EMEP/EEA, and IPCC Tier 1/2
// Keys: [vehicleType][fuelType][emissionStandard] → {city, highway} each with {CO2_gkm, NOx, PM25, CO, HC}

const EF_DB = {
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

// ===== CALCULATION ENGINE =====
const emissionForm = document.getElementById('emissionForm');

if (emissionForm) {
    emissionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Gather Inputs
        const vType = document.getElementById('vehicleType').value;
        const fType = document.getElementById('fuelType').value;
        const eStd = document.getElementById('emissionStandard').value;
        const eSize = document.getElementById('engineSize').value;
        const fuelEfficiency = parseFloat(document.getElementById('fuelEfficiency').value) || null;
        const kerbWeight = parseFloat(document.getElementById('kerbWeight').value) || 1500;

        const dTot = parseFloat(document.getElementById('dailyDistance').value) || 0;
        const trips = parseInt(document.getElementById('tripsPerDay').value) || 0;
        const cityPct = parseInt(document.getElementById('cityPercent').value) || 0;
        const hwyPct = 100 - cityPct;
        const trafficCondition = document.getElementById('trafficCondition').value;
        const acUsage = document.getElementById('acUsage').value;
        const payloadPct = parseFloat(document.getElementById('payloadPct').value) || 0.0;

        const age = parseInt(document.getElementById('vehicleAge').value) || 0;
        const maint = document.getElementById('maintenanceLevel').value;
        const odometer = parseInt(document.getElementById('odometerReading').value) || null;
        const tripLen = document.querySelector('input[name="tripLength"]:checked').value;
        const climate = document.querySelector('input[name="climate"]:checked').value;

        if (dTot <= 0) return;

        console.log("--- Advanced Emission Factors UX Ready ---", {
            fuelEfficiency, kerbWeight, trafficCondition, acUsage, payloadPct, odometer
        });

        // 2. Base Emission Factors
        let baseEF = EF_DB[vType]?.[fType]?.[eStd];
        if (!baseEF) {
            // Fallback if combination doesn't exist
            baseEF = {
                city: { CO2: 150, NOx: 0.2, PM25: 0.02, CO: 2.0, HC: 0.5 },
                hwy: { CO2: 120, NOx: 0.1, PM25: 0.01, CO: 1.0, HC: 0.2 }
            };
        }

        // --- FUEL EFFICIENCY OVERRIDE ---
        if (fuelEfficiency && fuelEfficiency > 0) {
            const stoich = { 'petrol': 2300, 'diesel': 2680, 'cng': 2660, 'hybrid': 2300 }[fType] || 2300;
            const overrideCO2 = stoich / fuelEfficiency;
            baseEF.city.CO2 = overrideCO2;
            baseEF.hwy.CO2 = overrideCO2 * 0.85; // Roughly 15% better on highway
        }

        // --- KERB WEIGHT PENALTY (CO2) ---
        let f_weight = 1.0;
        if (fType !== '2wheeler' && fType !== '3wheeler' && kerbWeight > 1500) {
            f_weight = 1.0 + ((kerbWeight - 1500) / 100) * 0.04;
        }

        // --- MAINTENANCE FACTOR (f_maint) ---
        let f_maint_obj = { CO2: 1.0, NOx: 1.0, PM25: 1.0, CO: 1.0, HC: 1.0 };
        if (fType !== 'ev') {
            if (maint === 'average') f_maint_obj = { CO2: 1.05, NOx: 1.2, PM25: 1.5, CO: 1.5, HC: 1.5 };
            if (maint === 'poor') f_maint_obj = { CO2: 1.15, NOx: 3.0, PM25: 8.0, CO: 4.0, HC: 5.0 };
        }

        // --- AGE DETERIORATION (f_age) ---
        let f_age = 1.0;
        if (fType !== 'ev') {
            let estimatedMileage = odometer !== null ? odometer : (age * dTot * 365);
            if (estimatedMileage > 0) {
                if (estimatedMileage <= 50000) f_age = 1.0 + (estimatedMileage / 50000) * 0.2;
                else if (estimatedMileage <= 100000) f_age = 1.2 + ((estimatedMileage - 50000) / 50000) * 0.4;
                else f_age = 1.6 + ((Math.min(estimatedMileage, 160000) - 100000) / 60000) * 0.6; // cap 2.2
            }
        }

        // --- DRIVING CONDITION MODIFIERS (f_drive) ---
        let f_ac = acUsage === 'Heavy' ? 1.15 : (acUsage === 'Moderate' ? 1.05 : 1.0);
        let f_ac_pm = 1.0 + ((f_ac - 1.0) / 2);

        let f_traffic = { CO2: 1.0, NOx: 1.0, PM25: 1.0, CO: 1.0, HC: 1.0 };
        if (trafficCondition === 'Stop-and-Go') {
            f_traffic = { CO2: 1.20, NOx: 1.40, PM25: 1.30, CO: 1.50, HC: 1.20 };
        }

        let beta = (vType === 'bus' || vType === 'truck') ? 0.40 : 0.15;
        let f_load = 1.0 + (payloadPct * beta);
        let f_load_pm = 1.0 + ((f_load - 1.0) * 0.5);

        let f_drive_obj = {
            CO2: f_ac * f_traffic.CO2 * f_load,
            NOx: f_ac * f_traffic.NOx * f_load,
            PM25: f_ac_pm * f_traffic.PM25 * f_load_pm,
            CO: f_ac * f_traffic.CO * f_load_pm,
            HC: f_ac * f_traffic.HC * f_load_pm
        };

        // --- TRIP PHASING (HOT VS COLD) ---
        let e_cold = { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 };
        let e_hot = { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 };

        let d_cold_total = 0;
        let d_hot_total = dTot;

        if (fType !== 'ev') {
            d_cold_total = Math.min(dTot, trips * 1.5); // Max 1.5km cold per trip
            d_hot_total = Math.max(0, dTot - d_cold_total);

            let d_city_hot = d_hot_total * (cityPct / 100);
            let d_hwy_hot = d_hot_total * (hwyPct / 100);

            const cold_mults_petrol = { 'cool': { CO2: 1.3, NOx: 1.4, PM25: 1.2, CO: 2.0, HC: 2.5 }, 'moderate': { CO2: 1.2, NOx: 1.2, PM25: 1.1, CO: 1.5, HC: 1.5 }, 'hot': { CO2: 1.1, NOx: 1.1, PM25: 1.0, CO: 1.2, HC: 1.2 } };
            const cold_mults_diesel = { 'cool': { CO2: 1.2, NOx: 1.6, PM25: 2.0, CO: 1.5, HC: 1.5 }, 'moderate': { CO2: 1.1, NOx: 1.3, PM25: 1.5, CO: 1.2, HC: 1.2 }, 'hot': { CO2: 1.05, NOx: 1.1, PM25: 1.2, CO: 1.1, HC: 1.1 } };

            let e_cold_m = (fType === 'diesel') ? cold_mults_diesel[climate] : cold_mults_petrol[climate];

            ['CO2', 'NOx', 'PM25', 'CO', 'HC'].forEach(p => {
                let weight_mult = (p === 'CO2') ? f_weight : 1.0;
                let age_mult = (p === 'CO2') ? 1.0 : f_age;

                // Hot Phase Exhaust
                e_hot[p] = (baseEF.city[p] * d_city_hot + baseEF.hwy[p] * d_hwy_hot) * age_mult * f_maint_obj[p] * f_drive_obj[p] * weight_mult;

                // Cold Phase Exhaust (Assumed City)
                e_cold[p] = (baseEF.city[p] * d_cold_total) * age_mult * f_maint_obj[p] * e_cold_m[p] * weight_mult;
            });
        }

        // --- NON-EXHAUST EMISSIONS (PM2.5) ---
        // EMEP/EEA TSP factors (g/km) converted to PM2.5
        const nonExhaustBase = {
            '2wheeler': 0.015,
            'car': 0.035,
            'suv': 0.050,
            'bus': 0.150,
            'truck': 0.200
        };
        let ne_PM25 = nonExhaustBase[vType] * dTot;

        // EV regen braking reduces brake wear, but heavy battery increases tyre wear
        if (fType === 'ev') ne_PM25 *= 0.9;

        let e_non_exhaust = { CO2: 0, NOx: 0, PM25: ne_PM25, CO: 0, HC: 0 };

        // --- EVAPORATIVE EMISSIONS (HC) ---
        let evap_HC = 0;
        if (fType === 'petrol' || fType === 'hybrid') {
            let f_temp = climate === 'hot' ? 1.5 : (climate === 'cool' ? 0.6 : 1.0);
            evap_HC = ((dTot * 0.05) + (trips * 1.5)) * f_temp * (f_maint_obj.HC || 1.0);
        }
        let e_evap = { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: evap_HC };

        // --- UPSTREAM GRID EMISSIONS (EVs) ---
        let e_grid_co2 = 0;
        if (fType === 'ev') {
            const evDrains = { '2wheeler': 0.025, 'car': 0.140, 'suv': 0.200, 'bus': 0.900, 'truck': 1.000 };
            let drain = evDrains[vType] || 0.140;
            e_grid_co2 = (dTot * drain / 0.90) * 716.0; // grams
        }

        // 8. Total Emissions
        let total = {
            CO2: (e_hot.CO2 + e_cold.CO2 + e_grid_co2) / 1000, // Convert g to kg
            NOx: e_hot.NOx + e_cold.NOx,
            PM25: e_hot.PM25 + e_cold.PM25 + e_non_exhaust.PM25,
            CO: e_hot.CO + e_cold.CO,
            HC: e_hot.HC + e_cold.HC + e_evap.HC
        };

        // Render Results
        document.getElementById('val-co2').textContent = total.CO2.toFixed(1);
        document.getElementById('val-nox').textContent = total.NOx.toFixed(1);
        document.getElementById('val-pm25').textContent = total.PM25.toFixed(1);
        document.getElementById('val-co').textContent = total.CO.toFixed(1);
        document.getElementById('val-hc').textContent = total.HC.toFixed(1);

        // Max values for bars (visual only)
        const maxVals = { CO2: 20, NOx: 50, PM25: 5, CO: 200, HC: 50 };
        Object.keys(Math).forEach(() => { }); // dummy

        setTimeout(() => {
            document.getElementById('bar-co2').style.width = Math.min((total.CO2 / maxVals.CO2) * 100, 100) + '%';
            document.getElementById('bar-nox').style.width = Math.min((total.NOx / maxVals.NOx) * 100, 100) + '%';
            document.getElementById('bar-pm25').style.width = Math.min((total.PM25 / maxVals.PM25) * 100, 100) + '%';
            document.getElementById('bar-co').style.width = Math.min((total.CO / maxVals.CO) * 100, 100) + '%';
            document.getElementById('bar-hc').style.width = Math.min((total.HC / maxVals.HC) * 100, 100) + '%';
        }, 100);

        // Rating
        const ratingBanner = document.getElementById('ratingBanner');
        const ratingIcon = document.getElementById('ratingIcon');
        const ratingLabel = document.getElementById('ratingLabel');
        const ratingDesc = document.getElementById('ratingDesc');

        ratingBanner.className = 'rating-banner'; // reset

        let score = (total.CO2 / 5) + (total.PM25 / 0.5); // simplistic scoring
        if (fType === 'ev') {
            ratingBanner.classList.add('low');
            ratingIcon.textContent = '🌿';
            ratingLabel.textContent = 'Zero Exhaust Emissions';
            ratingDesc.textContent = 'Excellent! Your vehicle produces no tailpipe emissions.';
        } else if (score < 2) {
            ratingBanner.classList.add('low');
            ratingIcon.textContent = '✅';
            ratingLabel.textContent = 'Low Emission Vehicle';
            ratingDesc.textContent = 'Your vehicle produces below-average daily emissions.';
        } else if (score < 4) {
            ratingBanner.classList.add('moderate');
            ratingIcon.textContent = '⚠️';
            ratingLabel.textContent = 'Moderate Emissions';
            ratingDesc.textContent = 'Consider reducing short trips or checking tire pressure.';
        } else if (score < 7) {
            ratingBanner.classList.add('high');
            ratingIcon.textContent = '🏭';
            ratingLabel.textContent = 'High Emissions';
            ratingDesc.textContent = 'Your footprint is significant. Regular maintenance helps.';
        } else {
            ratingBanner.classList.add('critical');
            ratingIcon.textContent = '🚨';
            ratingLabel.textContent = 'Critical Emissions';
            ratingDesc.textContent = 'Highly polluting profile. Consider public transit or an EV/BS-VI upgrade.';
        }

        // Breakdown Chart (PM2.5 source)
        const ex_pct = total.PM25 === 0 ? 0 : ((e_hot.PM25 + e_cold.PM25) / total.PM25) * 100;
        const nex_pct = total.PM25 === 0 ? 0 : (e_non_exhaust.PM25 / total.PM25) * 100;

        document.getElementById('sourceBar').innerHTML = `
            <div class="bar-segment" style="width: ${ex_pct}%; background: #ff1744;" title="Exhaust"></div>
            <div class="bar-segment" style="width: ${nex_pct}%; background: #7c4dff;" title="Non-Exhaust"></div>
        `;
        document.getElementById('sourceBreakdown').innerHTML = `
            <div class="breakdown-item">
                <span class="breakdown-label"><span class="breakdown-dot" style="background:#ff1744"></span> Tailpipe Exhaust</span>
                <span class="breakdown-val">${(e_hot.PM25 + e_cold.PM25).toFixed(2)} g</span>
            </div>
            <div class="breakdown-item">
                <span class="breakdown-label"><span class="breakdown-dot" style="background:#7c4dff"></span> Tyre/Brake Wear</span>
                <span class="breakdown-val">${e_non_exhaust.PM25.toFixed(2)} g</span>
            </div>
        `;

        // Breakdown Chart (Road type CO2)
        const c_pct = total.CO2 === 0 ? 50 : (d_city / dTot) * 100;
        const h_pct = total.CO2 === 0 ? 50 : (d_hwy / dTot) * 100;

        document.getElementById('roadBar').innerHTML = `
            <div class="bar-segment" style="width: ${c_pct}%; background: #00e676;" title="City"></div>
            <div class="bar-segment" style="width: ${h_pct}%; background: #00b0ff;" title="Highway"></div>
        `;

        let c_co2 = (adjEF.city.CO2 * d_city) / 1000;
        let h_co2 = (adjEF.hwy.CO2 * d_hwy) / 1000;

        document.getElementById('roadBreakdown').innerHTML = `
            <div class="breakdown-item">
                <span class="breakdown-label"><span class="breakdown-dot" style="background:#00e676"></span> City Driving</span>
                <span class="breakdown-val">${c_co2.toFixed(1)} kg</span>
            </div>
            <div class="breakdown-item">
                <span class="breakdown-label"><span class="breakdown-dot" style="background:#00b0ff"></span> Highway Driving</span>
                <span class="breakdown-val">${h_co2.toFixed(1)} kg</span>
            </div>
        `;

        // Comparison
        const nat_avg = { CO2: 4.5, PM25: 0.8 };
        let co2_diff = ((total.CO2 - nat_avg.CO2) / nat_avg.CO2) * 100;
        let co2_color = co2_diff <= 0 ? '#00e676' : '#ff1744';

        document.getElementById('comparisonContent').innerHTML = `
            <div class="comparison-row">
                <div class="comparison-label">You (CO₂)</div>
                <div class="comparison-bar-track">
                    <div class="comparison-bar-fill" style="width: ${Math.min(total.CO2 * 10, 100)}%; background: ${co2_color}"></div>
                </div>
                <div class="comparison-value">${total.CO2.toFixed(1)} kg</div>
            </div>
            <div class="comparison-row">
                <div class="comparison-label">Nat'l Avg</div>
                <div class="comparison-bar-track">
                    <div class="comparison-bar-fill" style="width: ${nat_avg.CO2 * 10}%; background: rgba(255,255,255,0.3)"></div>
                </div>
                <div class="comparison-value">${nat_avg.CO2} kg</div>
            </div>
            <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.5rem; text-align:right;">
                ${Math.abs(co2_diff).toFixed(0)}% ${co2_diff > 0 ? 'higher' : 'lower'} than average
            </p>
        `;

        // Eco Tips
        let tipsHtml = '';
        if (fType !== 'ev') {
            if (tripLen === 'short') {
                tipsHtml += `<div class="eco-tip"><span class="eco-tip-icon">🚶</span><span>Your trips are short. A cold engine burns more fuel. Consider walking or cycling for trips under 3km.</span></div>`;
            }
            if (maint === 'poor' || age > 10) {
                tipsHtml += `<div class="eco-tip"><span class="eco-tip-icon">🔧</span><span>Your vehicle's age/condition is adding ~30% more emissions. An engine tune-up and filter change can drastically lower PM and CO.</span></div>`;
            }
            if (eStd === 'bs2' || eStd === 'bs3') {
                tipsHtml += `<div class="eco-tip"><span class="eco-tip-icon">♻️</span><span>Older BS2/BS3 engines lack modern catalysts. Consider the Government Scrappage Policy for incentives on a new BS6/EV.</span></div>`;
            }
        } else {
            tipsHtml += `<div class="eco-tip"><span class="eco-tip-icon">⚡</span><span>Great job driving an EV! To reduce non-exhaust PM2.5 (tyre wear), ensure tyres are properly inflated and utilize regenerative braking instead of hard stops.</span></div>`;
        }

        if (cityPct > 70) {
            tipsHtml += `<div class="eco-tip"><span class="eco-tip-icon">🚦</span><span>High city driving means more idling. Turn off your engine at signals longer than 30 seconds to save fuel and cut local NOx.</span></div>`;
        }

        if (!tipsHtml) {
            tipsHtml = `<div class="eco-tip"><span class="eco-tip-icon">🚗</span><span>Maintain smooth acceleration and braking to keep emissions low and maximize fuel economy.</span></div>`;
        }
        document.getElementById('ecoTipsContent').innerHTML = tipsHtml;

        // Save to History
        saveHistory(vType.toUpperCase() + ' (' + fType + ')', total.CO2.toFixed(1));

        // Show Results
        document.getElementById('resultsDashboard').classList.remove('hidden');
        document.getElementById('resultsDashboard').scrollIntoView({ behavior: 'smooth' });
    });
}

function saveHistory(veh, co2) {
    let hist = JSON.parse(localStorage.getItem('emiHistory') || '[]');
    hist.unshift({
        veh: veh,
        co2: co2,
        date: new Date().toLocaleDateString()
    });
    if (hist.length > 5) hist.pop();
    localStorage.setItem('emiHistory', JSON.stringify(hist));
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('historyList');
    if (!list) return;
    let hist = JSON.parse(localStorage.getItem('emiHistory') || '[]');
    if (hist.length === 0) {
        list.innerHTML = '<li class="history-empty">No previous calculations</li>';
        return;
    }
    list.innerHTML = hist.map(h => `
        <li class="history-item">
            <span class="history-vehicle">${h.veh}</span>
            <span class="history-co2">${h.co2} kg CO₂</span>
            <span class="history-date">${h.date}</span>
        </li>
    `).join('');
}


// ===== Regulatory Map (Leaflet) =====
let map = null;

function initMap() {
    map = L.map('complianceMap').setView([20.5937, 78.9629], 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    const zones = [
        { name: "Delhi NCR Corridor", coords: [28.6139, 77.2090], aqi: 312, severity: 'critical', desc: "Severe tailpipe emissions + road dust.", type: 'Critical Zone' },
        { name: "Mumbai WEH", coords: [19.0760, 72.8777], aqi: 185, severity: 'high', desc: "Heavy commercial traffic, high NOx.", type: 'High Zone' },
        { name: "Bangalore ORR", coords: [12.9716, 77.5946], aqi: 155, severity: 'high', desc: "Extreme idling and congestion CO2.", type: 'High Zone' },
        { name: "Chennai Port Road", coords: [13.0827, 80.2707], aqi: 142, severity: 'moderate', desc: "Diesel truck PM2.5 emissions high.", type: 'Moderate Zone' },
        { name: "Chandigarh LEZ", coords: [30.7333, 76.7794], aqi: 85, severity: 'low', desc: "Strict BS-VI enforcement. Low NOx.", type: 'Low Emission Zone' },
        { name: "Indore City Center", coords: [22.7196, 75.8577], aqi: 95, severity: 'low', desc: "E-bus fleet operations active.", type: 'Low Emission Zone' }
    ];

    const getColor = (s) => {
        if (s === 'critical') return '#ff1744';
        if (s === 'high') return '#ff9100';
        if (s === 'moderate') return '#ffea00';
        return '#00e676';
    };

    zones.forEach(z => {
        const color = getColor(z.severity);
        const html = `<div style="width:20px;height:20px;background:${color};border-radius:50%;opacity:0.6;border:2px solid ${color};box-shadow: 0 0 10px ${color}"></div>`;
        const icon = L.divIcon({ html: html, className: '', iconSize: [20, 20], iconAnchor: [10, 10] });

        L.marker(z.coords, { icon: icon }).addTo(map)
            .bindPopup(`
                <h3>${z.name}</h3>
                <p><strong>Status:</strong> <span style="color:${color}">${z.type}</span></p>
                <p><strong>Est. AQI:</strong> ${z.aqi}</p>
                <p>${z.desc}</p>
            `);
    });

    const route = [[28.61, 77.2], [27.17, 78.04], [26.85, 80.95]];
    L.polyline(route, { color: '#ff1744', weight: 3, dashArray: '5, 10' }).addTo(map)
        .bindPopup("Major Freight Corridor: High Diesel PM2.5");
}

// ===== Predictive Maintenance =====
const maintenanceForm = document.getElementById('maintenanceForm');
const maintenanceResult = document.getElementById('maintenanceResult');

if (maintenanceForm) {
    maintenanceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const odo = parseInt(document.getElementById('odometer').value);
        const lastDate = new Date(document.getElementById('lastServiceDates').value);

        if (!odo || !lastDate.getTime()) return;

        const now = new Date();
        const daysSinceService = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
        const alerts = [];

        if (daysSinceService > 180 || (odo % 10000 >= 9000 || odo % 10000 < 1000)) {
            alerts.push({ type: 'warning', icon: '🛢️', msg: 'Engine Oil & Filter change due. Old oil increases friction and CO2 emissions.' });
        } else {
            alerts.push({ type: 'ok', icon: '✅', msg: `General Service: OK — Done ${Math.floor(daysSinceService / 30)} month(s) ago` });
        }

        if (odo > 50000 && odo % 50000 < 2000) {
            alerts.push({ type: 'warning', icon: '🔄', msg: 'Tire Replacement Recommended. Worn tires increase PM2.5 non-exhaust emissions.' });
        }

        if (odo > 80000 && odo % 80000 < 3000) {
            alerts.push({ type: 'critical', icon: '��', msg: 'Catalytic Converter/DPF inspection required! Failure causes severe NOx & PM pollution.' });
        }

        if (odo > 30000 && odo % 30000 < 1500) {
            alerts.push({ type: 'warning', icon: '🛑', msg: 'Brake pad inspection. Worn brake pads generate toxic metallic particulate matter.' });
        }

        maintenanceResult.innerHTML = '';
        alerts.forEach(alert => {
            const div = document.createElement('div');
            div.className = `alert-item ${alert.type}`;
            div.innerHTML = `
                <span class="alert-icon">${alert.icon}</span>
                <span>${alert.msg}</span>
            `;
            maintenanceResult.appendChild(div);
        });

        maintenanceResult.classList.remove('hidden');
    });
}

// ===== Indian Motor Vehicle Policies =====
const policies = [
    { title: 'FAME II — Electric Vehicle Subsidy', desc: 'Up to ₹1.5 Lakh subsidy on purchase of 4-W EVs to promote zero-tailpipe emission mobility.', tags: ['EV', 'Incentive'], ministry: 'Heavy Industries', year: '2019–24' },
    { title: 'Vehicle Scrappage Policy', desc: 'Mandatory fitness tests. Commercial vehicles over 15 yrs and passenger over 20 yrs scrapped if unfit. High incentives for scrapping old polluting cars.', tags: ['Scrappage', 'Emission'], ministry: 'MoRTH', year: '2021 onwards' },
    { title: 'BS-VI Emission Norms Ramp-Up', desc: 'Mandatory DPF and SCR for diesels. Slashes NOx by 68% and PM by 82% compared to BS-IV.', tags: ['BS6', 'Regulation'], ministry: 'MoEFCC', year: '2020/2023' },
    { title: 'Green Tax', desc: 'Additional tax (10-25% of road tax) on older vehicles at renewal of registration to deter use of highly polluting legacy vehicles.', tags: ['Tax', 'Regulation'], ministry: 'MoRTH', year: 'Ongoing' },
    { title: 'Delhi EV Policy', desc: 'Road tax exemptions, waiver of registration fees, and up to ₹30,000 extra incentive for 2W/3W to hit 25% EV adoption.', tags: ['EV', 'State Policy'], ministry: 'Govt NCT Delhi', year: '2020–24' },
    { title: 'CBG / CNG Network Expansion', desc: 'Investment in 5,000 CBG plants and expanding CNG highway networks to substitute diesel in heavy transport.', tags: ['CNG', 'Infrastructure'], ministry: 'MoPNG', year: '2023–25' }
];

const policiesGrid = document.getElementById('policiesGrid');
const policySearch = document.getElementById('policySearch');
const filterTags = document.querySelectorAll('.filter-tag');
let activeFilter = '';

function renderPolicies(searchText = '', filterParam = '') {
    if (!policiesGrid) return;
    policiesGrid.innerHTML = '';

    const term = searchText.toLowerCase();

    const filtered = policies.filter(p => {
        const matchText = p.title.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term);
        const matchFilter = filterParam === '' || p.tags.includes(filterParam) || p.year.includes(filterParam);
        return matchText && matchFilter;
    });

    if (filtered.length === 0) {
        policiesGrid.innerHTML = `<p style="color:var(--text-muted); grid-column:1/-1; text-align:center;">No policies found matching your criteria.</p>`;
        return;
    }

    filtered.forEach(p => {
        const tgs = p.tags.map(t => `<span class="policy-tag">${t}</span>`).join('');
        policiesGrid.innerHTML += `
            <div class="policy-card">
                <h3>${p.title}</h3>
                <p>${p.desc}</p>
                <div class="policy-meta">${tgs}</div>
                <div class="policy-info">
                    <strong>Ministry:</strong> ${p.ministry} • <strong>Year:</strong> ${p.year}
                </div>
            </div>
        `;
    });
}

if (policySearch) {
    policySearch.addEventListener('input', (e) => renderPolicies(e.target.value, activeFilter));
}

filterTags.forEach(btn => {
    btn.addEventListener('click', () => {
        filterTags.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter');
        renderPolicies(policySearch ? policySearch.value : '', activeFilter);
    });
});

// ===== Initialize =====
window.addEventListener('load', () => {
    renderHistory();
    renderPolicies();
});

