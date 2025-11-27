"""
Federated Learning Router
"""

from fastapi import APIRouter, HTTPException
from app.models.schemas import FederatedUpdateRequest, GlobalModelResponse
from app.services.federated_coordinator import federated_coordinator

router = APIRouter(prefix="/federated", tags=["federated-learning"])


@router.post("/update", response_model=GlobalModelResponse)
async def submit_federated_update(request: FederatedUpdateRequest):
    """
    Receive local model updates from a client and return updated global model

    Args:
        request: FederatedUpdateRequest containing client update information

    Returns:
        GlobalModelResponse with current global model metadata
    """
    try:
        # Submit client update to coordinator
        global_model = federated_coordinator.submit_client_update(
            client_id=request.clientId,
            round_id=request.roundId,
            num_samples=request.numSamples,
            loss=request.loss,
            accuracy=request.accuracy,
            weights=request.weights,
        )

        return GlobalModelResponse(**global_model)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process federated update: {str(e)}"
        )


@router.get("/global-model", response_model=GlobalModelResponse)
async def get_global_model():
    """
    Get the current global model metadata

    Returns:
        GlobalModelResponse with current global model information
    """
    try:
        global_model = federated_coordinator.get_global_model()
        return GlobalModelResponse(**global_model)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get global model: {str(e)}"
        )


@router.get("/round-info")
async def get_round_info():
    """
    Get information about the current federated learning round

    Returns:
        Round information including current round number and participating clients
    """
    try:
        return federated_coordinator.get_round_info()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get round info: {str(e)}"
        )
