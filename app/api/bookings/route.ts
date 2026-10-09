import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminUserFromRequest } from '@/lib/auth-server';

// Protected: GET /api/bookings (Security Fence - returns 401 when unauthorized)
export async function GET(req: NextRequest) {
  const admin = getAdminUserFromRequest(req);
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized: Admin authentication token required to access bookings' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let queryText = 'SELECT * FROM bookings';
    const params: any[] = [];

    if (status) {
      params.push(status);
      queryText += ' WHERE status = $1';
    }

    queryText += ' ORDER BY booking_date DESC, id DESC';

    const result = await query(queryText, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings from database' },
      { status: 500 }
    );
  }
}

// Public: POST /api/bookings (New reservation with strict server-side validation)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, whatsapp, booking_date, booking_time, party_size, seating_area, notes } = body;

    // 1. Validasi field wajib
    if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
      return NextResponse.json(
        { error: 'Nama lengkap wajib diisi.' },
        { status: 400 }
      );
    }

    if (full_name.trim().length < 3) {
      return NextResponse.json(
        { error: 'Nama lengkap minimal 3 karakter.' },
        { status: 400 }
      );
    }

    // 2. Validasi nomor WhatsApp: harus angka dan minimal 10 digit
    if (!whatsapp || typeof whatsapp !== 'string' || !whatsapp.trim()) {
      return NextResponse.json(
        { error: 'Nomor WhatsApp wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanWhatsapp = whatsapp.trim();
    if (!/^\d+$/.test(cleanWhatsapp)) {
      return NextResponse.json(
        { error: 'Nomor WhatsApp hanya boleh berisi angka (tidak boleh mengandung huruf atau simbol).' },
        { status: 400 }
      );
    }

    if (cleanWhatsapp.length < 10) {
      return NextResponse.json(
        { error: 'Nomor WhatsApp minimal 10 digit.' },
        { status: 400 }
      );
    }

    // 3. Validasi tanggal: tidak boleh tanggal lampau
    if (!booking_date || typeof booking_date !== 'string') {
      return NextResponse.json(
        { error: 'Tanggal reservasi wajib dipilih.' },
        { status: 400 }
      );
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (booking_date < todayStr) {
      return NextResponse.json(
        { error: 'Tanggal reservasi tidak boleh tanggal lampau. Pilih hari ini atau mendatang.' },
        { status: 400 }
      );
    }

    // 4. Validasi waktu
    if (!booking_time || typeof booking_time !== 'string') {
      return NextResponse.json(
        { error: 'Waktu kedatangan wajib dipilih.' },
        { status: 400 }
      );
    }

    // 5. Validasi party_size (Sneaky curl defense: rejects 999 or out-of-range party sizes)
    const parsedPartySize = Number(party_size);
    if (
      party_size === undefined ||
      party_size === null ||
      isNaN(parsedPartySize) ||
      !Number.isInteger(parsedPartySize) ||
      parsedPartySize < 1 ||
      parsedPartySize > 8
    ) {
      return NextResponse.json(
        {
          error: `Kapasitas meja tidak valid (party_size: ${party_size}). Maksimal reservasi per meja adalah 1 sampai 8 orang. Untuk grup di atas 8 orang, silakan hubungi tim kami via WhatsApp.`,
        },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO bookings (full_name, whatsapp, booking_date, booking_time, party_size, seating_area, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING *`,
      [
        full_name.trim(),
        cleanWhatsapp,
        booking_date,
        booking_time,
        parsedPartySize,
        seating_area || 'Indoor AC',
        notes || '',
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to submit reservation' },
      { status: 500 }
    );
  }
}
