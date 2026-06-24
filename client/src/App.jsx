import { useRef, useState } from 'react';
import VideoUpload from './components/VideoUpload.jsx';
import SafetyScore from './components/SafetyScore.jsx';
import EventTimeline from './components/EventTimeline.jsx';
import FeedbackCard from './components/FeedbackCard.jsx';
import { analyzeClip } from './api.js';

export default function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeId, setActiveId] = useState(null);
  const videoRef = useRef(null);

  async function handleAnalyze(file) {
    setError('');
    setResult(null);
    setActiveId(null);
    setVideoUrl(URL.createObjectURL(file));
    setLoading(true);
    try {
      setResult(await analyzeClip(file));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function seekTo(time, eventId) {
    setActiveId(eventId);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play().catch(() => {});
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>DriveSafe</h1>
        <p>Dashcam driver-behavior classifier</p>
      </header>

      <VideoUpload onAnalyze={handleAnalyze} loading={loading} />
      {error && <p className="app__error">{error}</p>}

      {videoUrl && (
        <section className="player">
          <video ref={videoRef} src={videoUrl} controls className="player__video" />
          {result && (
            <>
              <div className="player__top">
                <SafetyScore score={result.safetyScore} />
                <EventTimeline
                  events={result.events}
                  durationSec={result.durationSec}
                  onSeek={seekTo}
                  activeId={activeId}
                />
              </div>
              <FeedbackCard feedback={result.feedback} onSeek={seekTo} activeId={activeId} />
            </>
          )}
        </section>
      )}
    </div>
  );
}
