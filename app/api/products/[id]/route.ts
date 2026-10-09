import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminUserFromRequest } from '@/lib/auth-server';

// Public: GET /api/products/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    const row = result.rows[0];
    return NextResponse.json({
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
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// Protected: PUT /api/products/[id]
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
    const { name, category, price, description, available, is_popular, isPopular, image } = body;
    const popularVal = isPopular !== undefined ? isPopular : is_popular;

    const result = await query(
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
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// Protected: DELETE /api/products/[id]
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
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Product deleted successfully', id });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
