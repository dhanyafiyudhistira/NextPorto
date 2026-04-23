import ProductGrid from '@/components/ProductGrid';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }) {
  const category = searchParams?.category ?? '';

  return (
    <main className="container">
      <header className="hero">
        <h1>Lightweight Product Catalog</h1>
        <p>Server-rendered catalog dengan MongoDB multi-cluster.</p>
      </header>

      <form className="filter" method="get">
        <label htmlFor="category">Filter kategori</label>
        <input id="category" name="category" defaultValue={category} placeholder="contoh: elektronik" />
        <button type="submit">Terapkan</button>
      </form>

      <ProductGrid category={category} />
    </main>
  );
}
