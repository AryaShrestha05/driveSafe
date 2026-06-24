// Display metadata for each behavior class.

export const LABELS = {
  aggressive_braking: { text: 'Aggressive braking', color: '#ef4444' },
  sharp_lane_change: { text: 'Sharp lane change', color: '#f59e0b' },
  tailgating: { text: 'Tailgating', color: '#eab308' },
  smooth_driving: { text: 'Smooth driving', color: '#22c55e' },
};

export function labelOf(key) {
  return LABELS[key] || { text: key, color: '#94a3b8' };
}

export function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
