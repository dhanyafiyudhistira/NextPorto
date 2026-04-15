import { NextResponse } from 'next/server';
import { createProduct, listProducts } from '@/lib/products';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const products = await listProducts({ category });

    return NextResponse.json(
      products.map((product) => ({
        ...product,
        _id: String(product._id)
      }))
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const required = ['name', 'price', 'category'];
    const missing = required.find((key) => !body[key]);

    if (missing) {
      return NextResponse.json({ error: `${missing} is required` }, { status: 400 });
    }

    const product = await createProduct(body);
    return NextResponse.json({ ...product, _id: String(product._id) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
