# DriveSafe — Driver Behavior Classifier

Upload a short dashcam clip → classify driving behavior (aggressive braking, sharp
lane changes, tailgating, smooth driving) → get a safety score, timestamped events,
and a RAG-generated explanation with improvement tips.

## Architecture

```
React (Vite)  ──upload──▶  Express  ──▶  FastAPI + PyTorch  (frame classification)
   client/                  server/         ml/  (not scaffolded yet)
       ▲                       │
       └──── score + events ───┤──▶  RAG pipeline (vector DB + Claude)  (seam stubbed)
             + feedback card
```

This repo currently scaffolds **client** (React/Vite) and **server** (Express).
The Express server returns **mock analysis data** so the full UI runs end-to-end
today. Search for `TODO(ml)` and `TODO(rag)` for the integration seams.

## Run it

```bash
# Terminal 1 — backend on :4000
cd server && npm install && npm run dev

# Terminal 2 — frontend on :5173 (proxies /api to :4000)
cd client && npm install && npm run dev
```

Open http://localhost:5173.

## Next steps

1. Stand up `ml/` as a FastAPI service serving the PyTorch model
   (ResNet/EfficientNet backbone + LSTM or SlowFast). Point `ML_SERVICE_URL` at it.
2. Replace the mock in `server/src/services/analysis.js` with a real call.
3. Build the RAG knowledge base (NHTSA reports, defensive-driving manuals, telematics
   research) and implement `server/src/services/rag.js`.
