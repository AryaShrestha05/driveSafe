import { MOCK_ANALYSIS } from './constants.mjs';

export const analyzeClip = async (file) => {
  const base = { filename: file.originalname, sizeBytes: file.size };
  const mlServiceUrl = process.env.ML_SERVICE_URL;

  // No ML service configured -> return mock data so the app still runs.
  if (!mlServiceUrl) {
    return { ...base, ...MOCK_ANALYSIS };
  }

  // Ask the Python ML service for the real prediction.
  const response = await fetch(`${mlServiceUrl}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clipPath: file.path }),
  });

  if (!response.ok) throw new Error(`ML service responded ${response.status}`);

  const prediction = await response.json(); // { safetyScore, events }
  return { ...base, ...prediction };
};
