import { query } from '../db/pool.js';

export async function listReminders(userId, status, priority) {
  let sql = 'SELECT * FROM reminders WHERE user_id = $1';
  const params = [userId];

  if (status) {
    if (status === 'open') {
      sql += ' AND is_done = false';
    } else if (status === 'done') {
      sql += ' AND is_done = true';
    }
  }

  if (priority) {
    params.push(priority);
    sql += ` AND priority = $${params.length}`;
  }

  sql += ' ORDER BY deadline ASC, created_at DESC';

  const result = await query(sql, params);
  return result.rows;
}

export async function createReminder(userId, payload) {
  const { title, deadline, priority } = payload;
  const result = await query(
    `INSERT INTO reminders (user_id, title, deadline, priority)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, title, deadline, priority],
  );

  return result.rows[0];
}

export async function updateReminder(userId, reminderId, payload) {
  const { title, deadline, priority, isDone } = payload;
  const result = await query(
    `UPDATE reminders
     SET title = COALESCE($2, title),
         deadline = COALESCE($3, deadline),
         priority = COALESCE($4, priority),
         is_done = COALESCE($5, is_done),
         completed_at = CASE
           WHEN $5 = true AND is_done = false THEN now()
           WHEN $5 = false AND is_done = true THEN NULL
           ELSE completed_at
         END,
         updated_at = now()
     WHERE user_id = $1 AND id = $6
     RETURNING *`,
    [userId, title ?? null, deadline ?? null, priority ?? null, isDone ?? null, reminderId],
  );

  return result.rows[0];
}

export async function deleteReminder(userId, reminderId) {
  await query('DELETE FROM reminders WHERE user_id = $1 AND id = $2', [userId, reminderId]);
}
