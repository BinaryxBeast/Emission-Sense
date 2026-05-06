# 🌿 Emission-Sense — Project Documentation

> **ASEP Group 11 | Vehicle Emission Analysis Project**
> Standards: IPCC / COPERT / EMEP-EEA / CPCB India

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [How It Works — End-to-End Flow](#4-how-it-works--end-to-end-flow)
5. [Core Modules](#5-core-modules)
   - [Emission Calculation Engine (`lib/calculation.ts`)](#51-emission-calculation-engine)
   - [Emission Utilities (`lib/emissions.ts`)](#52-emission-utilities)
   - [Utility Functions (`lib/utils.ts`)](#53-utility-functions)
6. [API Routes](#6-api-routes)
   - [Vehicle Extraction (`/api/extract-vehicle`)](#61-vehicle-extraction)
   - [Recommendations Generator (`/api/generate-recommendations`)](#62-recommendations-generator)
   - [Fuel Price API (`/api/fuel-price`)](#63-fuel-price-api)
   - [Email Subscription (`/api/subscribe`)](#64-email-subscription)
7. [Frontend Components](#7-frontend-components)
   - [EmissionCalculator (Main Component)](#71-emissioncalculator-main-component)
   - [PollutionContext (Global Theme)](#72-pollutioncontext-global-theme)
   - [EmailReminders](#73-emailreminders)
   - [GoogleTranslate](#74-googletranslate)
8. [The Science — Emission Calculation Methodology](#8-the-science--emission-calculation-methodology)
9. [Indian Regulatory Compliance](#9-indian-regulatory-compliance)
10. [Environment Variables](#10-environment-variables)
11. [Running the Project](#11-running-the-project)
12. [Data Flow Diagram](#12-data-flow-diagram)

---

## 1. Project Overview

**Emission-Sense** is a scientifically accurate, AI-powered vehicle emission calculator built specifically for the Indian automotive context. It allows users to:

- **Search** for any Indian vehicle (car, SUV, 2-wheeler, bus, truck) by make, model, and year
- **Calculate** daily multi-pollutant emissions — CO₂, NOx, PM2.5, CO, and HC
- **Analyse** the impact of driving conditions (traffic, AC usage, load), vehicle age, and maintenance history
- **Receive** AI-generated eco-driving recommendations tailored to their vehicle and habits
- **Get** an email report with their results, maintenance score, and next service dates

The application is built for academic and public use, referenced to global emission methodologies including **IPCC**, **COPERT**, and **EMEP-EEA**, mapped to India's **Bharat Stage (BS)** emission norms.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | TypeScript 5 |
| **UI** | React 19 with Vanilla CSS (custom design system) |
| **AI / LLM** | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| **Email** | Nodemailer |
| **Mapping** | Leaflet.js (CDN) |
| **Scheduling** | node-cron (reminder service) |
| **Image Search** | `googlethis` npm package |
| **Web Search** | `duck-duck-scrape` |
| **Icons** | Google Material Symbols Rounded (CDN) |
| **Fonts** | Google Fonts — Google Sans, Roboto |
| **Deployment** | Vercel |

---

## 3. Project Structure

```
asep_project/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, metadata, Providers)
│   ├── page.tsx                  # Home page (renders EmissionCalculator)
│   ├── globals.css               # Entire design system (CSS variables, animations)
│   └── api/
│       ├── extract-vehicle/      # POST — AI vehicle recognition
│       │   └── route.ts
│       ├── generate-recommendations/ # POST — AI eco-tips generation
│       │   └── route.ts
│       ├── fuel-price/           # GET — Live India fuel prices
│       │   └── route.ts
│       └── subscribe/            # POST — Email report delivery
│           └── route.ts
│
├── components/
│   ├── EmissionCalculator.tsx    # 🔑 Main 4-step wizard + results dashboard (98KB)
│   ├── EmailReminders.tsx        # Email subscription widget
│   ├── PollutionContext.tsx      # Global React context for dynamic theme
│   ├── GoogleTranslate.tsx       # Google Translate widget integration
│   ├── Header.tsx                # App header
│   ├── Footer.tsx                # App footer
│   ├── Navbar.tsx                # Navigation bar
│   └── MatIcon.tsx               # Material Icons wrapper component
│
├── lib/
│   ├── calculation.ts            # 🔑 Core emission calculation engine (469 lines)
│   ├── emissions.ts              # Emission factors, multipliers, EV grid CO2
│   └── utils.ts                  # Date/IST utility functions
│
├── data/                         # Static datasets (if any)
├── research/                     # Research documentation, methodology notes
├── scripts/
│   └── reminder-service.mjs      # node-cron background email scheduler
├── public/                       # Static assets
├── .env.local                    # API keys (Gemini, email credentials)
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

---

## 4. How It Works — End-to-End Flow

Here is the complete user journey from search to results:

```
User types vehicle name
        │
        ▼
[ Step 1: Vehicle Search ]
  → POST /api/extract-vehicle
  → Gemini 2.5 Flash identifies vehicle specs (BS norm, fuel type, engine CC, etc.)
  → googlethis fetches a real vehicle image
  → Specs shown to user with confidence score
  → User confirms or manually corrects
        │
        ▼
[ Step 2: Driving Pattern ]
  → User enters daily distance (km)
  → City/Highway split (slider)
  → Traffic Intensity (Low/Medium/High)
  → AC Usage (None/Moderate/Heavy)
  → Live CO₂ preview updates in real-time
        │
        ▼
[ Step 3: Vehicle Condition ]
  → Maintenance level (Good/Average/Poor)
  → Passenger load (Light/Moderate/Heavy)
  → Vehicle age (years)
        │
        ▼
[ Step 4: Service & Health (Optional) ]
  → Last oil change date (DD/MM/YYYY)
  → Last air filter date
  → Last PUC (Pollution Under Control) check date
  → Engine condition (Good/Average/Poor)
  → Exhaust smoke level (None/Low/High)
  → Mileage efficiency drop (Original km/l vs Current km/l)
        │
        ▼
[ Calculate Button Pressed ]
  → calculateEmissions() runs entirely client-side (lib/calculation.ts)
  → 9-step computation pipeline executes
  → Results displayed in dashboard
        │
        ▼
[ Parallel: AI Recommendations ]
  → POST /api/generate-recommendations
  → Gemini 2.5 Flash generates 3 personalized eco-tips
  → Tips displayed in results section
        │
        ▼
[ Email Report (Optional) ]
  → User enters email
  → POST /api/subscribe
  → Nodemailer sends HTML report with results, score, and service dates
```

---

## 5. Core Modules

### 5.1 Emission Calculation Engine

**File:** `lib/calculation.ts`

This is the heart of the application. It implements a **9-step multi-factor emission pipeline** that runs entirely in the browser (client-side TypeScript). No server round-trip is needed for the calculation.

#### Input Interface

```typescript
interface CalculationInput {
    vType: '2wheeler' | 'car' | 'suv' | 'bus' | 'truck';
    fType: 'petrol' | 'diesel' | 'cng' | 'hybrid' | 'ev';
    eStd: 'bs2' | 'bs3' | 'bs4' | 'bs6';
    eSize: 'small' | 'medium' | 'large';
    dTot: number;         // Total daily distance in km
    cityPct: number;      // % of driving in city
    age: number;          // Vehicle age in years
    maint: 'good' | 'average' | 'poor';

    // Advanced (from AI extraction)
    engineCC?: number;
    turbocharged?: boolean;
    fuelInjection?: string;  // 'MPFI' | 'GDI' | 'CRDi' | etc.
    transmission?: string;
    fuelEfficiencyKmpl?: number;
    kerbWeightKg?: number;

    // Driving conditions
    loadFactor?: number;     // 1, 1.5, or 2.0
    acUsage?: 'None' | 'Moderate' | 'Heavy';
    trafficIntensity?: 'Low' | 'Medium' | 'High';

    // Service & Health
    lastServiceDate?: string;
    lastOilChangeDate?: string;
    lastAirFilterDate?: string;
    lastPucDate?: string;
    engineCondition?: 'good' | 'average' | 'poor';
    originalKmpl?: number;
    currentKmpl?: number;
    smokeLevel?: 'none' | 'low' | 'high';
    engineNoise?: 'normal' | 'rough';
}
```

#### The 9-Step Calculation Pipeline

**Step 1 — Age Deterioration**
- Estimates total mileage from `age × dTot × 365`
- Toxic pollutants (NOx, PM2.5, CO, HC) can deteriorate up to **2.2×** at >240,000 km
- CO₂ caps at only **+5%** (fuel efficiency degradation is mild)

**Step 2 — Maintenance Factor (Gross Emitters)**
- `Good`: all multipliers = 1.0
- `Average`: NOx ×1.2, CO ×1.5, PM2.5 ×1.5, HC ×1.5, CO₂ ×1.05
- `Poor` (Gross Emitter): NOx ×3.0, CO ×4.0, PM2.5 ×8.0, HC ×5.0, CO₂ ×1.15

**Step 3 — Driving Conditions**
- AC Heavy → +15% CO₂, +25% NOx
- High Traffic (stop-and-go) → +20% CO₂, +40% NOx, +50% CO, +30% PM2.5
- Load Factor → each extra unit adds ~10% CO₂ and ~15% NOx

**Step 4 — Engine Technology Multipliers**
- Turbocharged → -5% CO₂ but +10% NOx, +15% PM2.5
- GDI fuel injection → +50% PM2.5 (vs MPFI)
- Automatic/AMT transmission → +5% CO₂; CVT → -2% CO₂

**Step 5 — Weight Penalty (CO₂ only)**
- Vehicles over 1,500 kg kerb weight incur **4% per 100 kg** extra in city, **3%** on highway

**Step 6 — COPERT Cold-Start Phase**
- Each trip's first 1.5 km is the "cold phase"
- Assumes 2 trips/day
- Cold-start multipliers for petrol/CNG:
  - CO₂: ×1.20, NOx: ×1.80, PM2.5: ×2.50, CO: ×6.00, HC: ×5.00
- Diesel cold-start is worse for NOx and PM2.5

**Step 7 — Non-Exhaust PM2.5 (Tyre & Brake Wear)**
- Based on EMEP/EEA 2023 Guidebook
- Car: tyre = 8 mg/km, brake = 5 mg/km
- EV: brake wear reduced by 10% (regenerative braking)
- These add directly to total PM2.5 even for EVs

**Step 8 — Evaporative HC Emissions**
- Petrol/Hybrid: `HC_evap = (dTot × 0.05) + (1.5 × 2 trips)`
- CNG: 10% of the petrol evaporative amount
- Diesel and EV: 0

**Step 9 — Service & Condition Multipliers**
- Overdue oil change → +5% CO per overdue month (max +30%), +2% CO₂/month (max +10%)
- Overdue air filter → +3% CO₂ per 90-day interval (max +15%)
- Expired PUC (>180 days) → +10% CO, +7% HC; severely expired (>270 days) → +20% CO, +15% HC
- Mileage efficiency drop → added directly to CO₂ multiplier
- Engine noise rough → +15% NOx
- Smoke level: low → ×1.3 PM2.5, high → ×2.2 PM2.5

#### Output

```typescript
{
    total: { CO2: kg, NOx: g, PM25: g, CO: g, HC: g },
    e_hot, e_cold, e_non_exhaust, e_evap,  // Breakdown by source
    d_city, d_hwy, d_cold_total,           // Distance splits
    adjEF,                                  // Adjusted emission factors
    fType,                                  // Fuel type
    serviceMultipliers: { co_mult, hc_mult, co2_mult, nox_mult, pm25_mult }
}
```

---

### 5.2 Emission Utilities

**File:** `lib/emissions.ts`

Contains the scientific constants and helper functions used by `calculation.ts`.

| Function/Constant | Purpose |
|---|---|
| `FUEL_CO2_FACTORS` | CO₂ per litre/kg: Petrol=2.30 kg/L, Diesel=2.6533 kg/L, CNG=2.75 kg/kg, India Grid=0.727 kg/kWh |
| `EV_EFFICIENCY_KWH_PER_KM` | Energy consumption per vehicle type (e.g., car=0.15 kWh/km) |
| `calculateEVGridCO2()` | Upstream CO₂ from India's electricity grid for EVs (CEA Dec 2024 data) |
| `getAgeDeteriorationFactor()` | Mileage-based toxics deterioration (1.0 → 2.2) |
| `getAgeDeteriorationFactorCO2()` | CO₂-specific deterioration (1.0 → 1.05 cap) |
| `estimateMileage()` | `age × dTot × 365` |
| `MAINTENANCE_MULTIPLIERS` | Per-pollutant multipliers for good/average/poor maintenance |
| `getDrivingConditionMultipliers()` | AC + traffic + load multipliers |
| `getTechMultipliers()` | Turbo + injection type + transmission multipliers |
| `getNonExhaustMultipliers()` | Tyre type and brake type PM2.5 adjustments |

---

### 5.3 Utility Functions

**File:** `lib/utils.ts`

| Function | Purpose |
|---|---|
| `getISTTodayString()` | Returns today's date in `YYYY-MM-DD` format using `Asia/Kolkata` timezone |
| `parseDate()` | Parses `DD/MM/YYYY` or `YYYY-MM-DD` strings into JS `Date` objects |
| `calculateDaysSince()` | Returns number of days between a given date and today (IST) |
| `formatIndianDate()` | Formats a date string to Indian locale (e.g., "06 May 2026") |

---

## 6. API Routes

All API routes live under `app/api/` and use Next.js App Router conventions (`route.ts` files with named HTTP method exports).

### 6.1 Vehicle Extraction

**`POST /api/extract-vehicle`**

Uses **Google Gemini 2.5 Flash** to identify a vehicle from a natural-language search query and returns structured technical specs.

**How it works:**
1. Receives a `query` string (e.g., "2021 Maruti Swift Petrol VXi")
2. Sends a carefully crafted prompt to Gemini asking it to act as an "Indian Automotive Specification Engine"
3. Gemini returns a JSON object with: name, year, vehicle category, fuel type, BS emission standard, engine CC, cylinders, turbo, fuel injection type, transmission, ARAI-certified fuel efficiency, kerb weight, variant, image keyword, confidence score
4. The route then calls `googlethis.image()` to search Google Images and find a real vehicle photo (prioritizing carwale.com, cardekho.com, zigwheels.com, etc.)
5. Falls back to `loremflickr.com` if no image found
6. Validates and returns the structured `responsePayload`

**Rate-limit handling:** Rotates through up to 5 Gemini API keys. Returns HTTP 429 with `retryAfter` seconds if all keys are exhausted.

---

### 6.2 Recommendations Generator

**`POST /api/generate-recommendations`**

Generates 3 personalized eco-driving tips using **Google Gemini 2.5 Flash**.

**Receives:**
- Vehicle identity (name, fuel type, BS standard, engine size, age)
- Driving logistics (daily distance, city/highway %, traffic, AC usage, load)
- Maintenance state (last service date, mileage efficiency drop)
- Calculated emission results (CO₂, PM2.5, NOx)
- Computed maintenance score (0-100) and emission rating

**Prompt design:**
- Persona: "Eco-Driving Buddy" — friendly, conversational, car-savvy
- Instructions to avoid repetition, personalize based on data, and use 45-word descriptions
- Outputs: JSON array of `{ title, description }` objects

**Output example:**
```json
[
  {
    "title": "Your AC is Costing You More Than You Think",
    "description": "Since you've got 'Heavy AC' usage with mostly city driving, you're adding ~15% to your CO₂. Try pre-cooling while the car's plugged in, or set it to 24°C — your Swift will thank you!"
  }
]
```

---

### 6.3 Fuel Price API

**`GET /api/fuel-price`**

Returns current Indian national average fuel prices. These are hardcoded approximates (as of March 2026) and served with a 1-hour CDN cache.

```json
{
  "petrol": 96,
  "diesel": 89,
  "cng": 79,
  "hybrid": 96,
  "ev": 8
}
```

Units: ₹/litre for petrol/diesel/hybrid, ₹/kg for CNG, ₹/kWh for EV.

---

### 6.4 Email Subscription

**`POST /api/subscribe`**

Accepts the user's email along with full vehicle data and sends a richly formatted HTML report using **Nodemailer**. The email includes:
- Vehicle name and image
- Full emission results
- Maintenance score (gauge)
- AI-generated recommendations
- Next 3 scheduled service dates

A background reminder service (`scripts/reminder-service.mjs`) uses **node-cron** to schedule follow-up service reminders.

---

## 7. Frontend Components

### 7.1 EmissionCalculator (Main Component)

**File:** `components/EmissionCalculator.tsx` — The largest file at ~98KB / 1,324 lines.

This is a **4-step wizard** that manages the entire user experience.

#### State Management

| State | Purpose |
|---|---|
| `step` | Current wizard step (1–4) |
| `inputs` | All `CalculationInput` values, updated via `updateInput()` |
| `extractedVehicle` | Vehicle data returned by Gemini AI |
| `results` | Output of `calculateEmissions()` |
| `recommendations` | AI tips from `/api/generate-recommendations` |
| `fuelPrices` | Live prices from `/api/fuel-price` |
| `livePreview` | Real-time CO₂ preview shown during input steps |
| `history` | Last 5 calculations stored in `localStorage` |

#### Sub-Components

| Component | Description |
|---|---|
| `IconCardGroup` | Reusable grid of selectable icon cards (used for traffic, AC, maintenance, load) |
| `ConfidenceRing` | SVG ring showing AI confidence % (green >85, amber >60, red below) |
| `ScoreGauge` | Animated SVG gauge showing maintenance score (0–100) |
| `OverdueBadge` | Shows how many days overdue a service is, with emission penalty badges |

#### The Results Dashboard

After calculation, the component renders:
1. **Rating badge** (Low / Moderate / High / Critical) based on `CO₂/5 + PM2.5/0.5` score
2. **Emission cards** — one each for CO₂ (kg), NOx (g), PM2.5 (g), CO (g), HC (g)
3. **Emission breakdown** — hot-running, cold-start, non-exhaust, evaporative
4. **Transparency panel** — shows all adjustment factors applied
5. **Maintenance score gauge** with a 0–100 score computed from service dates + engine health
6. **AI recommendations** — 3 personalized cards from Gemini
7. **Calculation history** — last 5 results from `localStorage`
8. **Policy Analysis** — comparison against Indian traffic and emission laws
9. **Email report widget** — `EmailReminders` component

---

### 7.2 PollutionContext (Global Theme)

**File:** `components/PollutionContext.tsx`

A React Context that dynamically changes the app's visual theme based on the calculated emission level.

```
none     → default dark theme
low      → green ambient glow
moderate → amber/yellow glow
high     → orange glow
critical → red glow
```

This works by adding a `theme-{level}` class to `<html>`, which CSS in `globals.css` responds to via `:root.theme-high { --pollution-orb-color: ... }`. The "ambient pollution orb" in `page.tsx` visually pulses based on this theme.

---

### 7.3 EmailReminders

**File:** `components/EmailReminders.tsx`

A polished UI widget that:
- Shows upcoming next service dates as colored date chips
- Provides an email input form
- Calls `POST /api/subscribe` with full vehicle and emission data
- Shows a success confirmation after sending

---

### 7.4 GoogleTranslate

**File:** `components/GoogleTranslate.tsx`

Integrates the Google Translate widget into the page, enabling users to translate the entire UI into their regional language (Hindi, Tamil, etc.).

---

## 8. The Science — Emission Calculation Methodology

Emission-Sense references international standards and calibrates them for India:

| Standard | Usage |
|---|---|
| **COPERT** (Computer Programme to Calculate Emissions from Road Transport) | Core hot-running emission factors, cold-start methodology |
| **EMEP/EEA 2023 Guidebook** | Non-exhaust PM2.5 (tyre and brake wear) |
| **IPCC AR6** | CO₂ global warming potential reference |
| **CPCB India / ARAI** | BS2–BS6 emission factor calibration |
| **CEA (Central Electricity Authority) Dec 2024** | India grid emission factor: **0.727 kg CO₂/kWh** |
| **CMVR (Central Motor Vehicles Rules)** | PUC validity period: 180 days |
| **SIAM India standards** | Oil change intervals: petrol 90 days / ~5,000 km |

### Emission Factor Database (EF_DB)

The `EF_DB` object in `calculation.ts` is a 3-level lookup table:
```
EF_DB[vehicleType][fuelType][bsStandard] → { city, hwy } → { CO2, NOx, PM25, CO, HC }
```

Units:
- CO₂: `g/km` (converted to `kg` at the end)
- NOx, PM2.5, CO, HC: `g/km`

Example for a BS6 petrol car (city): CO₂ = 150 g/km, NOx = 0.12 g/km, PM2.5 = 0.01 g/km

### EV Emissions

EVs produce **zero tailpipe emissions** (EF_DB entries are all 0), but the application calculates:
- **Upstream grid CO₂** using India's grid intensity (0.727 kg/kWh, CEA 2024)
- **Non-exhaust PM2.5** from tyre and brake wear (with 10% brake wear reduction for regenerative braking)

---

## 9. Indian Regulatory Compliance

The application checks vehicles against these Indian standards:

| Parameter | Standard | Threshold |
|---|---|---|
| Oil Change | SIAM (petrol) | Every 90 days / ~5,000 km |
| Air Filter | BS-VI Recommendation | Every 365 days / ~15,000 km |
| PUC Certificate | CMVR | Every 180 days (mandatory) |
| Emission Norms | BS2 → BS6 | April 2020+ requires BS6 |

The **Policy Analysis** feature in results evaluates the vehicle's profile against Indian Motor Vehicles Act provisions and emission norms, flagging potential legal or compliance concerns.

---

## 10. Environment Variables

Stored in `.env.local`:

```env
# Gemini API Keys (multiple for rate-limit rotation)
GEMINI_API_KEY=...
GEMINI_API_KEY_V3=...
GEMINI_API_KEY_SEARCH_1=...
GEMINI_API_KEY_SEARCH_2=...
GEMINI_API_KEY_SEARCH_3=...
GEMINI_API_KEY_REC_1=...
GEMINI_API_KEY_REC_2=...
GEMINI_API_KEY_REC_3=...

# Email (for Nodemailer)
EMAIL_USER=...
EMAIL_PASS=...
EMAIL_FROM=...
```

The application uses a **key rotation** strategy — it tries each key in order and moves to the next if a `429 Rate Limit` error occurs. This avoids disruption for users during high traffic periods.

---

## 11. Running the Project

### Prerequisites
- Node.js 18+
- A `.env.local` file with API keys

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```
Opens at `http://localhost:3000`

### Run with email reminder service
```bash
npm run dev:all
```
This runs both Next.js and the `node-cron` reminder service concurrently.

### Build for production
```bash
npm run build
npm run start
```

---

## 12. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                              │
│                                                                      │
│  User Input ──► EmissionCalculator.tsx                               │
│                    │                                                 │
│                    ├─► Vehicle Search ──────────────────────────────►│
│                    │                                                 │
│                    ├─► [Real-time Preview] ◄── calculateEmissions()  │
│                    │        (lib/calculation.ts — runs in browser)   │
│                    │                                                 │
│                    └─► [Submit] ──► calculateEmissions() ────────────│
│                                         ▼                            │
│                               Results Dashboard                      │
└────────────────────────────────────────┬────────────────────────────┘
                                         │
             ┌───────────────────────────▼─────────────────────────┐
             │                  SERVER (Next.js API)                │
             │                                                      │
             │  /api/extract-vehicle ─► Gemini 2.5 Flash           │
             │                       ─► googlethis (Image Search)  │
             │                                                      │
             │  /api/generate-recommendations ─► Gemini 2.5 Flash  │
             │                                                      │
             │  /api/fuel-price ──────► Static ₹ rates (cached)   │
             │                                                      │
             │  /api/subscribe ───────► Nodemailer (Email)         │
             └─────────────────────────────────────────────────────┘

             ┌──────────────────────────────────────────────────────┐
             │              lib/calculation.ts                      │
             │                                                      │
             │  EF_DB lookup → Age → Maintenance → Driving          │
             │  → Tech → Weight → Hot-run → Cold-start             │
             │  → Non-exhaust PM2.5 → Evaporative HC → Service     │
             │  → Total emissions (CO₂ kg, NOx g, PM2.5 g, ...)    │
             └──────────────────────────────────────────────────────┘
```

---

*Documentation generated for ASEP Group 11 | Emission-Sense v0.1.0 | May 2026*
