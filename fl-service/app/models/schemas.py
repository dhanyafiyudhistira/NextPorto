"""
Pydantic models for NILM Federated Learning Service API
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class InferenceRequest(BaseModel):
    """Request model for NILM inference"""
    window: List[float] = Field(..., description="Time series window of main power values")
    windowSize: int = Field(..., description="Size of the window", gt=0)


class InferenceResponse(BaseModel):
    """Response model for NILM inference"""
    dishWasher: float = Field(0.0, ge=0, description="Estimated dish washer power (W)")
    electricSpaceHeater: float = Field(0.0, ge=0, description="Estimated electric space heater power (W)")
    electricStove: float = Field(0.0, ge=0, description="Estimated electric stove power (W)")
    fridge: float = Field(0.0, ge=0, description="Estimated fridge power (W)")
    microwave: float = Field(0.0, ge=0, description="Estimated microwave power (W)")
    washerDryer: float = Field(0.0, ge=0, description="Estimated washer dryer power (W)")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class FederatedUpdateRequest(BaseModel):
    """Request model for federated learning update"""
    clientId: str = Field(..., description="Client identifier")
    roundId: int = Field(..., description="Federated learning round number", ge=0)
    numSamples: int = Field(..., description="Number of training samples", gt=0)
    weights: Optional[List[float]] = Field(None, description="Model weight updates (simplified)")
    loss: float = Field(..., description="Training loss", ge=0)
    accuracy: float = Field(..., description="Training accuracy", ge=0, le=1)


class GlobalModelResponse(BaseModel):
    """Response model for global model metadata"""
    version: int = Field(..., description="Model version number")
    roundId: int = Field(..., description="Current federated learning round")
    weightsPath: str = Field(..., description="Path to global model weights")
    accuracy: float = Field(..., description="Model accuracy")
    loss: float = Field(..., description="Model loss")
    createdAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class HealthResponse(BaseModel):
    """Health check response"""
    status: str = "healthy"
    service: str = "NILM Federated Learning Service"
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
