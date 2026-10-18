import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../../lib/jwt-secret';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.admin_token) {
    token = req.cookies.admin_token;
  }

  if (!token) {
    res.status(401).json({
      error: 'Unauthorized: Admin authentication token required to access this resource',
    });
    return;
  }

  const secret = getJwtSecret();
  if (!secret) {
    res.status(503).json({ error: 'Login admin belum dikonfigurasi di server.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }) as { id: number; email: string; name: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      error: 'Unauthorized: Invalid or expired authentication token',
    });
  }
}
