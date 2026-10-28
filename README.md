# SolarSight AI — Machine Learning-Based Solar Irradiance Estimation

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.6+-F7931E.svg?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)

An academic research prototype and professional solar analytics dashboard that estimates monthly mean daily **Global Horizontal Irradiance (GHI)** in `kWh/m²/day` using a trained **Random Forest** regression model and NASA POWER regional satellite meteorological data.

---

## ☀️ Project Overview

Accurate solar irradiance estimation is essential for solar farm site selection, rooftop photovoltaic sizing, and renewable grid integration. Because high-precision ground pyranometers are geographically sparse and capital-intensive, machine learning algorithms can learn complex non-linear relationships between satellite clear-sky irradiation, spatial coordinates, and seasonality.

### Key Capabilities
- **Trained Model Inference:** Real-time predictions powered by a serialized scikit-learn Random Forest model trained across 63 Indian locations (2001–2025).
- **Interactive Multi-Month Profile:** Batch simulation across all 12 calendar months to visualize seasonal irradiation curves.
- **Model Evaluation Benchmarking:** Comparative assessment against XGBoost, Multi-Layer Perceptron (Neural Network), and Linear Regression baselines.
- **Scientific Transparency:** Explicit units (`kWh/m²/day`), feature importance breakdown, and spatial holdout validation disclosure.

---

## 📊 Model Specifications & Evaluation

The saved Random Forest regressor utilizes 5 input features in exact sequence:
1. `YEAR` (Calendar Year)
2. `LAT` (Latitude in decimal degrees, -90° to 90°)
3. `LON` (Longitude in decimal degrees, -180° to 180°)
4. `MONTH_NUM` (Month index, 1–12)
5. `CLEARSKY` (Theoretical cloud-free GHI in kWh/m²/day)

**Target:** `GHI` (Monthly mean daily Global Horizontal Irradiance in `kWh/m²/day`).

### Initial Evaluation Benchmark (13 Held-Out Locations)

| Algorithm | MAE (kWh/m²/day) | RMSE (kWh/m²/day) | R² Score | Deployment Status |
| :--- | :---: | :---: | :---: | :---: |
| **Random Forest** | **0.1264** | **0.1762** | **0.9600** | **Deployed (Active)** |
| XGBoost | 0.1843 | 0.2493 | 0.9199 | Evaluated Benchmark |
| Neural Network (MLP) | 0.2272 | 0.3096 | 0.8765 | Evaluated Benchmark |
| Linear Regression | 0.5332 | 0.6519 | 0.4523 | Baseline |

> **Validation Note:** Evaluated on 13 held-out geographic locations with zero spatial overlap with the training set to prevent spatial autocorrelation leakage. These are initial test results, not guaranteed real-world performance.

---

## 📁 Repository Structure

```
Solar-Irradiance-Estimation/
├── backend/
│   ├── main.py                     # FastAPI application & prediction endpoints
│   ├── requirements.txt            # Python dependencies
│   ├── test_api.py                 # Pytest test suite
│   └── model/
│       ├── model_metadata.json     # Model attributes & test metrics
│       └── solar_irradiance_model.joblib # Trained Random Forest artifact (260 MB)
├── frontend/
│   ├── index.html                  # HTML entry point with Inter font
│   ├── package.json                # Frontend dependencies & scripts
│   ├── tsconfig.json               # TypeScript configuration
│   ├── vite.config.ts              # Vite + React + Tailwind v4 config
│   ├── vercel.json                 # Vercel SPA rewrite routing rules
│   └── src/
│       ├── App.tsx                 # Main application router
│       ├── index.css               # Tailwind CSS imports & theme definitions
│       ├── api/                    # Axios HTTP client & API query functions
│       ├── components/             # Reusable UI cards, forms & Recharts charts
│       ├── pages/                  # Landing, Predict, Performance, and About
│       └── types/                  # TypeScript interface definitions
├── .env.example                    # Environment variable template
├── .gitignore                      # Git ignore file (includes Git LFS notes)
└── README.md                       # Complete documentation
```

---

## 🚀 Quickstart: Running Locally

### Prerequisites
- **Python 3.10+** (Tested on Python 3.11, 3.12, 3.14)
- **Node.js 18+** and **pnpm** (or npm)
- **Git** with **Git LFS** (for large model file tracking)

---

### Step 1: Start the FastAPI Backend

Open a terminal window:

```bash
cd backend

# (Optional) Create and activate a virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be live at:
- **API URL:** `http://localhost:8000`
- **Interactive Swagger Docs:** `http://localhost:8000/docs`
- **Health Check:** `http://localhost:8000/api/health`

---

### Step 2: Start the React Frontend

Open a second terminal window:

```bash
cd frontend

# Install frontend dependencies
pnpm install
# (or: npm install)

# Start Vite development server
pnpm run dev
# (or: npm run dev)
```

The frontend will be available at:
- **Web App:** `http://localhost:5173`

---

## 🧪 Running Backend Automated Tests

To verify API endpoints, schema validation, and prediction outputs:

```bash
cd backend
python -m pytest test_api.py -v
```

All 9 test cases validate:
- Server health & model loading
- Model metadata & metric retrieval
- Valid prediction calculation & unit consistency
- Latitude out-of-range rejection (422)
- Month out-of-range rejection (422)
- Missing clearsky attribute rejection (422)
- Out-of-bounds year domain warning flag
- Multi-month batch predictions

---

## 🌐 Deployment Guide (Vercel & Cloud)

### Frontend Deployment on Vercel
1. Push your repository to GitHub.
2. In your [Vercel Dashboard](https://vercel.com), click **Add New > Project** and import `Solar-Irradiance-Estimation`.
3. Set the **Root Directory** to `frontend`.
4. Framework Preset: **Vite**.
5. Under **Environment Variables**, add:
   ```
   VITE_API_BASE_URL=https://your-backend-api-url.com
   ```
6. Click **Deploy**. Vercel will build the SPA using `vercel.json` for client-side routing.

### Backend Deployment (Render / Railway / AWS / Docker)
Because the Random Forest model is ~260 MB, it runs best on a containerized service or VM with at least 1 GB of RAM:
- **Render.com Web Service:**
  - Build command: `pip install -r backend/requirements.txt`
  - Start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- **Railway.app / Fly.io / AWS ECS:** Use the standard Python FastAPI configuration.

---

## 📜 Scientific Citation & Data Attribution

- **Meteorological Data:** NASA Prediction of Worldwide Energy Resources (POWER) Project, Langley Research Center.
- **Model Framework:** Scikit-learn Random Forest Regressor.
- **License:** MIT License. Academic and Educational Use.
