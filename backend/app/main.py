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

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.app.api.endpoints import health, forecast, models, weather, dataset, history

app = FastAPI(
    title="RENEWCAST API",
    description="Weather-Aware Adaptive Multi-Model Deep Learning System for Solar and Wind Energy Forecasting",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

@app.exception_handler(404)
async def custom_404(request: Request, exc):
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=404,
        content={
            "detail": "Not Found",
            "received_path": request.url.path,
            "scope_path": request.scope.get("path"),
            "root_path": request.scope.get("root_path")
        }
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

@app.get("/api")
async def api_root():
    return {
        "system": "RENEWCAST API",
        "description": "Weather-Aware Adaptive Multi-Model Deep Learning System for Solar and Wind Energy Forecasting",
        "documentation": "/docs",
        "status": "online"
    }

# Check for built frontend distribution directory (local build or Vercel includeFiles)
candidate_dirs = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")),
    os.path.abspath(os.path.join(os.getcwd(), "frontend", "dist")),
    os.path.abspath(os.path.join(os.getcwd(), "dist")),
]
FRONTEND_DIST = None
for candidate in candidate_dirs:
    if os.path.isdir(candidate) and os.path.isfile(os.path.join(candidate, "index.html")):
        FRONTEND_DIST = candidate
        break

if FRONTEND_DIST:
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="static_assets")

    @app.get("/")
    async def serve_root():
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Don't intercept API or docs routes
        if full_path.startswith("api/") or full_path in ("docs", "redoc", "openapi.json"):
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Not Found")

        target = os.path.join(FRONTEND_DIST, full_path)
        if os.path.isfile(target):
            return FileResponse(target)

        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
else:
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
