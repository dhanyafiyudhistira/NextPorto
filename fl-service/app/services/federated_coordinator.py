"""
Federated Learning Coordinator Service
Manages federated learning rounds and model aggregation
"""

import numpy as np
from typing import List, Dict
from datetime import datetime


class FederatedCoordinator:
    """
    Simulates federated learning coordination.

    In a real implementation, this would:
    - Manage multiple clients
    - Aggregate model updates using FedAvg or similar
    - Track training rounds
    - Distribute global models
    """

    def __init__(self):
        self.current_round = 0
        self.global_model_version = 1
        self.global_model_path = "/models/global_model_v1.pth"
        self.global_accuracy = 0.85
        self.global_loss = 0.15

        # Track client updates for current round
        self.client_updates: Dict[str, dict] = {}

    def submit_client_update(
        self,
        client_id: str,
        round_id: int,
        num_samples: int,
        loss: float,
        accuracy: float,
        weights: List[float] = None
    ) -> Dict:
        """
        Submit a client's local model update

        Args:
            client_id: Unique client identifier
            round_id: Round number for this update
            num_samples: Number of samples used for training
            loss: Client's training loss
            accuracy: Client's training accuracy
            weights: Model weight updates (simplified)

        Returns:
            Global model metadata after aggregation
        """
        # Store client update
        self.client_updates[client_id] = {
            "roundId": round_id,
            "numSamples": num_samples,
            "loss": loss,
            "accuracy": accuracy,
            "weights": weights,
            "timestamp": datetime.utcnow().isoformat(),
        }

        # In a real system, we'd wait for multiple clients before aggregating
        # For this demo, we aggregate immediately
        if round_id > self.current_round:
            self._aggregate_updates()

        return self.get_global_model()

    def _aggregate_updates(self):
        """
        Aggregate client updates using FedAvg algorithm (simplified)

        In a real implementation:
        - Wait for minimum number of clients
        - Weight updates by number of samples
        - Update global model weights
        - Increment round number
        """
        if not self.client_updates:
            return

        # Calculate weighted average of losses and accuracies
        total_samples = sum(update["numSamples"] for update in self.client_updates.values())

        weighted_loss = sum(
            update["loss"] * update["numSamples"] / total_samples
            for update in self.client_updates.values()
        )

        weighted_accuracy = sum(
            update["accuracy"] * update["numSamples"] / total_samples
            for update in self.client_updates.values()
        )

        # Update global model metadata
        self.global_loss = weighted_loss
        self.global_accuracy = weighted_accuracy

        # Increment round and version
        self.current_round += 1
        self.global_model_version += 1
        self.global_model_path = f"/models/global_model_v{self.global_model_version}.pth"

        # Clear updates for next round
        self.client_updates.clear()

        print(f"✅ Aggregated updates for round {self.current_round}")
        print(f"   Global Loss: {self.global_loss:.4f}")
        print(f"   Global Accuracy: {self.global_accuracy:.4f}")

    def get_global_model(self) -> Dict:
        """
        Get current global model metadata

        Returns:
            Global model information
        """
        return {
            "version": self.global_model_version,
            "roundId": self.current_round,
            "weightsPath": self.global_model_path,
            "accuracy": round(self.global_accuracy, 4),
            "loss": round(self.global_loss, 4),
            "createdAt": datetime.utcnow().isoformat(),
        }

    def get_round_info(self) -> Dict:
        """Get information about the current round"""
        return {
            "currentRound": self.current_round,
            "participatingClients": len(self.client_updates),
            "clientIds": list(self.client_updates.keys()),
        }


# Global coordinator instance
federated_coordinator = FederatedCoordinator()
