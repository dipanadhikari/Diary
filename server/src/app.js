import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import authRoutes from './routes/auth.js';
import entryRoutes from './routes/entries.js';
import reminderRoutes from './routes/reminders.js';
import statsRoutes from './routes/stats.js';
import backupRoutes from './routes/backup.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/backup', backupRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
