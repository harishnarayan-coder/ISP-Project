"""
Evaluation metrics computation module for energy forecasting models
"""

import numpy as np
from typing import Dict

def calculate_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    """
    Computes standard regression metrics for energy forecasting:
    - MAE: Mean Absolute Error (MW)
    - RMSE: Root Mean Squared Error (MW)
    - MAPE: Mean Absolute Percentage Error (%)
    - R2: Coefficient of Determination
    """
    y_true = np.asarray(y_true, dtype=float).flatten()
    y_pred = np.asarray(y_pred, dtype=float).flatten()
    
    # Avoid zero division in MAPE by masking very small ground-truth values (< 0.05 MW)
    abs_errors = np.abs(y_true - y_pred)
    mae = float(np.mean(abs_errors))
    rmse = float(np.sqrt(np.mean((y_true - y_pred) ** 2)))
    
    # Filter non-zero instances for meaningful MAPE
    nonzero_mask = y_true > 0.05
    if np.any(nonzero_mask):
        mape = float(np.mean(np.abs((y_true[nonzero_mask] - y_pred[nonzero_mask]) / y_true[nonzero_mask])) * 100.0)
    else:
        mape = 0.0
        
    # R-squared
    ss_res = np.sum((y_true - y_pred) ** 2)
    ss_tot = np.sum((y_true - np.mean(y_true)) ** 2)
    if ss_tot > 1e-8:
        r2 = float(1.0 - (ss_res / ss_tot))
    else:
        r2 = 1.0 if ss_res < 1e-8 else 0.0
        
    return {
        "mae": round(mae, 4),
        "rmse": round(rmse, 4),
        "mape": round(mape, 2),
        "r2": round(max(-1.0, min(1.0, r2)), 4)
    }
