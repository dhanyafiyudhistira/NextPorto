"""
NILM Inference Service
Simulates a trained deep learning model for appliance disaggregation
"""

import numpy as np
from typing import List, Dict


class NILMInferenceModel:
    """
    Simulated NILM model that estimates individual appliance power consumption
    from aggregate main power signal.

    In a real implementation, this would load a trained CNN-LSTM model.
    For this demo, we use heuristics and patterns to simulate realistic disaggregation.
    """

    def __init__(self):
        self.model_version = 1
        self.model_type = "CNN-LSTM"

        # Appliance power consumption patterns (W)
        self.appliance_patterns = {
            "fridge": {"base": 80, "variance": 50, "threshold": 100},
            "dishWasher": {"base": 1300, "variance": 300, "threshold": 800},
            "electricSpaceHeater": {"base": 1800, "variance": 400, "threshold": 1200},
            "electricStove": {"base": 2500, "variance": 800, "threshold": 1500},
            "microwave": {"base": 1100, "variance": 200, "threshold": 700},
            "washerDryer": {"base": 2200, "variance": 600, "threshold": 1400},
        }

    def infer(self, window: List[float]) -> Dict[str, float]:
        """
        Run NILM inference on a time-series window of main power

        Args:
            window: List of main power values (W) over time

        Returns:
            Dictionary of appliance names to estimated power consumption
        """
        if not window or len(window) == 0:
            raise ValueError("Window cannot be empty")

        # Convert to numpy array for easier computation
        window_array = np.array(window)

        # Calculate statistics
        mean_power = np.mean(window_array)
        max_power = np.max(window_array)
        std_power = np.std(window_array)
        recent_power = window_array[-1]

        # Initialize estimates
        estimates = {}

        # Fridge: Always on with variations (baseline consumption)
        fridge_power = self._estimate_fridge(window_array)
        estimates["fridge"] = fridge_power

        # Dish washer: Detect based on sustained high power
        dishwasher_power = self._estimate_dishwasher(window_array, mean_power)
        estimates["dishWasher"] = dishwasher_power

        # Electric space heater: Detect based on sustained very high power
        heater_power = self._estimate_heater(window_array, mean_power, max_power)
        estimates["electricSpaceHeater"] = heater_power

        # Electric stove: Detect based on very high power spikes
        stove_power = self._estimate_stove(window_array, max_power, recent_power)
        estimates["electricStove"] = stove_power

        # Microwave: Detect based on short high power bursts
        microwave_power = self._estimate_microwave(window_array, std_power, recent_power)
        estimates["microwave"] = microwave_power

        # Washer/Dryer: Detect based on high power with variations
        washer_power = self._estimate_washer_dryer(window_array, std_power, mean_power)
        estimates["washerDryer"] = washer_power

        # Add some estimation error (±10%)
        for appliance in estimates:
            noise = np.random.uniform(0.9, 1.1)
            estimates[appliance] = max(0, estimates[appliance] * noise)

        return estimates

    def _estimate_fridge(self, window: np.ndarray) -> float:
        """Fridge is always on with baseline consumption"""
        baseline = np.percentile(window, 10)  # 10th percentile as baseline
        fridge_estimate = max(0, min(baseline, 150))  # Cap at 150W
        return round(fridge_estimate, 2)

    def _estimate_dishwasher(self, window: np.ndarray, mean_power: float) -> float:
        """Dishwasher runs in cycles with high sustained power"""
        threshold = self.appliance_patterns["dishWasher"]["threshold"]
        high_power_ratio = np.sum(window > threshold) / len(window)

        if high_power_ratio > 0.3:  # If >30% of window is high power
            base = self.appliance_patterns["dishWasher"]["base"]
            variance = self.appliance_patterns["dishWasher"]["variance"]
            return base + np.random.uniform(-variance, variance)
        return 0.0

    def _estimate_heater(self, window: np.ndarray, mean_power: float, max_power: float) -> float:
        """Electric heater has sustained very high power"""
        threshold = self.appliance_patterns["electricSpaceHeater"]["threshold"]

        if mean_power > threshold and max_power > 1500:
            base = self.appliance_patterns["electricSpaceHeater"]["base"]
            variance = self.appliance_patterns["electricSpaceHeater"]["variance"]
            return base + np.random.uniform(-variance, variance)
        return 0.0

    def _estimate_stove(self, window: np.ndarray, max_power: float, recent_power: float) -> float:
        """Electric stove has very high power spikes"""
        threshold = self.appliance_patterns["electricStove"]["threshold"]

        if max_power > threshold or recent_power > threshold:
            base = self.appliance_patterns["electricStove"]["base"]
            variance = self.appliance_patterns["electricStove"]["variance"]
            return base + np.random.uniform(-variance, variance)
        return 0.0

    def _estimate_microwave(self, window: np.ndarray, std_power: float, recent_power: float) -> float:
        """Microwave has short high power bursts"""
        threshold = self.appliance_patterns["microwave"]["threshold"]

        # Check for recent high power with high variance (burst pattern)
        if recent_power > threshold and std_power > 200:
            base = self.appliance_patterns["microwave"]["base"]
            variance = self.appliance_patterns["microwave"]["variance"]
            return base + np.random.uniform(-variance, variance)
        return 0.0

    def _estimate_washer_dryer(self, window: np.ndarray, std_power: float, mean_power: float) -> float:
        """Washer/dryer has high power with variations (cycles)"""
        threshold = self.appliance_patterns["washerDryer"]["threshold"]

        # High variance + high mean suggests washer/dryer cycles
        if std_power > 300 and mean_power > threshold:
            base = self.appliance_patterns["washerDryer"]["base"]
            variance = self.appliance_patterns["washerDryer"]["variance"]
            return base + np.random.uniform(-variance, variance)
        return 0.0


# Global model instance
nilm_model = NILMInferenceModel()
