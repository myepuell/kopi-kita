import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products';
import bookingsRouter from './routes/bookings';
import authRouter from './routes/auth';
import { pool } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for frontend
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/auth', authRouter);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT NOW() as current_time, count(*) as products_count FROM products');
    res.json({
      status: 'healthy',
      postgres: 'connected',
      time: dbRes.rows[0].current_time,
      products_count: dbRes.rows[0].products_count,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`☕ Kopi Kita Backend API running on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📦 Public Products: http://localhost:${PORT}/api/products`);
  console.log(`🔒 Protected Bookings: http://localhost:${PORT}/api/bookings`);
  console.log(`===============================================`);
});

export default app;
