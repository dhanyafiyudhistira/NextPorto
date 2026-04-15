import Image from 'next/image';

export default function ProductGrid({ products }) {
  if (!products.length) {
    return <p className="emptyState">Belum ada produk.</p>;
  }

  return (
    <div className="productGrid">
      {products.map((product) => (
        <article className="card" key={String(product._id)}>
          <div className="thumbWrap">
            <Image
              src={product.imageUrl || 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1280&q=80&auto=format&fit=crop'}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </div>
          <div className="cardBody">
            <small className="category">{product.category || 'uncategorized'}</small>
            <h2>{product.name}</h2>
            <p>{product.description || 'No description'}</p>
            <strong>Rp {Number(product.price || 0).toLocaleString('id-ID')}</strong>
          </div>
        </article>
      ))}
    </div>
  );
}
