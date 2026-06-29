from pydantic import BaseModel

# Request/response "contracts". FastAPI validates incoming JSON against these
# automatically and rejects anything that doesn't match.


class PredictRequest(BaseModel):
    clipPath: str  # absolute path to the uploaded video (shared local disk for now)


class Event(BaseModel):
    timestamp: float
    label: str


class PredictResponse(BaseModel):
    safetyScore: int
    events: list[Event]
