import express from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { query } from '../db/pool.js';
import {
  getEntryByDate,
  getPreviousPlan,
  upsertEntry,
  deleteEntry,
  listEntriesByMonth,
  searchEntries,
} from '../services/entries.service.js';

const router = express.Router();

const isWorkday = (date) => {
  const day = new Date(date + 'T00:00:00');
  const iso = day.getDay();
  return iso >= 1 && iso <= 5;
};

const validDateRange = (value) => {
  const min = new Date('2026-10-12T00:00:00Z');
  const max = new Date('2027-05-14T00:00:00Z');
  const current = new Date(value + 'T00:00:00Z');
  return current >= min && current <= max && isWorkday(value);
};

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { month, q } = req.query;

    if (q) {
      const results = await searchEntries(req.user.sub, String(q));
      return res.json({ entries: results });
    }

    if (month) {
      const results = await listEntriesByMonth(req.user.sub, String(month));
      return res.json({ entries: results });
    }

    const results = await query(
      `SELECT * FROM daily_entries WHERE user_id = $1 ORDER BY entry_date DESC LIMIT 30`,
      [req.user.sub],
    );

    return res.json({ entries: results.rows });
  } catch (error) {
    next(error);
  }
});

router.get('/:date', requireAuth, async (req, res, next) => {
  try {
    const { date } = req.params;

    if (!validDateRange(date)) {
      return res.status(422).json({ message: 'Date is outside the valid workday range' });
    }

    const entry = await getEntryByDate(req.user.sub, date);
    const previousPlan = await getPreviousPlan(req.user.sub, date);

    return res.json({
      entry,
      previous_plan: previousPlan,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:date', requireAuth, async (req, res, next) => {
  try {
    const { date } = req.params;
    const payload = {
      entryDate: date,
      isDayOff: Boolean(req.body.isDayOff),
      location: req.body.location ?? null,
      workDone: req.body.workDone ?? null,
      learned: req.body.learned ?? null,
      planTomorrow: req.body.planTomorrow ?? null,
    };

    if (!validDateRange(date)) {
      return res.status(422).json({ message: 'Date is outside the valid workday range' });
    }

    const entry = await upsertEntry(req.user.sub, payload);
    return res.json({ entry });
  } catch (error) {
    next(error);
  }
});

router.delete('/:date', requireAuth, async (req, res, next) => {
  try {
    const { date } = req.params;
    if (!validDateRange(date)) {
      return res.status(422).json({ message: 'Date is outside the valid workday range' });
    }

    await deleteEntry(req.user.sub, date);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
