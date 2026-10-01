import { query } from '../db/pool.js';

export async function getEntryByDate(userId, date) {
  const result = await query(
    `SELECT * FROM daily_entries WHERE user_id = $1 AND entry_date = $2`,
    [userId, date],
  );

  return result.rows[0] || null;
}

export async function getPreviousPlan(userId, date) {
  const result = await query(
    `SELECT plan_tomorrow
     FROM daily_entries
     WHERE user_id = $1 AND entry_date < $2 AND is_day_off = false
     ORDER BY entry_date DESC
     LIMIT 1`,
    [userId, date],
  );

  return result.rows[0]?.plan_tomorrow || null;
}

export async function upsertEntry(userId, payload) {
  const {
    entryDate,
    isDayOff,
    location,
    workDone,
    learned,
    planTomorrow,
  } = payload;

  const result = await query(
    `INSERT INTO daily_entries (user_id, entry_date, is_day_off, location, work_done, learned, plan_tomorrow, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, now())
     ON CONFLICT (user_id, entry_date)
     DO UPDATE SET
       is_day_off = EXCLUDED.is_day_off,
       location = EXCLUDED.location,
       work_done = EXCLUDED.work_done,
       learned = EXCLUDED.learned,
       plan_tomorrow = EXCLUDED.plan_tomorrow,
       updated_at = now()
     RETURNING *`,
    [userId, entryDate, isDayOff, location || null, workDone || null, learned || null, planTomorrow || null],
  );

  return result.rows[0];
}

export async function deleteEntry(userId, date) {
  await query('DELETE FROM daily_entries WHERE user_id = $1 AND entry_date = $2', [userId, date]);
}

export async function listEntriesByMonth(userId, month) {
  const result = await query(
    `SELECT *
     FROM daily_entries
     WHERE user_id = $1 AND to_char(entry_date, 'YYYY-MM') = $2
     ORDER BY entry_date ASC`,
    [userId, month],
  );

  return result.rows;
}

export async function searchEntries(userId, queryString) {
  const result = await query(
    `SELECT *
     FROM daily_entries
     WHERE user_id = $1
       AND to_tsvector('english', coalesce(work_done,'') || ' ' || coalesce(learned,'') || ' ' || coalesce(plan_tomorrow,'') || ' ' || coalesce(location,''))
         @@ plainto_tsquery('english', $2)
     ORDER BY entry_date DESC`,
    [userId, queryString],
  );

  return result.rows;
}
