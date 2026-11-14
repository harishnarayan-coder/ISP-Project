"""
Dataset Ingestion and Preprocessing API Endpoints
"""

import os
from fastapi import APIRouter, UploadFile, File, Query, HTTPException
from ...schemas.schemas import DatasetInfoResponse, PreprocessingResponse
from ...services.dataset_service import dataset_service

router = APIRouter(prefix="/dataset", tags=["Dataset"])

@router.get("/list")
async def list_available_datasets():
    samples = []
    if os.path.exists("data/sample"):
        samples = [f for f in os.listdir("data/sample") if f.endswith(".csv")]
    uploads = []
    if os.path.exists("data/processed"):
        uploads = [f for f in os.listdir("data/processed") if f.endswith(".csv")]
        
    return {
        "sample_datasets": samples,
        "uploaded_datasets": uploads,
        "default": "combined_renewable_sample.csv"
    }

@router.get("/info", response_model=DatasetInfoResponse)
async def get_dataset_info(name: str = Query("combined_renewable_sample.csv")):
    try:
        return dataset_service.load_dataset_info(name)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Dataset not found or unreadable: {str(e)}")

@router.post("/upload", response_model=DatasetInfoResponse)
async def upload_dataset_file(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV datasets are supported.")
    try:
        content = await file.read()
        return dataset_service.process_csv_upload(content, file.filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process CSV file: {str(e)}")

@router.post("/preprocess", response_model=PreprocessingResponse)
async def preprocess_dataset_endpoint(name: str = Query("combined_renewable_sample.csv")):
    try:
        return dataset_service.run_preprocessing(name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Preprocessing error: {str(e)}")
