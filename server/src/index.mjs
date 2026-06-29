import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import analyzeRouter from './routes/analyze.mjs';

const app = express();

app.use(cors());
app.use(express.json());

app.use(analyzeRouter);

app.get('/api/health', (req, res) => {
  res.send({ status: 'ok' });
});

// Catches errors thrown in middleware (like multer rejecting a non-video),
// which happen before a route's own try/catch can run.
app.use((err, req, res, next) => {
  res.status(400).send({ message: err.message });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
