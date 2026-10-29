"""
SolarSight AI — FastAPI Backend
Machine Learning-Based Solar Irradiance Estimation
"""

import calendar
from contextlib import asynccontextmanager
import json
import logging
from pathlib import Path
from typing import Optional

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(message)s",
)
logger = logging.getLogger("solarsight")

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model" / "solar_irradiance_model.joblib"
METADATA_PATH = BASE_DIR / "model" / "model_metadata.json"

# ---------------------------------------------------------------------------
# Global state
# ---------------------------------------------------------------------------
model = None
metadata: dict = {}
model_loaded: bool = False


# ---------------------------------------------------------------------------
# Model & metadata loader
# ---------------------------------------------------------------------------
def load_model() -> None:
    global model, metadata, model_loaded
    if model_loaded and model is not None:
        return

    # Load metadata
    try:
        with open(METADATA_PATH, "r") as f:
            metadata = json.load(f)
        logger.info("Model metadata loaded from %s", METADATA_PATH)
    except Exception as exc:
        logger.error("Failed to load model metadata: %s", exc)
        metadata = {}

    # Load model
    try:
        model = joblib.load(MODEL_PATH)
        model_loaded = True
        logger.info("Model loaded successfully from %s", MODEL_PATH)
    except Exception as exc:
        logger.error("Failed to load model: %s", exc)
        model_loaded = False


@asynccontextmanager
async def lifespan(app_instance: FastAPI):
    load_model()
    yield


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="SolarSight AI",
    description="ML-Based Solar Irradiance Estimation API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1|.*\.vercel\.app)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _require_model() -> None:
    """Raise 503 if the model is not available."""
    if not model_loaded or model is None:
        raise HTTPException(
            status_code=503,
            detail="Model is not loaded. Please try again later.",
        )


def _month_name(month: int) -> str:
    return calendar.month_name[month]


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------
class PredictionRequest(BaseModel):
    year: int = Field(..., ge=1985, le=2030, description="Year (1985-2030)")
    latitude: float = Field(..., ge=-90, le=90, description="Latitude (-90 to 90)")
    longitude: float = Field(..., ge=-180, le=180, description="Longitude (-180 to 180)")
    month: int = Field(..., ge=1, le=12, description="Month (1-12)")
    clearsky: float = Field(
        ...,
        ge=0,
        le=15,
        description="Clear-sky GHI in kWh/m²/day (0-15)",
    )


class PredictionResult(BaseModel):
    prediction: dict
    model: str
    inputs: dict
    warnings: list[str]


class BatchPredictionRequest(BaseModel):
    requests: list[PredictionRequest]


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": model_loaded,
        "model_name": metadata.get("model_name", "Unknown"),
    }


@app.get("/api/model-info")
def model_info():
    return {
        "model_name": metadata.get("model_name", "Unknown"),
        "features": metadata.get("features", []),
        "target": metadata.get("target", "GHI"),
        "target_unit": metadata.get("target_unit", "kWh/m²/day"),
        "evaluation_metrics": {
            "MAE": round(metadata.get("test_MAE", 0), 4),
            "RMSE": round(metadata.get("test_RMSE", 0), 4),
            "R2": round(metadata.get("test_R2", 0), 4),
        },
        "training_data": {
            "description": "63 regional locations across India, monthly data from 2001 to 2025",
            "locations": 63,
            "year_range": "2001-2025",
        },
        "test_info": {
            "description": "Evaluated on 13 held-out locations not seen during training",
            "test_locations": metadata.get("test_locations", 13),
        },
    }


@app.get("/api/model-comparison")
def model_comparison():
    return {
        "comparison": [
            {
                "model": "Random Forest",
                "MAE": 0.1264,
                "RMSE": 0.1762,
                "R2": 0.9600,
                "selected": True,
            },
            {
                "model": "XGBoost",
                "MAE": 0.1843,
                "RMSE": 0.2493,
                "R2": 0.9199,
                "selected": False,
            },
            {
                "model": "Neural Network (MLP)",
                "MAE": 0.2272,
                "RMSE": 0.3096,
                "R2": 0.8765,
                "selected": False,
            },
            {
                "model": "Linear Regression",
                "MAE": 0.5332,
                "RMSE": 0.6519,
                "R2": 0.4523,
                "selected": False,
            },
        ]
    }


def _predict_single(req: PredictionRequest) -> PredictionResult:
    """Run a single prediction and return a structured result."""
    _require_model()

    warnings: list[str] = []
    if req.year < 2001 or req.year > 2025:
        warnings.append(
            f"Year {req.year} is outside the training data range (2001-2025). "
            "Prediction may be less reliable."
        )

    # Build DataFrame with exact training feature names/order
    feature_names = metadata.get("features", ["YEAR", "LAT", "LON", "MONTH_NUM", "CLEARSKY"])
    row = {
        "YEAR": req.year,
        "LAT": req.latitude,
        "LON": req.longitude,
        "MONTH_NUM": req.month,
        "CLEARSKY": req.clearsky,
    }
    df = pd.DataFrame([row], columns=feature_names)

    try:
        pred = model.predict(df)
        ghi_value = float(np.round(pred[0], 4))
    except Exception as exc:
        logger.error("Prediction failed: %s", exc)
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}")

    return PredictionResult(
        prediction={
            "ghi": ghi_value,
            "unit": metadata.get("target_unit", "kWh/m²/day"),
            "description": "Estimated monthly mean daily Global Horizontal Irradiance",
        },
        model=metadata.get("model_name", "Random Forest"),
        inputs={
            "year": req.year,
            "latitude": req.latitude,
            "longitude": req.longitude,
            "month": req.month,
            "month_name": _month_name(req.month),
            "clearsky": req.clearsky,
        },
        warnings=warnings,
    )


@app.post("/api/predict", response_model=PredictionResult)
def predict(req: PredictionRequest):
    return _predict_single(req)


@app.post("/api/predict/batch")
def predict_batch(batch: BatchPredictionRequest):
    _require_model()
    results = [_predict_single(r) for r in batch.requests]
    return {"results": [r.model_dump() for r in results]}
