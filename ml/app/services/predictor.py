import os

# The "model". Mock for now — this is the single file you'll swap for real
# PyTorch inference later. Everything else (routes, schemas, Express) stays put.

LABELS = ["aggressive_braking", "sharp_lane_change", "tailgating", "smooth_driving"]


def predict(clip_path: str) -> dict:
    # Prove we actually received a real file by looking at it on disk.
    size = os.path.getsize(clip_path) if os.path.exists(clip_path) else 0

    # Fake-but-deterministic score derived from the file, so it isn't always 72.
    # (Real model will replace this with an actual prediction.)
    safety_score = 60 + (size % 40)

    events = [
        {"timestamp": 14.2, "label": "aggressive_braking"},
        {"timestamp": 32.5, "label": "sharp_lane_change"},
    ]

    return {"safetyScore": safety_score, "events": events}
