export default function SafetyScore({ score }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444';
  // SVG ring: circumference for r=52.
  const C = 2 * Math.PI * 52;
  const offset = C * (1 - score / 100);

  return (
    <div className="score">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r="52" fill="none" stroke="#1e293b" strokeWidth="12" />
        <circle
          cx="65"
          cy="65"
          r="52"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          transform="rotate(-90 65 65)"
        />
        <text x="65" y="62" textAnchor="middle" className="score__num" fill={color}>
          {score}
        </text>
        <text x="65" y="82" textAnchor="middle" className="score__label">
          / 100
        </text>
      </svg>
      <span className="score__caption">Safety score</span>
    </div>
  );
}
