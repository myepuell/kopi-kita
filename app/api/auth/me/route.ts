import { NextRequest, NextResponse } from 'next/server';
import { getAdminUserFromRequest } from '@/lib/auth-server';

export async function GET(req: NextRequest) {
  const admin = getAdminUserFromRequest(req);
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized: Admin authentication token required' },
      { status: 401 }
    );
  }

  return NextResponse.json({ user: admin });
}
