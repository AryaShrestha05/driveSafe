// All backend communication lives here, separate from UI components.
// Components call these functions instead of using fetch directly.

export async function analyzeClip(file) {
  const formData = new FormData();
  formData.append('clip', file); // field name must match upload.single('clip')

  const res = await fetch('/api/analyze', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return res.json();
}
