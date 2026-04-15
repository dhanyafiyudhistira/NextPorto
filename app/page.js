import ProductFilter from '@/components/ProductFilter';
import { listProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await listProducts();

  const normalizedProducts = products.map((product) => ({
    ...product,
    _id: String(product._id)
  }));

  return (
    <main className="container">
      <header className="header">
        <p className="eyebrow">NextPorto</p>
        <h1>Lightweight Product Catalog</h1>
        <p>Server Components + Vanilla CSS + MongoDB Native Driver.</p>
        {!process.env.MONGODB_PRODUCT_URI ? (
          <p className="envNotice">
            MONGODB_PRODUCT_URI belum diatur. Menampilkan katalog kosong sampai koneksi database dikonfigurasi.
          </p>
        ) : null}
      </header>

      <ProductFilter products={normalizedProducts} />
    </main>
  );
}
