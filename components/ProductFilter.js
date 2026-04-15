'use client';

import { useMemo, useState } from 'react';
import ProductGrid from '@/components/ProductGrid';

export default function ProductFilter({ products }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const set = new Set(products.map((product) => product.category).filter(Boolean));
    return ['all', ...set];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return products;
    }

    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <section>
      <div className="toolbar" aria-label="Filter products by category">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={selectedCategory === category ? 'chip chipActive' : 'chip'}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <ProductGrid products={filteredProducts} />
    </section>
  );
}
