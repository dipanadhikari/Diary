import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { pool } from '../db/pool.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const [entries, reminders] = await Promise.all([
      pool.query('SELECT * FROM daily_entries WHERE user_id = $1 ORDER BY entry_date ASC', [req.user.sub]),
      pool.query('SELECT * FROM reminders WHERE user_id = $1 ORDER BY created_at DESC', [req.user.sub]),
    ]);

    res.json({
      user: { id: req.user.sub },
      entries: entries.rows,
      reminders: reminders.rows,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/restore', requireAuth, async (req, res, next) => {
  try {
    const data = req.body || {};
    const entries = Array.isArray(data.entries) ? data.entries : [];
    const reminders = Array.isArray(data.reminders) ? data.reminders : [];

    for (const entry of entries) {
      await pool.query(
        `INSERT INTO daily_entries (user_id, entry_date, is_day_off, location, work_done, learned, plan_tomorrow)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (user_id, entry_date) DO UPDATE SET
           is_day_off = EXCLUDED.is_day_off,
           location = EXCLUDED.location,
           work_done = EXCLUDED.work_done,
           learned = EXCLUDED.learned,
           plan_tomorrow = EXCLUDED.plan_tomorrow`,
        [
          req.user.sub,
          entry.entry_date,
          Boolean(entry.is_day_off),
          entry.location || null,
          entry.work_done || null,
          entry.learned || null,
          entry.plan_tomorrow || null,
        ],
      );
    }

    for (const reminder of reminders) {
      await pool.query(
        `INSERT INTO reminders (user_id, title, deadline, priority, is_done, completed_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           deadline = EXCLUDED.deadline,
           priority = EXCLUDED.priority,
           is_done = EXCLUDED.is_done,
           completed_at = EXCLUDED.completed_at`,
        [
          req.user.sub,
          reminder.title,
          reminder.deadline,
          reminder.priority || 'medium',
          Boolean(reminder.is_done),
          reminder.completed_at || null,
        ],
      );
    }

    return res.json({ message: 'Backup restored successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
