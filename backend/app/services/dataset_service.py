"""
Dataset Service
Handles dataset ingestion, CSV parsing, schema validation, feature detection,
and preprocessing pipeline execution.
"""

import os
import io
import json
import pandas as pd
from typing import Dict, Any, List, Optional
from ..schemas.schemas import DatasetInfoResponse, PreprocessingResponse
from ml.preprocessing.pipeline import RenewableDataPreprocessor

class DatasetService:
    def __init__(self, upload_dir: str = "data/processed", sample_dir: str = "data/sample"):
        self.upload_dir = upload_dir
        self.sample_dir = sample_dir
        os.makedirs(upload_dir, exist_ok=True)
        os.makedirs(sample_dir, exist_ok=True)
        
        self.expected_features = [
            "timestamp", "solar_power_mw", "wind_power_mw",
            "temperature", "humidity", "cloud_cover",
            "solar_irradiance", "wind_speed", "wind_direction", "pressure"
        ]

    def parse_dataframe_info(self, df: pd.DataFrame, filename: str) -> DatasetInfoResponse:
        rows = len(df)
        cols = len(df.columns)
        missing_values = int(df.isnull().sum().sum())
        
        # Date range detection
        date_start = "N/A"
        date_end = "N/A"
        if "timestamp" in df.columns:
            try:
                ts_series = pd.to_datetime(df["timestamp"])
                date_start = str(ts_series.min())
                date_end = str(ts_series.max())
            except Exception:
                pass
                
        detected = [str(c) for c in df.columns]
        missing_expected = [feat for feat in self.expected_features if feat not in detected]
        
        # Preview rows (convert NaN to None for JSON compliance)
        preview_df = df.head(10).fillna("")
        preview = preview_df.to_dict(orient="records")
        
        return DatasetInfoResponse(
            filename=filename,
            rows=rows,
            columns=cols,
            missing_values=missing_values,
            date_range_start=date_start,
            date_range_end=date_end,
            detected_features=detected,
            missing_expected_features=missing_expected,
            preview=preview
        )

    def load_dataset_info(self, dataset_name: str) -> DatasetInfoResponse:
        # Check upload dir first, then sample dir
        target_path = os.path.join(self.upload_dir, dataset_name)
        if not os.path.exists(target_path):
            target_path = os.path.join(self.sample_dir, dataset_name)
            
        if not os.path.exists(target_path):
            # Fall back to combined sample
            target_path = os.path.join(self.sample_dir, "combined_renewable_sample.csv")
            dataset_name = "combined_renewable_sample.csv"
            
        df = pd.read_csv(target_path)
        return self.parse_dataframe_info(df, dataset_name)

    def process_csv_upload(self, content: bytes, filename: str) -> DatasetInfoResponse:
        df = pd.read_csv(io.BytesIO(content))
        save_path = os.path.join(self.upload_dir, filename)
        df.to_csv(save_path, index=False)
        return self.parse_dataframe_info(df, filename)

    def run_preprocessing(self, dataset_name: str) -> PreprocessingResponse:
        target_path = os.path.join(self.upload_dir, dataset_name)
        if not os.path.exists(target_path):
            target_path = os.path.join(self.sample_dir, dataset_name)
        if not os.path.exists(target_path):
            target_path = os.path.join(self.sample_dir, "combined_renewable_sample.csv")
            
        df = pd.read_csv(target_path)
        raw_count = len(df)
        raw_missing = int(df.isnull().sum().sum())
        
        preprocessor = RenewableDataPreprocessor(sequence_length=24, target_col="solar_power_mw" if "solar_power_mw" in df.columns else "total_power_mw")
        scaled_data, features = preprocessor.fit_transform_dataframe(df)
        
        # Generate sequence windows
        X, y = preprocessor.create_sequences(scaled_data, horizon=1)
        splits = preprocessor.split_temporal(X, y)
        
        return PreprocessingResponse(
            raw_records=raw_count,
            cleaned_records=len(scaled_data),
            missing_handled=raw_missing,
            duplicates_removed=raw_count - len(scaled_data),
            normalization_status="MinMaxScaler [0, 1] Normalized",
            sequence_length=24,
            train_count=len(splits["X_train"]),
            val_count=len(splits["X_val"]),
            test_count=len(splits["X_test"]),
            status="Successfully preprocessed and partitioned into temporal sequences"
        )

# Global dataset service instance
dataset_service = DatasetService()
