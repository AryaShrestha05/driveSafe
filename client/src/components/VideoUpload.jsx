import { useRef, useState } from 'react';

export default function VideoUpload({ onAnalyze, loading }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);

  function handleFile(file) {
    if (!file) return;
    setFileName(file.name);
    onAnalyze(file);
  }

  return (
    <div
      className={`upload ${dragOver ? 'upload--drag' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files[0]);
      }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        hidden
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <p className="upload__title">{loading ? 'Analyzing clip…' : 'Drop a dashcam clip or click to upload'}</p>
      <p className="upload__hint">{fileName || 'MP4 / MOV / WebM · up to 200 MB'}</p>
    </div>
  );
}
