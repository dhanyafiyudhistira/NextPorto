import { getProductDb } from '@/lib/mongodb-product';

export async function listProducts({ category = 'all' } = {}) {
  const db = await getProductDb();
  const query = category && category !== 'all' ? { category } : {};

  return db.collection('products').find(query).sort({ createdAt: -1 }).limit(100).toArray();
}

export async function createProduct({ name, description, price, category, imageUrl }) {
  const db = await getProductDb();

  const payload = {
    name,
    description,
    price: Number(price),
    category,
    imageUrl,
    createdAt: new Date()
  };

  const result = await db.collection('products').insertOne(payload);
  return { ...payload, _id: result.insertedId };
}
