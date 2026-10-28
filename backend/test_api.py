"""
SolarSight AI — Backend Test Suite
"""

import sys
from pathlib import Path
import pytest
from pydantic import ValidationError

# Ensure backend root is on sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from main import (
    app,
    load_model,
    health,
    model_info,
    model_comparison,
    predict,
    predict_batch,
    PredictionRequest,
    BatchPredictionRequest,
)

# Ensure model and metadata are loaded once
load_model()


def test_health():
    res = health()
    assert res["status"] == "healthy"
    assert res["model_loaded"] is True
    assert res["model_name"] == "Random Forest"


def test_model_info():
    res = model_info()
    assert res["model_name"] == "Random Forest"
    assert "features" in res
    assert res["features"] == ["YEAR", "LAT", "LON", "MONTH_NUM", "CLEARSKY"]
    assert res["target"] == "GHI"
    assert res["target_unit"] == "kWh/m²/day"
    assert "evaluation_metrics" in res
    assert res["evaluation_metrics"]["R2"] == 0.96


def test_model_comparison():
    res = model_comparison()
    assert len(res["comparison"]) == 4
    rf = res["comparison"][0]
    assert rf["model"] == "Random Forest"
    assert rf["selected"] is True
    assert rf["MAE"] == 0.1264
    assert rf["RMSE"] == 0.1762
    assert rf["R2"] == 0.9600


def test_valid_prediction():
    req = PredictionRequest(
        year=2024,
        latitude=16.5,
        longitude=80.6,
        month=1,
        clearsky=6.2,
    )
    res = predict(req)
    assert res.prediction["ghi"] > 0
    assert isinstance(res.prediction["ghi"], float)
    assert res.prediction["unit"] == "kWh/m²/day"
    assert res.inputs["month_name"] == "January"
    assert len(res.warnings) == 0


def test_prediction_year_warning():
    req = PredictionRequest(
        year=2028,
        latitude=16.5,
        longitude=80.6,
        month=6,
        clearsky=5.0,
    )
    res = predict(req)
    assert len(res.warnings) == 1
    assert "outside the training data range" in res.warnings[0]


def test_invalid_latitude():
    with pytest.raises(ValidationError):
        PredictionRequest(
            year=2024,
            latitude=95.0,
            longitude=80.6,
            month=1,
            clearsky=6.2,
        )


def test_invalid_month():
    with pytest.raises(ValidationError):
        PredictionRequest(
            year=2024,
            latitude=16.5,
            longitude=80.6,
            month=13,
            clearsky=6.2,
        )


def test_missing_clearsky():
    with pytest.raises(ValidationError):
        PredictionRequest(
            year=2024,
            latitude=16.5,
            longitude=80.6,
            month=1,
            # clearsky is required
        )


def test_batch_prediction():
    batch = BatchPredictionRequest(
        requests=[
            PredictionRequest(year=2024, latitude=16.5, longitude=80.6, month=m, clearsky=5.5)
            for m in range(1, 4)
        ]
    )
    res = predict_batch(batch)
    assert len(res["results"]) == 3
    for r in res["results"]:
        assert "prediction" in r
        assert r["prediction"]["ghi"] > 0
        assert r["prediction"]["unit"] == "kWh/m²/day"


if __name__ == "__main__":
    test_health()
    test_model_info()
    test_model_comparison()
    test_valid_prediction()
    test_prediction_year_warning()
    test_invalid_latitude()
    test_invalid_month()
    test_missing_clearsky()
    test_batch_prediction()
    print("ALL 9 BACKEND TESTS PASSED SUCCESSFULLY!")
