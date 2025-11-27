"""
NILM Federated Learning Service - FastAPI Application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import inference, federated
from app.models.schemas import HealthResponse

# Create FastAPI app
app = FastAPI(
    title="NILM Federated Learning Service",
    description="Python FastAPI service for NILM inference and federated learning",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(inference.router)
app.include_router(federated.router)


@app.get("/", tags=["root"])
async def root():
    """Root endpoint with API information"""
    return {
        "name": "NILM Federated Learning Service",
        "version": "1.0.0",
        "description": "FastAPI service for Non-Intrusive Load Monitoring and Federated Learning",
        "endpoints": {
            "inference": {
                "POST /infer": "Run NILM inference on time-series window"
            },
            "federated": {
                "POST /federated/update": "Submit federated learning update",
                "GET /federated/global-model": "Get current global model metadata",
                "GET /federated/round-info": "Get current round information"
            },
            "health": {
                "GET /health": "Health check endpoint"
            }
        },
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health", response_model=HealthResponse, tags=["health"])
async def health_check():
    """Health check endpoint"""
    return HealthResponse()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
