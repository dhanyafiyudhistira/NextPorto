'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { formatCurrency } from '@/lib/currency';
import Link from 'next/link';

interface Product {
  id: string;
  sku: string;
  name: string;
  unit: string;
  price: number;
  quantityOnHand: number;
  reorderPoint: number;
  isActive: boolean;
}

export default function ProductsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: 'SKU', accessor: 'sku' as const },
    { header: 'Product Name', accessor: 'name' as const },
    { header: 'Unit', accessor: 'unit' as const },
    {
      header: 'Price',
      accessor: (row: Product) => formatCurrency(row.price),
    },
    {
      header: 'Stock',
      accessor: (row: Product) => (
        <span
          className={
            row.quantityOnHand <= row.reorderPoint ? 'text-red-600 font-semibold' : ''
          }
        >
          {row.quantityOnHand}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (row: Product) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (row: Product) => (
        <div className="flex gap-2">
          <Link href={`/products/${row.id}/edit`}>
            <Button size="sm" variant="secondary">
              Edit
            </Button>
          </Link>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      userName={session?.user?.name || undefined}
      userEmail={session?.user?.email || ''}
      userRole={session?.user?.role}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">Manage your product inventory</p>
          </div>
          <Link href="/products/new">
            <Button>
              <span className="mr-1">+</span> Add Product
            </Button>
          </Link>
        </div>

        <Card>
          <div className="mb-4">
            <Input
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <Table data={filteredProducts} columns={columns} emptyMessage="No products found" />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
