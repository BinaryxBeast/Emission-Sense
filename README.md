# 🌿 Emission-Sense

> **An India-specific, research-grade multi-pollutant road transport emission estimation platform.**

[![Next.js](https://img.shields.io/badge/Next.js-16.x-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-integrated-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Emission Model](#-emission-model)
- [Project Structure](#-project-structure)
- [Important Files](#-important-files)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Research & Methodology](#-research--methodology)
- [Contributing](#-contributing)

---

## 🔍 Overview

**Emission-Sense** is a scientifically rigorous web application that estimates real-world vehicle pollution for Indian road transport. It moves well beyond simplified calculators by applying a **nine-stage multiplicative emission model** grounded in:

- 🇮🇳 **Bharat Stage (BS-IV / BS-VI)** certified base emission factors
- 📊 **EMEP/EEA** non-exhaust and evaporative emission guidelines
- ⚗️ **COPERT** cold-start excess emission formulas
- ⚡ **CEA (Central Electricity Authority)** grid-based emission factors for EVs

The platform calculates daily mass estimates for **CO₂, NOₓ, PM₂.₅, CO, and HC**, and provides actionable AI-powered recommendations to help users reduce their carbon footprint.

---

## 🚀 Key Features

| Feature | Description |
|---|---|
| **Precision Emission Modeling** | 9-stage multiplicative model covering exhaust, non-exhaust, cold-start, and evaporative emissions |
| **AI-Powered Vehicle Extraction** | Parses unstructured text or image inputs into structured vehicle data using Google Generative AI |
| **Personalized Recommendations** | AI-generated, context-aware suggestions to reduce emissions and improve vehicle efficiency |
| **Fuel Price Lookup** | Fetches real-time or cached fuel prices relevant to the user's region |
| **Email Subscription & Reminders** | Users can subscribe to receive automated maintenance and PUC (Pollution Under Control) reminders |
| **Multilingual Support** | Google Translate integration for regional language accessibility |
| **Background Cron Service** | A dedicated Node.js service runs independently to dispatch scheduled email reminders |

---

## ⚗️ Emission Model

The core calculation pipeline applies **9 correction stages** to a certified base emission factor:

```
Final Emission = EF_base × k_age × k_maint × k_drive × k_tech × k_fuel
               + EF_cold_start + EF_non_exhaust + EF_evaporative
```

| Stage | Factor | Description |
|---|---|---|
| 1 | `EF_base` | BS-IV/BS-VI base emission factor (g/km) |
| 2 | `k_age` | Vehicle age degradation multiplier |
| 3 | `k_maint` | Maintenance condition penalty |
| 4 | `k_drive` | Driving pattern correction (city/highway/mixed) |
| 5 | `k_tech` | Engine technology factor |
| 6 | `k_fuel` | Fuel type correction |
| 7 | `EF_cold` | COPERT cold-start excess emissions |
| 8 | `EF_nonex` | EMEP/EEA non-exhaust PM (tyre, brake, road wear) |
| 9 | `EF_evap` | Evaporative HC emissions |

> 📄 Full methodology documented in [`research/emission_methodology_paper.md`](research/emission_methodology_paper.md)

---

## 📂 Project Structure

```
emission-sense/
├── app/                          # Next.js App Router root
│   ├── api/                      # Backend API route handlers
│   │   ├── extract-vehicle/      # AI vehicle data extraction
│   │   ├── generate-recommendations/ # AI-driven recommendations
│   │   ├── fuel-price/           # Fuel price lookup
│   │   └── subscribe/            # Email subscription handler
│   ├── globals.css               # Global application styles
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Application entry page
│
├── components/                   # Reusable React components
│   ├── EmissionCalculator.tsx    # Core calculator UI (main component)
│   ├── EmailReminders.tsx        # Subscription & reminder UI
│   ├── Navbar.tsx                # Navigation bar
│   ├── Header.tsx                # Page header
│   ├── Footer.tsx                # Page footer
│   ├── GoogleTranslate.tsx       # Language switcher
│   ├── MatIcon.tsx               # Material Icon wrapper
│   └── PollutionContext.tsx      # React context for pollution data
│
├── lib/                          # Core logic & data definitions
│   ├── calculation.ts            # 9-stage emission calculation engine
│   ├── emissions.ts              # Base emission factor database (EF_DB)
│   └── utils.ts                  # Shared utility functions
│
├── research/                     # Academic & technical documentation
│   ├── emission_methodology_paper.md  # Full research paper
│   └── algorithm_updates_v2.md       # Changelog of algorithm refinements
│
├── scripts/                      # Background services
│   └── reminder-service.mjs     # Node.js cron job for email reminders
│
├── data/                         # Static datasets (if any)
├── public/                       # Static assets (images, icons)
├── legacy/                       # Archived/deprecated code
│
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Project dependencies & scripts
└── .env.local                    # Environment variables (not committed)
```

---

## 📌 Important Files

### 🧮 Core Calculation Engine

| File | Purpose |
|---|---|
| [`lib/calculation.ts`](lib/calculation.ts) | **Primary emission calculation engine.** Contains the full 9-stage multiplicative model, applying all correction factors (age, maintenance, driving pattern, cold-start, non-exhaust, evaporative) to compute final emission values in g/km and g/day. |
| [`lib/emissions.ts`](lib/emissions.ts) | **Emission factor database.** Defines `EF_DB` — the structured lookup table of base emission factors for each pollutant, fuel type, and Bharat Stage standard (BS-IV/BS-VI). |
| [`lib/utils.ts`](lib/utils.ts) | **Utility library.** Shared helper functions used across the calculation pipeline and UI components. |

### 🖥️ Main UI Component

| File | Purpose |
|---|---|
| [`components/EmissionCalculator.tsx`](components/EmissionCalculator.tsx) | **Primary application component.** Houses the complete calculator UI — vehicle form inputs, results visualization, recommendation display, and state management. |
| [`components/EmailReminders.tsx`](components/EmailReminders.tsx) | Manages the email subscription form and reminder scheduling UI. |
| [`components/PollutionContext.tsx`](components/PollutionContext.tsx) | React Context provider that shares pollution data between components. |

### 🤖 AI & API Routes

| File | Purpose |
|---|---|
| [`app/api/extract-vehicle/route.ts`](app/api/extract-vehicle/route.ts) | **AI vehicle extraction endpoint.** Accepts unstructured text/image input and uses Google Generative AI (`gemini-*`) to extract structured vehicle specifications (make, model, year, fuel type, engine size, BS norm). |
| [`app/api/generate-recommendations/route.ts`](app/api/generate-recommendations/route.ts) | **AI recommendation endpoint.** Takes calculated emission data as input and returns personalized, actionable suggestions to reduce pollution and improve efficiency. |
| [`app/api/fuel-price/route.ts`](app/api/fuel-price/route.ts) | Fetches current fuel prices from an external source for use in cost-of-emissions calculations. |
| [`app/api/subscribe/route.ts`](app/api/subscribe/route.ts) | Handles user email subscriptions and stores data for the reminder cron service. |

### 📅 Background Services

| File | Purpose |
|---|---|
| [`scripts/reminder-service.mjs`](scripts/reminder-service.mjs) | **Standalone cron service.** Runs as a separate Node.js process (via `node-cron`) to periodically check and dispatch scheduled maintenance and PUC renewal reminder emails using `nodemailer`. |

### 📄 Research & Documentation

| File | Purpose |
|---|---|
| [`research/emission_methodology_paper.md`](research/emission_methodology_paper.md) | Comprehensive research paper covering the scientific basis of all emission models, mathematical formulas, references to EMEP/EEA and COPERT standards, and assumptions made in the India-specific implementation. |
| [`research/algorithm_updates_v2.md`](research/algorithm_updates_v2.md) | Technical changelog documenting the v2 algorithm refinements, parameter updates, and integration of new emission standards. |

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | Global CSS + CSS Modules |
| **Icons** | [Lucide React](https://lucide.dev/) + Material Icons |
| **AI / LLM** | [Google Generative AI (`@google/generative-ai`)](https://ai.google.dev/) |
| **Email** | [Nodemailer](https://nodemailer.com/) |
| **Cron Jobs** | [node-cron](https://github.com/node-cron/node-cron) |
| **Concurrency** | [concurrently](https://github.com/open-cli-tools/concurrently) |
| **Linting** | ESLint (Next.js config) |

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- A **Google Generative AI API Key** (for Gemini-based features)
- An **SMTP-compatible email account** (for reminder service)

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/BinaryxBeast/Emission-Sense.git
cd Emission-Sense
```

**2. Install dependencies:**
```bash
npm install
```

**3. Configure environment variables:**
```bash
cp .env.local.example .env.local
# Then edit .env.local with your credentials (see section below)
```

### Running the Application

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server only |
| `npm run reminders` | Start the background reminder cron service only |
| `npm run dev:all` | **Recommended** — Start both the frontend and reminder service concurrently |
| `npm run build` | Build the production bundle |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint checks |

```bash
# Start everything (recommended)
npm run dev:all
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Google Generative AI (Gemini)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# Email / SMTP Configuration (for reminder service)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
SMTP_FROM=your_email@gmail.com
```

> ⚠️ **Never commit `.env.local` to version control.** It is already included in `.gitignore`.

---

## 🌐 API Endpoints

All API routes are located under `app/api/` and follow the Next.js App Router convention.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/extract-vehicle` | Extract vehicle specs from text/image using Gemini AI |
| `POST` | `/api/generate-recommendations` | Generate AI-powered emission reduction recommendations |
| `GET` | `/api/fuel-price` | Fetch current fuel prices |
| `POST` | `/api/subscribe` | Register user for email reminders |

---

## 📚 Research & Methodology

The emission calculation methodology is fully documented and peer-reviewed in the research directory:

- 📄 **[Emission Methodology Paper](research/emission_methodology_paper.md)** — Full scientific paper with formulas, references, and India-specific adaptations.
- 📋 **[Algorithm Updates v2](research/algorithm_updates_v2.md)** — Changelog of the latest refinements, updated EMEP/EEA parameters, and COPERT integration notes.

**Primary Standards Referenced:**
- EMEP/EEA Air Pollutant Emission Inventory Guidebook (2019/2023)
- COPERT (Computer Programme to calculate Emissions from Road Transport)
- MoRTH / CPCB Bharat Stage emission norms (BS-IV, BS-VI)
- CEA Grid Emission Factor for India (for EV upstream emissions)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/your-feature-name`)
3. **Commit** your changes with a clear message (`git commit -m 'feat: add XYZ feature'`)
4. **Push** to your branch (`git push origin feature/your-feature-name`)
5. **Open a Pull Request** with a detailed description of changes

Please ensure all new emission model changes are backed by documented references and update the relevant files under `research/` accordingly.

---

<div align="center">

**Built with ❤️ to help India breathe cleaner air.**

</div>
