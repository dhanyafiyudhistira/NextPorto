import { NextResponse } from 'next/server';
import { getProducts, addProduct } from '@/lib/storage';
import { Product } from '@/lib/types';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product: Product = {
      id: Date.now().toString(),
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      sku: body.sku,
    };

    const newProduct = await addProduct(product);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
