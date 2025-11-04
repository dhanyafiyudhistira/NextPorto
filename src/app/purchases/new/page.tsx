'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { formatCurrency } from '@/lib/currency';

interface Supplier {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
}

interface PurchaseItem {
  productId: string;
  productName: string;
  qty: number;
  unitCost: number;
  subtotal: number;
}

export default function NewPurchasePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [supplierId, setSupplierId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<PurchaseItem[]>([]);

  const [selectedProductId, setSelectedProductId] = useState('');
  const [qty, setQty] = useState(1);
  const [unitCost, setUnitCost] = useState(0);

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  const fetchSuppliers = async () => {
    const res = await fetch('/api/suppliers');
    if (res.ok) setSuppliers(await res.json());
  };

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    if (res.ok) setProducts(await res.json());
  };

  useEffect(() => {
    if (selectedProductId) {
      const product = products.find((p) => p.id === selectedProductId);
      if (product) {
        setUnitCost(Number(product.price));
      }
    }
  }, [selectedProductId, products]);

  const handleAddItem = () => {
    if (!selectedProductId || qty <= 0 || unitCost <= 0) return;

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    const existingItem = items.find((i) => i.productId === selectedProductId);
    if (existingItem) {
      setItems(
        items.map((i) =>
          i.productId === selectedProductId
            ? {
                ...i,
                qty: i.qty + qty,
                unitCost,
                subtotal: (i.qty + qty) * unitCost,
              }
            : i
        )
      );
    } else {
      setItems([
        ...items,
        {
          productId: product.id,
          productName: product.name,
          qty,
          unitCost,
          subtotal: qty * unitCost,
        },
      ]);
    }

    setSelectedProductId('');
    setQty(1);
    setUnitCost(0);
  };

  const handleRemoveItem = (productId: string) => {
    setItems(items.filter((i) => i.productId !== productId));
  };

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || items.length === 0) {
      setError('Supplier and at least one item are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId,
          notes,
          items: items.map((i) => ({
            productId: i.productId,
            qty: i.qty,
            unitCost: i.unitCost,
          })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to create purchase');
        setLoading(false);
        return;
      }

      const result = await res.json();
      alert(result.message || 'Purchase created and stock updated successfully!');
      router.push('/purchases');
      router.refresh();
    } catch (err) {
      setError('An error occurred');
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      userName={session?.user?.name || undefined}
      userEmail={session?.user?.email || ''}
      userRole={session?.user?.role}
    >
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create New Purchase</h1>
          <p className="text-gray-600 mt-1">Create a purchase order and automatically update stock</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <Card title="Purchase Information">
            <div className="space-y-4">
              <Select
                label="Supplier"
                required
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                options={suppliers.map((s) => ({ value: s.id, label: s.name }))}
                placeholder="Select supplier"
              />

              <TextArea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
            </div>
          </Card>

          <Card title="Purchase Items">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Select
                  label="Product"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  options={products.map((p) => ({
                    value: p.id,
                    label: `${p.name} (${p.sku})`,
                  }))}
                  placeholder="Select product"
                  className="md:col-span-2"
                />

                <Input
                  label="Qty"
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                />

                <Input
                  label="Unit Cost"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={unitCost}
                  onChange={(e) => setUnitCost(Number(e.target.value))}
                />
              </div>

              <Button type="button" onClick={handleAddItem} disabled={!selectedProductId}>
                Add Item
              </Button>

              {items.length > 0 && (
                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Product</th>
                        <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Qty</th>
                        <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">
                          Unit Cost
                        </th>
                        <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Subtotal</th>
                        <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.productId} className="border-t border-gray-200">
                          <td className="py-2 px-4 text-sm">{item.productName}</td>
                          <td className="py-2 px-4 text-sm">{item.qty}</td>
                          <td className="py-2 px-4 text-sm">{formatCurrency(item.unitCost)}</td>
                          <td className="py-2 px-4 text-sm font-semibold">
                            {formatCurrency(item.subtotal)}
                          </td>
                          <td className="py-2 px-4 text-sm">
                            <Button
                              type="button"
                              size="sm"
                              variant="danger"
                              onClick={() => handleRemoveItem(item.productId)}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                      <tr>
                        <td colSpan={3} className="py-3 px-4 text-right font-semibold">
                          Total:
                        </td>
                        <td className="py-3 px-4 font-bold text-lg">{formatCurrency(total)}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {items.length > 0 && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Upon submission, stock will be automatically increased for all items
                    in this purchase.
                  </p>
                </div>
              )}
            </div>
          </Card>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading || items.length === 0}>
              {loading ? 'Creating...' : 'Create Purchase & Update Stock'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
