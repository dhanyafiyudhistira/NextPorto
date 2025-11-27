"""
NILM Inference Router
"""

from fastapi import APIRouter, HTTPException
from app.models.schemas import InferenceRequest, InferenceResponse
from app.services.nilm_inference import nilm_model

router = APIRouter(prefix="", tags=["inference"])


@router.post("/infer", response_model=InferenceResponse)
async def run_inference(request: InferenceRequest):
    """
    Run NILM inference on a time-series window of main power values

    Args:
        request: InferenceRequest containing window and windowSize

    Returns:
        InferenceResponse with estimated appliance power consumption
    """
    try:
        # Validate window size
        if len(request.window) != request.windowSize:
            raise HTTPException(
                status_code=400,
                detail=f"Window length ({len(request.window)}) does not match windowSize ({request.windowSize})"
            )

        if request.windowSize < 10:
            raise HTTPException(
                status_code=400,
                detail="Window size must be at least 10 samples"
            )

        # Run inference
        estimates = nilm_model.infer(request.window)

        # Return response
        return InferenceResponse(**estimates)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")
