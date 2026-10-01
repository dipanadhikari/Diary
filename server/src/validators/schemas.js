import { z } from 'zod';

export const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const entrySchema = z.object({
  entryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  isDayOff: z.boolean().optional().default(false),
  location: z.string().max(200).nullable().optional(),
  workDone: z.string().max(5000).nullable().optional(),
  learned: z.string().max(5000).nullable().optional(),
  planTomorrow: z.string().max(5000).nullable().optional(),
});

export const reminderSchema = z.object({
  title: z.string().min(1).max(200),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  isDone: z.boolean().optional().default(false),
});

export const backupRestoreSchema = z.object({
  entries: z.array(z.any()).optional(),
  reminders: z.array(z.any()).optional(),
  user: z.any().optional(),
});
