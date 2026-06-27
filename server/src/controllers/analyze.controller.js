import { analyzeClip } from '../services/analysis.service.js';

// Controllers translate HTTP <-> business logic:
// read the request, call a service, shape the response.
export async function analyzeController(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video uploaded (expected field "clip").' });
    }

    const result = await analyzeClip(req.file);
    res.json(result);
  } catch (err) {
    next(err); // hand off to errorHandler
  }
}
