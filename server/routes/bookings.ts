import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Protected: GET /api/bookings (Security Fence - returns 401 when unauthorized)
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    let queryText = 'SELECT * FROM bookings';
    const params: any[] = [];

    if (status) {
      params.push(status);
      queryText += ' WHERE status = $1';
    }

    queryText += ' ORDER BY booking_date DESC, id DESC';

    const result = await pool.query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings from database' });
  }
});

// Public: POST /api/bookings (New reservation from customer)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { full_name, whatsapp, booking_date, booking_time, party_size, seating_area, notes } = req.body;

    if (!full_name || !whatsapp || !booking_date || !booking_time) {
      res.status(400).json({ error: 'Missing required reservation fields' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO bookings (full_name, whatsapp, booking_date, booking_time, party_size, seating_area, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING *`,
      [
        full_name,
        whatsapp,
        booking_date,
        booking_time,
        party_size || 2,
        seating_area || 'Indoor AC',
        notes || '',
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to submit reservation' });
  }
});

// Protected: PATCH /api/bookings/:id/status (Change status: confirmed, pending, cancelled, completed)
router.patch('/:id/status', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!status || !allowedStatuses.includes(status)) {
      res.status(400).json({
        error: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
      return;
    }

    const result = await pool.query(
      `UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// Protected: PUT /api/bookings/:id (Update entire booking)
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { full_name, whatsapp, booking_date, booking_time, party_size, seating_area, notes, status } = req.body;

    const result = await pool.query(
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
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Protected: DELETE /api/bookings/:id
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM bookings WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }
    res.json({ message: 'Booking deleted successfully', id });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

export default router;
