# RENEWCAST: Weather-Aware Adaptive Multi-Model Deep Learning System for Solar and Wind Energy Forecasting

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)]()

> **Industry Specialization Project (ISP)**  
> **Academic Session:** 2025–2026  
> **Faculty Guide:** Dr. P. Pandiselvam  
> **Project Team:**  
> - **T. Harish Narayan** (Reg-No: 99230041261)  
> - **O. Sai Chakradhar Reddy** (Reg-No: 99230041258)  
> - **T. Praneeth** (Reg-No: 99230040435)  

---

## 1. Project Overview

Renewable energy generation from solar photovoltaic (PV) arrays and wind turbines is subject to severe intermittent fluctuations driven by dynamic meteorological states. Traditional single-architecture statistical and machine learning models struggle to maintain reliable accuracy across shifting weather regimes (such as rapid cloud attenuation, storm squalls, or nocturnal wind gusts).

**RENEWCAST** is a production-grade, research-oriented deep learning forecasting platform that dynamically adapts its multi-model predictive consensus based on real-time atmospheric intelligence. The system aggregates predictions from **LSTM**, **GRU**, and **CNN-LSTM** networks via a **Weather-Aware Adaptive Fusion Layer**, producing high-confidence multi-horizon forecasts (**1H, 6H, 12H, 24H**) for solar, wind, and aggregated renewable power generation.

---

## 2. System Architecture

```
 Historical Solar & Wind Datasets (NREL PVDAQ / WIND Toolkit)
                             │
                             ▼
            Data Preprocessing & Validation Pipeline
     (Imputation, MinMaxScaler, Cyclical Sin/Cos Encoding, T=24)
                             │
                             ▼
              Time-Series Sequence Generation
                             │
             ┌───────────────┼───────────────┐
             ▼               ▼               ▼
        LSTM Model       GRU Model     CNN-LSTM Model
      (Long-Term Seq) (Efficient Gate)(Spatial-Temporal)
             │               │               │
             └───────────────┬───────────────┘
                             │
                             ▼
           Weather-Aware Adaptive Fusion Engine
       (Dynamic Condition-Weighted Convex Combination)
                             │
                             ▼
                 Multi-Horizon Predictions
          (Solar Forecast + Wind Forecast = Total MW)
                             │
                             ▼
               FastAPI Asynchronous REST APIs
                             │
                             ▼
          RENEWCAST Modern Web Platform (React + Recharts)
```

---

## 3. Key Features

- **Multi-Model Deep Learning Pipeline**:
  - **LSTM**: Dedicated long-term temporal dependencies and diurnal periodicity learning.
  - **GRU**: Efficient parameter-compact sequential gating for fast convergence.
  - **CNN-LSTM Hybrid**: 1D convolution filters capture localized weather ramp events and sudden gusts, followed by recurrent LSTM layers.
