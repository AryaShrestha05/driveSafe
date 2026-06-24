import { labelOf, formatTime } from '../labels.js';

// Horizontal timeline with a marker per event. Clicking a marker seeks the video.
export default function EventTimeline({ events, durationSec, onSeek, activeId }) {
  return (
    <div className="timeline">
      <div className="timeline__track">
        {events.map((e) => {
          const left = `${(e.tStart / durationSec) * 100}%`;
          const width = `${Math.max(((e.tEnd - e.tStart) / durationSec) * 100, 1.5)}%`;
          const { color } = labelOf(e.label);
          return (
            <button
              key={e.id}
              className={`timeline__marker ${activeId === e.id ? 'is-active' : ''}`}
              style={{ left, width, background: color }}
              title={`${labelOf(e.label).text} @ ${formatTime(e.tStart)}`}
              onClick={() => onSeek(e.tStart, e.id)}
            />
          );
        })}
      </div>
      <div className="timeline__scale">
        <span>0:00</span>
        <span>{formatTime(durationSec)}</span>
      </div>
    </div>
  );
}
