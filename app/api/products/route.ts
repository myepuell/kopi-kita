import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminUserFromRequest } from '@/lib/auth-server';

// Public: GET /api/products
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const available = searchParams.get('available');

    let queryText = 'SELECT * FROM products';
    const params: any[] = [];
    const conditions: string[] = [];

    if (category && category !== 'All') {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    if (available !== null && available !== undefined) {
      params.push(available === 'true');
      conditions.push(`available = $${params.length}`);
    }

    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }

    queryText += ' ORDER BY category ASC, name ASC';

    const result = await query(queryText, params);

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

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products from database' },
      { status: 500 }
    );
  }
}

// Protected: POST /api/products
export async function POST(req: NextRequest) {
  const admin = getAdminUserFromRequest(req);
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized: Admin authentication token required' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { id, name, category, price, description, available = true, is_popular = false, isPopular, image } = body;

    if (!name || !category || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, and price are required' },
        { status: 400 }
      );
    }

    const productId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const popularVal = isPopular !== undefined ? isPopular : is_popular;

    const result = await query(
      `INSERT INTO products (id, name, category, price, description, available, is_popular, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [productId, name, category, price, description || '', available, popularVal, image || null]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Product with this ID or name already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
