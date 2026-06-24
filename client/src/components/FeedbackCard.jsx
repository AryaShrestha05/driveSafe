import { labelOf, formatTime } from '../labels.js';

// RAG-generated explanation + tips, shown below the timeline.
export default function FeedbackCard({ feedback, onSeek, activeId }) {
  if (!feedback) return null;
  return (
    <div className="feedback">
      <h3 className="feedback__summary">{feedback.summary}</h3>
      <ul className="feedback__list">
        {feedback.items.map((item) => {
          const { text, color } = labelOf(item.label);
          return (
            <li
              key={item.eventId}
              className={`feedback__item ${activeId === item.eventId ? 'is-active' : ''}`}
            >
              <button className="feedback__head" onClick={() => onSeek(item.timestamp, item.eventId)}>
                <span className="feedback__dot" style={{ background: color }} />
                <span className="feedback__label">{text}</span>
                <span className="feedback__time">{formatTime(item.timestamp)}</span>
              </button>
              <p className="feedback__why">{item.why}</p>
              <p className="feedback__tip">💡 {item.tip}</p>
              <p className="feedback__source">Source: {item.source}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
