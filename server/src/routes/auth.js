import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { env } from '../config/env.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });

    const parsed = schema.parse(req.body);

    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [parsed.email],
    );

    const user = userResult.rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid Email' });
    }

    const validPassword = await bcrypt.compare(parsed.password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid Password' });
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.full_name,
        role: user.role_title,
      },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn },
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        position: user.position,
        role: user.role_title,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await pool.query('SELECT id, email, full_name, position, role_title FROM users WHERE id = $1', [req.user.sub]);
    if (!user.rows[0]) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user.rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
