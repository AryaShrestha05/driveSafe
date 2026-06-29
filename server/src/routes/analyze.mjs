import { Router } from 'express';
import { upload } from '../utils/middlewares.mjs';
import { analyzeClip } from '../utils/helpers.mjs';

const router = Router();

router.post('/api/analyze', upload.single('clip'), async (req, res) => {
  if (!req.file) return res.status(400).send({ msg: 'No video uploaded (field "clip").' });

  try {
    const result = await analyzeClip(req.file);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default router;
