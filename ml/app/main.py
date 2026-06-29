from fastapi import FastAPI

from .schemas import PredictRequest, PredictResponse
from .services.predictor import predict

app = FastAPI(title="DriveSafe ML Service")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictResponse)
def predict_endpoint(req: PredictRequest):
    # FastAPI has already validated `req` against PredictRequest.
    return predict(req.clipPath)
