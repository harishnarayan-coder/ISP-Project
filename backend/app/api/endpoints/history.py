"""
Prediction History API Endpoints
"""

from fastapi import APIRouter, Query
from typing import List, Optional
from ...schemas.schemas import HistoryRecord
from ...services.forecast_service import forecast_service

router = APIRouter(prefix="/history", tags=["History"])

@router.get("", response_model=List[HistoryRecord])
async def get_prediction_history(
    search: Optional[str] = Query(None, description="Search query by location or strategy"),
    horizon: Optional[str] = Query(None, description="Filter by horizon"),
    limit: int = Query(25, ge=1, le=100)
):
    history = forecast_service.get_history()
    
    if search:
        s = search.lower()
        history = [r for r in history if s in r.location.lower() or s in r.strategy.lower()]
        
    if horizon:
        h = horizon.lower()
        history = [r for r in history if h == r.horizon.lower()]
        
    return history[:limit]

@router.delete("/clear")
async def clear_history():
    forecast_service.history = []
    return {"message": "Prediction history cleared."}
