import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { getJwtSecret } from '../../lib/jwt-secret';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const jwtSecret = getJwtSecret();
  if (!jwtSecret) {
    res.status(503).json({ error: 'Login admin belum dikonfigurasi di server.' });
    return;
  }

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const result = await pool.query('SELECT * FROM admin_users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      jwtSecret,
      { expiresIn: '7d', algorithm: 'HS256' }
    );

    res.json({
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// GET /api/auth/me (Protected)
router.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

export default router;
