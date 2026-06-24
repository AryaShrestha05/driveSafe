import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeClip } from '../services/analysis.js';
import { explainEvents } from '../services/rag.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '..', '..', 'uploads');

// TODO(storage): swap diskStorage for multer-s3 when STORAGE_DRIVER=s3.
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('video/')) return cb(null, true);
    cb(new Error('Only video files are accepted.'));
  },
});

const router = Router();

// POST /api/analyze  (multipart/form-data, field name: "clip")
router.post('/', upload.single('clip'), async (req, res, next) => {
  try {
    if (!req.file) {
      const err = new Error('No video file uploaded (expected field "clip").');
      err.status = 400;
      throw err;
    }

    // 1. Run the dashcam clip through the PyTorch model (mock for now).
    const analysis = await analyzeClip(req.file.path);

    // 2. Turn the flagged events into human-readable, sourced feedback via RAG.
    const feedback = await explainEvents(analysis);

    res.json({ ...analysis, feedback });
  } catch (err) {
    next(err);
  }
});

export default router;
