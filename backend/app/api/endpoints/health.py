"""
Health API Endpoint
"""

from fastapi import APIRouter
from datetime import datetime
from ...schemas.schemas import HealthResponse

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("", response_model=HealthResponse)
async def check_health():
    return HealthResponse(
        status="operational",
        version="1.0.0",
        models_loaded=["LSTM", "GRU", "CNN-LSTM", "Adaptive-Fusion-Engine"],
        timestamp=datetime.utcnow().isoformat() + "Z"
    )
