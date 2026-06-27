import express from 'express';
import cors from 'cors';
import { analyzeRoutes } from './routes/analyze.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Builds and configures the Express app, but does NOT start listening.
// Keeping this separate from index.js makes the app easy to test and reuse.
export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health check — handy for confirming the server is up.
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  // Feature routes.
  app.use('/api/analyze', analyzeRoutes);

  // Error handler must be registered last.
  app.use(errorHandler);

  return app;
}
