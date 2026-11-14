"""
Data Preprocessing Pipeline for Renewable Energy Forecasting
Provides imputation, cyclical time-feature encoding, MinMax scaling,
and sliding-window sequence creation for multi-horizon forecasting.
"""

import math
import numpy as np
import pandas as pd
from typing import Tuple, List, Dict, Any, Optional

class RenewableDataPreprocessor:
    def __init__(self, sequence_length: int = 24, target_col: str = "total_power_mw"):
        self.sequence_length = sequence_length
        self.target_col = target_col
        self.feature_names: List[str] = []
        self.feature_min: Dict[str, float] = {}
        self.feature_max: Dict[str, float] = {}
        self.is_fitted = False
        self.preprocessing_summary: Dict[str, Any] = {}

    def fit_transform_dataframe(self, df: pd.DataFrame, target_col: Optional[str] = None) -> Tuple[np.ndarray, List[str]]:
        """
        Cleans dataframe, extracts cyclical features, records min/max bounds,
        and returns scaled numeric feature matrix.
        """
        if target_col:
            self.target_col = target_col
            
        initial_rows = len(df)
        initial_missing = int(df.isnull().sum().sum())
        
        # 1. Clean duplicates & timestamp sort
        df_clean = df.copy()
        if "timestamp" in df_clean.columns:
            df_clean["timestamp"] = pd.to_datetime(df_clean["timestamp"])
            df_clean = df_clean.drop_duplicates(subset=["timestamp"]).sort_values("timestamp").reset_index(drop=True)
            
            # Cyclical time encoding
            hours = df_clean["timestamp"].dt.hour
            doys = df_clean["timestamp"].dt.dayofyear
            df_clean["sin_hour"] = np.sin(2 * np.pi * hours / 24.0)
            df_clean["cos_hour"] = np.cos(2 * np.pi * hours / 24.0)
            df_clean["sin_doy"] = np.sin(2 * np.pi * doys / 365.25)
            df_clean["cos_doy"] = np.cos(2 * np.pi * doys / 365.25)
            df_clean = df_clean.drop(columns=["timestamp"])
            
        # 2. Impute missing numeric values
        numeric_cols = df_clean.select_dtypes(include=[np.number]).columns.tolist()
        df_clean[numeric_cols] = df_clean[numeric_cols].ffill().bfill().fillna(0.0)
        
        cleaned_rows = len(df_clean)
        
        # 3. Fit scaling parameters
        self.feature_names = numeric_cols
        scaled_data = np.zeros((cleaned_rows, len(numeric_cols)), dtype=float)
        
        for idx, col in enumerate(numeric_cols):
            c_min = float(df_clean[col].min())
            c_max = float(df_clean[col].max())
            if abs(c_max - c_min) < 1e-6:
                c_max = c_min + 1.0
            self.feature_min[col] = c_min
            self.feature_max[col] = c_max
            scaled_data[:, idx] = (df_clean[col].values - c_min) / (c_max - c_min)
            
        self.is_fitted = True
        self.preprocessing_summary = {
            "initial_rows": initial_rows,
            "cleaned_rows": cleaned_rows,
            "initial_missing": initial_missing,
            "missing_values_handled": initial_missing,
            "duplicates_removed": initial_rows - cleaned_rows,
            "features_detected": self.feature_names,
            "sequence_length": self.sequence_length,
            "target_column": self.target_col
        }
        
        return scaled_data, self.feature_names

    def create_sequences(self, data: np.ndarray, horizon: int = 1) -> Tuple[np.ndarray, np.ndarray]:
        """
        Creates sliding temporal sequence windows.
        Input: data matrix (N, num_features)
        Returns:
            X: (N - sequence_length - horizon + 1, sequence_length, num_features)
            y: (N - sequence_length - horizon + 1, horizon)
        """
        if not self.is_fitted:
            raise ValueError("Preprocessor must be fitted before creating sequences.")
            
        target_idx = self.feature_names.index(self.target_col) if self.target_col in self.feature_names else 0
        n_samples = len(data) - self.sequence_length - horizon + 1
        
        if n_samples <= 0:
            raise ValueError(f"Insufficient samples ({len(data)}) for sequence_length={self.sequence_length} and horizon={horizon}")
            
        X = np.zeros((n_samples, self.sequence_length, data.shape[1]), dtype=np.float32)
        y = np.zeros((n_samples, horizon), dtype=np.float32)
        
        for i in range(n_samples):
            X[i] = data[i : i + self.sequence_length]
            y[i] = data[i + self.sequence_length : i + self.sequence_length + horizon, target_idx]
            
        return X, y

    def inverse_transform_target(self, y_scaled: np.ndarray) -> np.ndarray:
        """
        Inverse transforms target values from [0, 1] back to physical units (MW).
        """
        if self.target_col not in self.feature_min:
            return y_scaled
        c_min = self.feature_min[self.target_col]
        c_max = self.feature_max[self.target_col]
        return y_scaled * (c_max - c_min) + c_min

    def split_temporal(self, X: np.ndarray, y: np.ndarray, train_ratio: float = 0.7, val_ratio: float = 0.15) -> Dict[str, np.ndarray]:
        """
        Splits sequential data into train, val, and test partitions chronologically without leakage.
        """
        n = len(X)
        train_end = int(n * train_ratio)
        val_end = int(n * (train_ratio + val_ratio))
        
        return {
            "X_train": X[:train_end],
            "y_train": y[:train_end],
            "X_val": X[train_end:val_end],
            "y_val": y[train_end:val_end],
            "X_test": X[val_end:],
            "y_test": y[val_end:]
        }
