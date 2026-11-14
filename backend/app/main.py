"""
RENEWCAST Backend Application Entrypoint
FastAPI REST API Server for Weather-Aware Renewable Energy Forecasting System
"""

import os
import sys

# Ensure project root is in sys.path so ml and backend can be imported cleanly
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.endpoints import health, forecast, models, weather, dataset, history

app = FastAPI(
    title="RENEWCAST API",
    description="Weather-Aware Adaptive Multi-Model Deep Learning System for Solar and Wind Energy Forecasting",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration allowing local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers under /api
app.include_router(health.router, prefix="/api")
app.include_router(forecast.router, prefix="/api")
app.include_router(models.router, prefix="/api")
app.include_router(weather.router, prefix="/api")
app.include_router(dataset.router, prefix="/api")
app.include_router(history.router, prefix="/api")

@app.get("/")
async def root():
    return {
        "system": "RENEWCAST",
        "description": "Weather-Aware Adaptive Multi-Model Deep Learning System for Solar and Wind Energy Forecasting",
        "documentation": "/docs",
        "status": "online"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
