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

from fastapi import FastAPI, Request

app = FastAPI(
    title="RENEWCAST API",
    description="Weather-Aware Adaptive Multi-Model Deep Learning System for Solar and Wind Energy Forecasting",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

@app.middleware("http")
async def log_incoming_requests(request: Request, call_next):
    print(f"[RENEWCAST VERCEL LOG] {request.method} {request.url.path}")
    return await call_next(request)

# CORS configuration allowing local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers under both /api and root (to seamlessly support local dev and Vercel serverless rewrites)
api_routers = [health.router, forecast.router, models.router, weather.router, dataset.router, history.router]
for r in api_routers:
    app.include_router(r, prefix="/api")
    app.include_router(r)

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
