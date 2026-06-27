import { useState } from 'react';
import { analyzeClip } from '../api/client.js';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await analyzeClip(file);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="video/*"
        onChange={(event) => setFile(event.target.files[0])}
      />
      <button type="submit" disabled={!file || loading}>
        {loading ? 'Analyzing…' : 'Analyze'}
      </button>

      {error && <p>Error: {error}</p>}
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </form>
  );
}
