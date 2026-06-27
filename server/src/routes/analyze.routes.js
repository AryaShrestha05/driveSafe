import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { analyzeController } from '../controllers/analyze.controller.js';

const router = Router();

// POST /api/analyze — multipart/form-data with a single video field named "clip".
router.post('/', upload.single('clip'), analyzeController);

export { router as analyzeRoutes };
