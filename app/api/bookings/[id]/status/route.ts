import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminUserFromRequest } from '@/lib/auth-server';

// Protected: PATCH /api/bookings/[id]/status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = getAdminUserFromRequest(req);
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized: Admin authentication token required' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const allowedStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      { error: 'Failed to update booking status' },
      { status: 500 }
    );
  }
}
