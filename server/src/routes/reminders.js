import express from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import {
  listReminders,
  createReminder,
  updateReminder,
  deleteReminder,
} from '../services/reminders.service.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    const reminders = await listReminders(req.user.sub, status ? String(status) : undefined, priority ? String(priority) : undefined);
    return res.json({ reminders });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const payload = z.object({
      title: z.string().min(1).max(200),
      deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      priority: z.enum(['high', 'medium', 'low']).default('medium'),
      isDone: z.boolean().optional().default(false),
    }).parse(req.body);

    const reminder = await createReminder(req.user.sub, payload);
    return res.status(201).json({ reminder });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const payload = z.object({
      title: z.string().min(1).max(200).optional(),
      deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      priority: z.enum(['high', 'medium', 'low']).optional(),
      isDone: z.boolean().optional(),
    }).partial().parse(req.body);

    const reminder = await updateReminder(req.user.sub, req.params.id, payload);
    return res.json({ reminder });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await deleteReminder(req.user.sub, req.params.id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
