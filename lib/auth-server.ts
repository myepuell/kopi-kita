import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_kopi_kita_jwt_key_2026';

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

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminPayload;
    return decoded;
  } catch {
    return null;
  }
}
