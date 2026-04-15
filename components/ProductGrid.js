import { getProductCollection } from '@/lib/mongodb-product';

export default async function ProductGrid({ category }) {
  const collection = await getProductCollection();

  const query = category
    ? { category: { $regex: `^${category}$`, $options: 'i' } }
    : {};

  const products = await collection.find(query).sort({ createdAt: -1 }).limit(20).toArray();

  if (products.length === 0) {
    return <p className="empty">Belum ada produk pada kategori ini.</p>;
  }

  return (
    <section className="grid" aria-label="Daftar produk">
      {products.map((product) => (
        <article key={String(product._id)} className="card">
          <h2>{product.name}</h2>
          <p>{product.category ?? 'Tanpa kategori'}</p>
          <p className="price">Rp {Number(product.price ?? 0).toLocaleString('id-ID')}</p>
        </article>
      ))}
    </section>
  );
}
