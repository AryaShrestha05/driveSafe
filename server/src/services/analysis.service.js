// Business logic, decoupled from Express (no req/res here).
// Returns mock data for now. Later, this is where the call to the
// PyTorch/FastAPI model goes — and nothing else in the app has to change.

/**
 * @param {{ originalname: string, size: number, path: string }} file
 * @returns {Promise<object>} analysis result
 */
export async function analyzeClip(file) {
  return {
    filename: file.originalname,
    sizeBytes: file.size,
    safetyScore: 72,
    events: [
      { timestamp: 14.2, label: 'aggressive_braking' },
      { timestamp: 32.5, label: 'sharp_lane_change' },
      { timestamp: 48.0, label: 'tailgating' },
    ],
  };
}
