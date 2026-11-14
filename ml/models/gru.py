"""
Gated Recurrent Unit (GRU) Forecasting Model
Provides efficient sequential learning with a compact gating architecture (reset and update gates).
"""

import os
import json
import numpy as np
from typing import Dict, Any, Optional
from .base import BaseForecastModel
from ..evaluation.metrics import calculate_metrics

class GRUModel(BaseForecastModel):
    def __init__(self, sequence_length: int = 24, n_features: int = 8, hidden_units: int = 32, horizon: int = 1):
        super().__init__(name="GRU", sequence_length=sequence_length, n_features=n_features, horizon=horizon)
        self.hidden_units = hidden_units
        
        rng = np.random.default_rng(101)
        scale_in = np.sqrt(2.0 / (n_features + hidden_units))
        scale_rec = np.sqrt(2.0 / (hidden_units + hidden_units))
        
        # Gates: [reset, update, candidate] => 3 * hidden_units
        self.W_x = rng.normal(0, scale_in, (3 * hidden_units, n_features)).astype(np.float32)
        self.W_h = rng.normal(0, scale_rec, (3 * hidden_units, hidden_units)).astype(np.float32)
        self.b = np.zeros((3 * hidden_units, 1), dtype=np.float32)
        
        # Output dense layer
        self.W_out = rng.normal(0, np.sqrt(2.0 / hidden_units), (horizon, hidden_units)).astype(np.float32)
        self.b_out = np.zeros((horizon, 1), dtype=np.float32)

    def _sigmoid(self, x: np.ndarray) -> np.ndarray:
        return 1.0 / (1.0 + np.exp(-np.clip(x, -15.0, 15.0)))

    def _forward_sequence(self, sequence: np.ndarray) -> np.ndarray:
        """
        Processes a temporal window of shape (sequence_length, n_features).
        Returns final hidden state h_T of shape (hidden_units,).
        """
        h = np.zeros((self.hidden_units, 1), dtype=np.float32)
        hu = self.hidden_units
        
        for t in range(len(sequence)):
            x_t = sequence[t].reshape(-1, 1)
            
            # Reset and update gates
            gate_in = np.dot(self.W_x[:2*hu], x_t) + np.dot(self.W_h[:2*hu], h) + self.b[:2*hu]
            r = self._sigmoid(gate_in[0:hu])
            z = self._sigmoid(gate_in[hu:2*hu])
            
            # Candidate state
            cand_in = np.dot(self.W_x[2*hu:], x_t) + np.dot(self.W_h[2*hu:], r * h) + self.b[2*hu:]
            h_tilde = np.tanh(cand_in)
            
            # State update
            h = (1.0 - z) * h + z * h_tilde
            
        return h.flatten()

    def predict(self, X: np.ndarray) -> np.ndarray:
        samples = len(X)
        preds = np.zeros((samples, self.horizon), dtype=np.float32)
        
        for i in range(samples):
            h_final = self._forward_sequence(X[i])
            out = np.dot(self.W_out, h_final.reshape(-1, 1)) + self.b_out
            preds[i] = np.clip(out.flatten(), 0.0, None)
            
        return preds

    def train(self, X: np.ndarray, y: np.ndarray, epochs: int = 15, batch_size: int = 32, validation_split: float = 0.2) -> Dict[str, Any]:
        n_samples = len(X)
        val_size = int(n_samples * validation_split)
        train_size = n_samples - val_size
        
        X_train, y_train = X[:train_size], y[:train_size]
        X_val, y_val = X[train_size:], y[train_size:]
        
        hidden_states_train = np.array([self._forward_sequence(x) for x in X_train])
        
        # Ridge regularized regression for output projection
        reg = 1e-3
        H = hidden_states_train
        I = np.eye(H.shape[1], dtype=np.float32)
        W_opt = np.linalg.solve(np.dot(H.T, H) + reg * I, np.dot(H.T, y_train)).T
        
        self.W_out = W_opt.astype(np.float32)
        self.b_out = np.mean(y_train - np.dot(H, self.W_out.T), axis=0).reshape(-1, 1).astype(np.float32)
        self.is_trained = True
        
        train_pred = self.predict(X_train)
        val_pred = self.predict(X_val) if val_size > 0 else train_pred
        
        train_metrics = calculate_metrics(y_train, train_pred)
        val_metrics = calculate_metrics(y_val, val_pred)
        
        self.training_history = {
            "epochs": epochs,
            "train_mae": train_metrics["mae"],
            "val_mae": val_metrics["mae"],
            "train_rmse": train_metrics["rmse"],
            "val_rmse": val_metrics["rmse"],
            "r2": val_metrics["r2"]
        }
        return self.training_history

    def evaluate(self, X: np.ndarray, y: np.ndarray) -> Dict[str, float]:
        preds = self.predict(X)
        return calculate_metrics(y, preds)

    def save(self, filepath: str) -> None:
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        np.savez_compressed(
            filepath,
            W_x=self.W_x,
            W_h=self.W_h,
            b=self.b,
            W_out=self.W_out,
            b_out=self.b_out,
            meta=json.dumps(self.get_info())
        )

    def load(self, filepath: str) -> None:
        data = np.load(filepath)
        self.W_x = data["W_x"]
        self.W_h = data["W_h"]
        self.b = data["b"]
        self.W_out = data["W_out"]
        self.b_out = data["b_out"]
        self.is_trained = True
