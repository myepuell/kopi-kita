import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminUserFromRequest } from '@/lib/auth-server';

// Protected: PUT /api/bookings/[id]
export async function PUT(
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
    const { full_name, whatsapp, booking_date, booking_time, party_size, seating_area, notes, status } = body;

    const result = await query(
      `UPDATE bookings SET
         full_name = COALESCE($1, full_name),
         whatsapp = COALESCE($2, whatsapp),
         booking_date = COALESCE($3, booking_date),
         booking_time = COALESCE($4, booking_time),
         party_size = COALESCE($5, party_size),
         seating_area = COALESCE($6, seating_area),
         notes = COALESCE($7, notes),
         status = COALESCE($8, status),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [full_name, whatsapp, booking_date, booking_time, party_size, seating_area, notes, status, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

// Protected: DELETE /api/bookings/[id]
export async function DELETE(
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
    const result = await query('DELETE FROM bookings WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Booking deleted successfully', id });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
