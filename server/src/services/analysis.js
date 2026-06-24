// Driving-behavior analysis.
//
// Today this returns deterministic-ish MOCK data so the whole app runs without
// the ML service. When your FastAPI + PyTorch service is up, set ML_SERVICE_URL
// and replace the mock branch below with a real request.

const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

const BEHAVIORS = ['aggressive_braking', 'sharp_lane_change', 'tailgating', 'smooth_driving'];

/**
 * @param {string} clipPath  Absolute path to the uploaded video on disk.
 * @returns {Promise<{safetyScore:number, durationSec:number, events:Array}>}
 */
export async function analyzeClip(clipPath) {
  if (ML_SERVICE_URL) {
    // TODO(ml): call the FastAPI service. Expected contract:
    //   POST {ML_SERVICE_URL}/predict  (the video, or an S3 key)
    //   -> { safetyScore, durationSec, events: [{ tStart, tEnd, label, confidence }] }
    const res = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clipPath }),
    });
    if (!res.ok) throw new Error(`ML service error: ${res.status}`);
    return res.json();
  }

  return mockAnalysis();
}

function mockAnalysis() {
  const events = [
    { id: 'e1', tStart: 14.2, tEnd: 15.0, label: 'aggressive_braking', confidence: 0.91 },
    { id: 'e2', tStart: 32.5, tEnd: 34.1, label: 'sharp_lane_change', confidence: 0.78 },
    { id: 'e3', tStart: 48.0, tEnd: 55.4, label: 'tailgating', confidence: 0.84 },
  ];

  // Simple score: start at 100, dock points per flagged (non-smooth) event.
  const penalty = events.reduce((sum, e) => sum + (e.label === 'smooth_driving' ? 0 : 12 * e.confidence), 0);
  const safetyScore = Math.max(0, Math.round(100 - penalty));

  return { safetyScore, durationSec: 60, events, behaviors: BEHAVIORS };
}
