import { query } from '../db/pool.js';

export async function getStats(userId, today) {
  const result = await query(
    `SELECT
      (SELECT COUNT(*) FROM daily_entries WHERE user_id = $1 AND entry_date <= $2 AND EXTRACT(ISODOW FROM entry_date) BETWEEN 1 AND 5) AS workday_count,
      (SELECT COUNT(*) FROM daily_entries WHERE user_id = $1 AND entry_date <= $2) AS days_logged,
      (SELECT COUNT(*) FROM reminders WHERE user_id = $1 AND is_done = false) AS open_reminders,
      (SELECT COUNT(*) FROM reminders WHERE user_id = $1 AND is_done = false AND deadline < $2) AS overdue_reminders`,
    [userId, today],
  );

  return result.rows[0];
}
