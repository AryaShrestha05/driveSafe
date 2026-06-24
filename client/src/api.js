// Thin API client. Uses relative /api paths, which Vite proxies to Express in dev.

export async function analyzeClip(file) {
  const form = new FormData();
  form.append('clip', file);

  const res = await fetch('/api/analyze', { method: 'POST', body: form });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({}));
    throw new Error(error || `Analysis failed (${res.status})`);
  }
  return res.json();
}