- **Adaptive Model Fusion**: Dynamically computes model weight vectors $\boldsymbol{\alpha} = [\alpha_{\text{LSTM}}, \alpha_{\text{GRU}}, \alpha_{\text{CNN}}]$ conditioned on real-time solar irradiance (W/m²), cloud cover volatility (%), wind velocity (km/h), and atmospheric density.
- **Meteorological Telemetry**: Direct integration with the Open-Meteo REST service for live ambient temperature, relative humidity, GHI solar irradiance, surface pressure, and hub-height wind speed.
- **Dataset Ingestion & Validation**: Ingestion interface supporting NREL PVDAQ solar data, NREL WIND Toolkit data, or custom CSV time-series files with automated missing-value imputation and feature detection.
- **Audit History & CSV Export**: Complete historical forecast tracking with search, horizon filtering, and structured CSV export capabilities.
- **Restrained Premium Aesthetic**: Crafted with a calm, research-grade design system inspired by coffee, paper, and renewable energy (#F7F4EF warm parchment, #25221F charcoal typography, and subtle sage and amber accents).

---

## 4. Technology Stack

### Frontend
- **React 19** with Vite 8
- **Recharts** (Custom time-series visualization with confidence intervals)
- **Lucide React** (Minimal iconography)
- **Custom CSS Design Tokens** (Zero bloated CSS frameworks, pure responsive typography and layout)

### Backend
- **Python 3.10+**
- **FastAPI** (Asynchronous REST API framework)
- **Uvicorn** (ASGI production web server)
- **Pydantic V2** (Strict schema serialization and validation)
- **HTTPX** (Asynchronous external HTTP requests)

### Machine Learning & Data Processing
- **NumPy & Pandas** (Vectorized time-series preprocessing and windowing)
- **Scikit-learn** (MinMax scaling, regression baselines, and evaluation metrics)
- **Custom Modular Deep Learning Implementations** (Zero-dependency neural architectures with exact mathematical formulations)

---

## 5. Machine Learning Formulations

### 1. Long Short-Term Memory (LSTM)
$$\begin{aligned}
f_t &= \sigma(W_f x_t + U_f h_{t-1} + b_f) \\
i_t &= \sigma(W_i x_t + U_i h_{t-1} + b_i) \\
\tilde{c}_t &= \tanh(W_c x_t + U_c h_{t-1} + b_c) \\
c_t &= f_t \odot c_{t-1} + i_t \odot \tilde{c}_t \\
o_t &= \sigma(W_o x_t + U_o h_{t-1} + b_o) \\
h_t &= o_t \odot \tanh(c_t)
\end{aligned}$$

### 2. Gated Recurrent Unit (GRU)
$$\begin{aligned}
r_t &= \sigma(W_r x_t + U_r h_{t-1} + b_r) \\
z_t &= \sigma(W_z x_t + U_z h_{t-1} + b_z) \\
\tilde{h}_t &= \tanh(W_h x_t + U_h (r_t \odot h_{t-1}) + b_h) \\
h_t &= (1 - z_t) \odot h_{t-1} + z_t \odot \tilde{h}_t
\end{aligned}$$

### 3. CNN-LSTM Hybrid
$$c_k(t) = \text{ReLU}\left(\sum_{j} \sum_{\tau=0}^{K-1} w_{k, j}(\tau) x_j(t + \tau) + b_k\right)$$
Localized spatial-temporal feature maps are extracted across sliding input windows, pooled, and subsequently routed through recurrent LSTM layers.

### 4. Adaptive Weather-Conditioned Fusion
$$\hat{y}_{\text{fused}}(t) = \sum_{m \in \{\text{LSTM}, \text{GRU}, \text{CNN}\}} \alpha_m(\mathbf{w}_t) \cdot \hat{y}_m(t)$$
$$\text{subject to} \quad \sum_m \alpha_m(\mathbf{w}_t) = 1, \quad \alpha_m \ge 0$$
where $\mathbf{w}_t = [\text{GHI}_t, \text{Cloud}_t, \text{WindSpeed}_t, \rho_t]$ represents the physical meteorological state vector.

---

## 6. Project Structure

```
ISP/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── endpoints/
│   │   │       ├── dataset.py        # CSV upload & preprocessing APIs
│   │   │       ├── forecast.py       # Multi-horizon forecast execution
│   │   │       ├── health.py         # System health status
│   │   │       ├── history.py        # Forecast audit logs & export
│   │   │       ├── models.py         # Model comparison & dynamic weights
│   │   │       └── weather.py        # Live weather telemetry & intelligence
│   │   ├── main.py                   # FastAPI application & router mounting
│   │   ├── schemas/
│   │   │   └── schemas.py            # Pydantic data transfer models
│   │   └── services/
│   │       ├── dataset_service.py    # Schema introspection & parsing
│   │       ├── forecast_service.py   # Multi-model prediction coordinator
│   │       └── weather_service.py    # Open-Meteo REST service integration
│   └── requirements.txt              # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdaptiveFusionVisualizer.jsx
│   │   │   ├── ForecastChart.jsx
│   │   │   ├── KpiCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── WeatherPanel.jsx
│   │   ├── pages/
│   │   │   ├── AboutPage.jsx
│   │   │   ├── AnalysisPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── DatasetPage.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── ModelComparisonPage.jsx
│   │   │   └── WeatherPage.jsx
│   │   ├── services/
│   │   │   └── api.js                # Frontend-backend communication
│   │   ├── App.jsx
│   │   ├── index.css                 # Coffee & Paper design system
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── ml/
│   ├── evaluation/
│   │   └── metrics.py                # MAE, RMSE, MAPE, R2 calculations
│   ├── fusion/
│   │   └── adaptive_fusion.py        # Dynamic weather-conditioned fusion
│   ├── models/
│   │   ├── base.py                   # BaseForecastModel abstract contract
│   │   ├── cnn_lstm.py               # 1D CNN + LSTM hybrid
│   │   ├── gru.py                    # Gated Recurrent Unit
│   │   └── lstm.py                   # Long Short-Term Memory
│   └── preprocessing/
│       └── pipeline.py               # Imputation, scaling, and sequence windowing
├── data/
│   └── sample/
│       ├── benchmark_metrics.json    # Standardized test split metrics
│       ├── combined_renewable_sample.csv
│       ├── generate_samples.py       # Physics-based sample generator
│       ├── nrel_solar_pvdaq_sample.csv
│       └── nrel_wind_toolkit_sample.csv
├── .env.example
└── README.md
```

---

## 7. Installation & Setup

### Prerequisites
- **Python**: Version 3.10 or higher
- **Node.js**: Version 18 or higher (v24 LTS recommended)
- **npm**: Version 9 or higher

### 1. Backend Setup
1. Open a terminal in the root directory:
   ```bash
   python -m pip install -r backend/requirements.txt
   ```
2. Verify sample dataset availability (automatically generated):
   ```bash
   python data/sample/generate_samples.py
   ```
3. Launch the FastAPI server:
   ```bash
   python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   Interactive Swagger documentation is available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup
1. In a new terminal window, navigate to the `frontend` folder:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:5173`.

---

## 8. REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service uptime and loaded model architectures |
| `POST` | `/api/forecast` | Generates multi-horizon solar, wind, and total forecasts |
| `POST` | `/api/predict` | Alternate alias for inference pipeline |
| `GET` | `/api/weather` | Real-time meteorological telemetry from Open-Meteo |
| `GET` | `/api/weather/intelligence`| Atmospheric physics and generation sensitivity analysis |
| `GET` | `/api/models` | List of supported deep learning architectures |
| `GET` | `/api/model-comparison` | Comparative evaluation metrics (MAE, RMSE, MAPE, R²) |
| `GET` | `/api/fusion-weights` | Current condition-adapted model weights $\boldsymbol{\alpha}$ |
| `GET` | `/api/dataset/list` | List available sample and uploaded datasets |
| `GET` | `/api/dataset/info` | Column schema, date range, and record inspection |
| `POST` | `/api/dataset/upload` | Ingest local CSV dataset for evaluation |
| `POST` | `/api/dataset/preprocess`| Execute cleaning, normalization, and windowing |
| `GET` | `/api/history` | Chronological forecast execution audit log |

---

## 9. Academic Project Credits

This project was developed for the **Industry Specialization Project (ISP)**:

- **T. Harish Narayan** — Registration No: `99230041261`
- **O. Sai Chakradhar Reddy** — Registration No: `99230041258`
- **T. Praneeth** — Registration No: `99230040435`

**Project Faculty Guide:**  
**Dr. P. Pandiselvam**  
Department of Computer Science and Engineering  
College of Engineering & Technology
