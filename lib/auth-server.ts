import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '@/lib/jwt-secret';

export interface AdminPayload {
  id: number;
  email: string;
  name: string;
}

export function getAdminUserFromRequest(req: NextRequest): AdminPayload | null {
  const authHeader = req.headers.get('authorization');
  let token: string | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    const cookieToken = req.cookies.get('admin_token')?.value;
    if (cookieToken) {
      token = cookieToken;
    }
  }

  if (!token) return null;

  const secret = getJwtSecret();
  if (!secret) return null;

  try {
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }) as AdminPayload;
    return decoded;
  } catch {
    return null;
  }
}
