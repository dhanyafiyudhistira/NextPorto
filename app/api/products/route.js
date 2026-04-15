import { NextResponse } from 'next/server';
import { getProductCollection } from '@/lib/mongodb-product';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  const collection = await getProductCollection();
  const query = category
    ? { category: { $regex: `^${category}$`, $options: 'i' } }
    : {};

  const products = await collection.find(query).sort({ createdAt: -1 }).limit(50).toArray();
  return NextResponse.json(products);
}

export async function POST(request) {
  const payload = await request.json();

  if (!payload?.name || !payload?.price) {
    return NextResponse.json({ error: 'name and price are required' }, { status: 400 });
  }

  const collection = await getProductCollection();
  const doc = {
    name: String(payload.name),
    category: payload.category ? String(payload.category) : 'Umum',
    price: Number(payload.price),
    createdAt: new Date()
  };

  const result = await collection.insertOne(doc);

  return NextResponse.json({ id: String(result.insertedId) }, { status: 201 });
}
