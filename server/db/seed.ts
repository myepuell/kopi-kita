import { pool } from './index';
import bcrypt from 'bcryptjs';
import { MENU_ITEMS } from '../../lib/menu-data';

export async function seed() {
  const client = await pool.connect();
  try {
    console.log('--- Seeding Database for Kopi Kita ---');

    // 1. Seed Admin User
    const adminEmail = 'admin@kopikita.id';
    const existingAdmin = await client.query('SELECT id FROM admin_users WHERE email = $1', [adminEmail]);
    if (existingAdmin.rows.length === 0) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await client.query(
        'INSERT INTO admin_users (email, password_hash, name) VALUES ($1, $2, $3)',
        [adminEmail, passwordHash, 'Manager Kopi Kita']
      );
      console.log('✓ Seeded admin user: admin@kopikita.id / admin123');
    } else {
      console.log('• Admin user already exists');
    }

    // 2. Seed Products from MENU_ITEMS
    let productsInserted = 0;
    for (const item of MENU_ITEMS) {
      await client.query(
        `INSERT INTO products (id, name, category, price, description, available, is_popular, image)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           category = EXCLUDED.category,
           price = EXCLUDED.price,
           description = EXCLUDED.description,
           available = EXCLUDED.available,
           is_popular = EXCLUDED.is_popular,
           image = EXCLUDED.image,
           updated_at = CURRENT_TIMESTAMP`,
        [
          item.id,
          item.name,
          item.category,
          item.price,
          item.description,
          item.available,
          item.isPopular ?? false,
          item.image ?? null,
        ]
      );
      productsInserted++;
    }
    console.log(`✓ Seeded/Updated ${productsInserted} products`);

    // 3. Seed Bookings with at least 3 distinct statuses
    const existingBookings = await client.query('SELECT COUNT(*) FROM bookings');
    if (parseInt(existingBookings.rows[0].count, 10) === 0) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date(today);
      dayAfter.setDate(dayAfter.getDate() + 2);

      const sampleBookings = [
        {
          full_name: 'Budi Santoso',
          whatsapp: '081234567890',
          booking_date: tomorrow.toISOString().split('T')[0],
          booking_time: '14:00 WIB',
          party_size: 4,
          seating_area: 'Indoor AC',
          notes: 'Dekat colokan listrik untuk meeting',
          status: 'confirmed',
        },
        {
          full_name: 'Siti Rahmawati',
          whatsapp: '085712345678',
          booking_date: tomorrow.toISOString().split('T')[0],
          booking_time: '10:00 WIB',
          party_size: 2,
          seating_area: 'Outdoor Garden',
          notes: 'Perayaan ulang tahun kecil',
          status: 'pending',
        },
        {
          full_name: 'Dimas Pratama',
          whatsapp: '081398765432',
          booking_date: dayAfter.toISOString().split('T')[0],
          booking_time: '19:00 WIB',
          party_size: 6,
          seating_area: 'Smoking Area',
          notes: 'Reuni santai bersama teman kampus',
          status: 'cancelled',
        },
        {
          full_name: 'Jessica Tan',
          whatsapp: '081801234567',
          booking_date: today.toISOString().split('T')[0],
          booking_time: '12:00 WIB',
          party_size: 2,
          seating_area: 'Bar Counter',
          notes: 'Makan siang dan tasting kopi',
          status: 'completed',
        },
      ];

      for (const b of sampleBookings) {
        await client.query(
          `INSERT INTO bookings (full_name, whatsapp, booking_date, booking_time, party_size, seating_area, notes, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [b.full_name, b.whatsapp, b.booking_date, b.booking_time, b.party_size, b.seating_area, b.notes, b.status]
        );
      }
      console.log(`✓ Seeded ${sampleBookings.length} bookings across 4 statuses (confirmed, pending, cancelled, completed)`);
    } else {
      console.log(`• Bookings already populated (${existingBookings.rows[0].count} records)`);
    }

    console.log('Database seeding finished successfully.');
  } finally {
    client.release();
  }
}

if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  seed()
    .then(() => pool.end())
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}
