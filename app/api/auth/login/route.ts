import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import { getJwtSecret } from '@/lib/jwt-secret';
import { ADMIN_COOKIE, ADMIN_SESSION_SECONDS, adminCookieOptions } from '@/lib/admin-cookie';

export async function POST(req: NextRequest) {
  const jwtSecret = getJwtSecret();
  if (!jwtSecret) {
    return NextResponse.json(
      { error: 'Login admin belum dikonfigurasi di server.' },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await query('SELECT * FROM admin_users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      jwtSecret,
      { expiresIn: ADMIN_SESSION_SECONDS, algorithm: 'HS256' }
    );

    // Token hanya dikirim sebagai cookie HttpOnly, tidak di body, jadi JavaScript halaman tidak bisa membacanya.
    const response = NextResponse.json({
      message: 'Authentication successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
    response.cookies.set(ADMIN_COOKIE, token, adminCookieOptions(ADMIN_SESSION_SECONDS));
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error during login' },
      { status: 500 }
    );
  }
}
