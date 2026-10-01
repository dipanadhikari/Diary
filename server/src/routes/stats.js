import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getStats } from '../services/stats.service.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const stats = await getStats(req.user.sub, today);
    return res.json(stats);
  } catch (error) {
    next(error);
  }
});

export default router;
