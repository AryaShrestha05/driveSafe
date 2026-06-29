# DriveSafe — Driver Behavior Classifier

Upload a short dashcam clip → classify driving behavior (aggressive braking, sharp
lane changes, tailgating, smooth driving) → get a safety score and timestamped
events. (Planned: a RAG-generated explanation with improvement tips.)

## Architecture

Three services that talk to each other:

```
React (Vite)  ──upload──▶  Express  ──▶  FastAPI (Python)
  client/                  server/         ml/
   :5173                    :4000          :8000
     ▲                        │              │
     └──── score + events ────┘              └─ runs the model (mock for now,
                                                PyTorch later)
```

- **client/** — React + Vite. An upload form that posts a video and shows the JSON result.
- **server/** — Express (`.mjs`). Handles the upload, then asks the ML service for a
  prediction. If `ML_SERVICE_URL` is not set, it returns mock data so the app still runs.
- **ml/** — FastAPI service. `/predict` returns a score + events. The "model" is a
  mock today; replacing it with real PyTorch is the next milestone.

## Prerequisites

- Node.js (for client + server)
- Python 3 (for the ml service)

## First-time setup

```bash
# server
cd server && npm install

# client
cd client && npm install

# ml (creates a private Python environment + installs deps)
cd ml
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

Then create the server's env file:

```bash
cd server
cp .env.example .env   # if .env.example is missing, just create .env with the lines below
```

`server/.env` should contain:

```
PORT=4000
NODE_ENV=development
ML_SERVICE_URL=http://localhost:8000
```

> `.env` and `ml/.venv/` are gitignored — they never get committed.

## Run it (3 terminals)

```bash
# Terminal 1 — Express API on :4000 (nodemon auto-restarts on changes)
cd server && npm run start:dev

# Terminal 2 — React app on :5173 (proxies /api to :4000)
cd client && npm run dev

# Terminal 3 — FastAPI ML service on :8000
cd ml && .venv/bin/uvicorn app.main:app --port 8000
```

Then open **http://localhost:5173**, pick a video, and click **Analyze**.

To stop everything: close the terminals, or run
`pkill -f nodemon; pkill -f vite; pkill -f uvicorn`.

## Test things without the browser (curl)

```bash
# Express health
curl localhost:4000/api/health

# FastAPI health
curl localhost:8000/health

# Full flow: upload a video through the React proxy (5173 → 4000 → 8000)
curl -X POST -F "clip=@/path/to/video.mp4;type=video/mp4" localhost:5173/api/analyze

# Ask the ML service directly for a prediction
curl -X POST localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"clipPath":"/some/path.mp4"}'
```

## ML learning experiments

A standalone PyTorch demo (not part of the running app) that classifies a single
image with a pretrained ResNet18:

```bash
cd ml
.venv/bin/python classify_image.py
```

Expected output (the bundled sample is a Samoyed dog):

```
Top 5 guesses for sample.jpg:
  Samoyed        88.5%
  Arctic fox      4.6%
  ...
```

## Roadmap

- [x] Step 1 — PyTorch installed & running
- [x] Step 2 — pretrained model classifies a single image (`ml/classify_image.py`)
- [ ] Step 3 — pull a single frame out of an uploaded video
- [ ] Step 4 — wire the real model into `ml/app/services/predictor.py`
- [ ] Later — fine-tune for driving behaviors; add the RAG explanation layer
