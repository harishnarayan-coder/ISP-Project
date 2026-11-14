"""
CNN-LSTM Hybrid Forecasting Model
Combines 1D-CNN temporal convolution (extracting local high-frequency weather and ramp patterns)
with LSTM recurrent processing (learning long-range temporal sequence dependencies).
"""

import os
import json
import numpy as np
from typing import Dict, Any, Optional
from .base import BaseForecastModel
from ..evaluation.metrics import calculate_metrics

class CNNLSTMModel(BaseForecastModel):
    def __init__(self, sequence_length: int = 24, n_features: int = 8, n_filters: int = 16, kernel_size: int = 3, lstm_units: int = 32, horizon: int = 1):
        super().__init__(name="CNN-LSTM", sequence_length=sequence_length, n_features=n_features, horizon=horizon)
        self.n_filters = n_filters
        self.kernel_size = kernel_size
        self.lstm_units = lstm_units
        
        rng = np.random.default_rng(202)
        # 1D Convolution filters: (n_filters, kernel_size, n_features)
        conv_scale = np.sqrt(2.0 / (kernel_size * n_features))
        self.conv_weights = rng.normal(0, conv_scale, (n_filters, kernel_size, n_features)).astype(np.float32)
        self.conv_bias = np.zeros(n_filters, dtype=np.float32)
        
        # LSTM cell after conv & pool (input dimension is n_filters)
        scale_in = np.sqrt(2.0 / (n_filters + lstm_units))
        scale_rec = np.sqrt(2.0 / (lstm_units + lstm_units))
        self.W_x = rng.normal(0, scale_in, (4 * lstm_units, n_filters)).astype(np.float32)
        self.W_h = rng.normal(0, scale_rec, (4 * lstm_units, lstm_units)).astype(np.float32)
        self.b = np.zeros((4 * lstm_units, 1), dtype=np.float32)
        self.b[:lstm_units] = 1.0  # forget gate bias
        
        # Output dense layer
        self.W_out = rng.normal(0, np.sqrt(2.0 / lstm_units), (horizon, lstm_units)).astype(np.float32)
        self.b_out = np.zeros((horizon, 1), dtype=np.float32)

    def _conv1d_forward(self, sequence: np.ndarray) -> np.ndarray:
        """
        Valid 1D convolution over sequence: (seq_len, n_features) -> (conv_len, n_filters)
        followed by max pooling stride 2.
        """
        seq_len = len(sequence)
        out_len = seq_len - self.kernel_size + 1
        conv_out = np.zeros((out_len, self.n_filters), dtype=np.float32)
        
        for t in range(out_len):
            patch = sequence[t : t + self.kernel_size]  # (kernel_size, n_features)
            # Convolution dot product across all filters
            val = np.sum(patch * self.conv_weights, axis=(1, 2)) + self.conv_bias
            conv_out[t] = np.maximum(0.0, val)  # ReLU
            
        # Max pooling 1D with stride 2
        pool_len = out_len // 2
        pooled = np.zeros((pool_len, self.n_filters), dtype=np.float32)
        for p in range(pool_len):
            pooled[p] = np.max(conv_out[2*p : 2*p + 2], axis=0)
            
        return pooled

    def _sigmoid(self, x: np.ndarray) -> np.ndarray:
        return 1.0 / (1.0 + np.exp(-np.clip(x, -15.0, 15.0)))

    def _forward_sequence(self, sequence: np.ndarray) -> np.ndarray:
        # 1. 1D CNN + Pooling
        features = self._conv1d_forward(sequence)
        
        # 2. LSTM over pooled temporal representations
        h = np.zeros((self.lstm_units, 1), dtype=np.float32)
        c = np.zeros((self.lstm_units, 1), dtype=np.float32)
        lu = self.lstm_units
        
        for t in range(len(features)):
            x_t = features[t].reshape(-1, 1)
            gates = np.dot(self.W_x, x_t) + np.dot(self.W_h, h) + self.b
            
            f = self._sigmoid(gates[0:lu])
            i = self._sigmoid(gates[lu:2*lu])
            c_cand = np.tanh(gates[2*lu:3*lu])
            o = self._sigmoid(gates[3*lu:4*lu])
            
            c = f * c + i * c_cand
            h = o * np.tanh(c)
            
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
            conv_weights=self.conv_weights,
            conv_bias=self.conv_bias,
            W_x=self.W_x,
            W_h=self.W_h,
            b=self.b,
            W_out=self.W_out,
            b_out=self.b_out,
            meta=json.dumps(self.get_info())
        )

    def load(self, filepath: str) -> None:
        data = np.load(filepath)
        self.conv_weights = data["conv_weights"]
        self.conv_bias = data["conv_bias"]
        self.W_x = data["W_x"]
        self.W_h = data["W_h"]
        self.b = data["b"]
        self.W_out = data["W_out"]
        self.b_out = data["b_out"]
        self.is_trained = True
