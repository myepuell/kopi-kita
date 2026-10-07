import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Public: GET /api/products
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, available } = req.query;
    let queryText = 'SELECT * FROM products';
    const params: any[] = [];
    const conditions: string[] = [];

    if (category && category !== 'All') {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    if (available !== undefined) {
      params.push(available === 'true');
      conditions.push(`available = $${params.length}`);
    }

    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }

    queryText += ' ORDER BY category ASC, name ASC';

    const result = await pool.query(queryText, params);
    
    // Map database snake_case to frontend camelCase if needed, but include all fields
    const items = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      price: Number(row.price),
      description: row.description,
      available: row.available,
      isPopular: row.is_popular,
      is_popular: row.is_popular,
      image: row.image,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    res.json(items);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products from database' });
  }
});

// Public: GET /api/products/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    const row = result.rows[0];
    res.json({
      id: row.id,
      name: row.name,
      category: row.category,
      price: Number(row.price),
      description: row.description,
      available: row.available,
      isPopular: row.is_popular,
      is_popular: row.is_popular,
      image: row.image,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Protected: POST /api/products
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id, name, category, price, description, available = true, is_popular = false, isPopular, image } = req.body;
    if (!name || !category || price === undefined) {
      res.status(400).json({ error: 'Missing required fields: name, category, and price are required' });
      return;
    }

    const productId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const popularVal = isPopular !== undefined ? isPopular : is_popular;

    const result = await pool.query(
      `INSERT INTO products (id, name, category, price, description, available, is_popular, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [productId, name, category, price, description || '', available, popularVal, image || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error.code === '23505') {
      res.status(409).json({ error: 'Product with this ID or name already exists' });
      return;
    }
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Protected: PUT /api/products/:id
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, price, description, available, is_popular, isPopular, image } = req.body;
    const popularVal = isPopular !== undefined ? isPopular : is_popular;

    const result = await pool.query(
      `UPDATE products SET
         name = COALESCE($1, name),
         category = COALESCE($2, category),
         price = COALESCE($3, price),
         description = COALESCE($4, description),
         available = COALESCE($5, available),
         is_popular = COALESCE($6, is_popular),
         image = COALESCE($7, image),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [name, category, price, description, available, popularVal, image, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Protected: DELETE /api/products/:id
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted successfully', id });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
