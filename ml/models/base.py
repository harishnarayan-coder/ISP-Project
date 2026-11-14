"""
Base Model Interface for Renewable Energy Forecasting
Defines uniform contract for LSTM, GRU, and CNN-LSTM architectures.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import numpy as np

class BaseForecastModel(ABC):
    def __init__(self, name: str, sequence_length: int = 24, n_features: int = 8, horizon: int = 1):
        self.name = name
        self.sequence_length = sequence_length
        self.n_features = n_features
        self.horizon = horizon
        self.is_trained = False
        self.training_history: Dict[str, Any] = {}
        
    @abstractmethod
    def train(self, X: np.ndarray, y: np.ndarray, epochs: int = 15, batch_size: int = 32, validation_split: float = 0.2) -> Dict[str, Any]:
        """
        Train the forecasting model on 3D sequence array X: (samples, sequence_length, n_features)
        and target array y: (samples, horizon)
        """
        pass

    @abstractmethod
    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Generate predictions for input sequences. Returns array of shape (samples, horizon).
        """
        pass

    @abstractmethod
    def evaluate(self, X: np.ndarray, y: np.ndarray) -> Dict[str, float]:
        """
        Evaluate model predictions against ground truth using MAE, RMSE, MAPE, R2.
        """
        pass

    @abstractmethod
    def save(self, filepath: str) -> None:
        """
        Persist model weights and configuration to disk.
        """
        pass

    @abstractmethod
    def load(self, filepath: str) -> None:
        """
        Load model weights and configuration from disk.
        """
        pass

    def get_info(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "sequence_length": self.sequence_length,
            "n_features": self.n_features,
            "horizon": self.horizon,
            "is_trained": self.is_trained
        }
