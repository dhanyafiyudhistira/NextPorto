'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/currency';

interface OrderDetail {
  id: string;
  customer: { name: string; email: string | null; phone: string | null };
  user: { name: string | null; email: string };
  status: string;
  total: number;
  notes: string | null;
  createdAt: string;
  items: Array<{
    id: string;
    product: { name: string; sku: string };
    qty: number;
    unitPrice: number;
    subtotal: number;
  }>;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = session?.user?.role === 'ADMIN';

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        setError('Failed to load order');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!confirm('Confirm this order? Stock will be reduced.')) return;

    setActionLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/${params.id}/confirm`, {
        method: 'POST',
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to confirm order');
        setActionLoading(false);
        return;
      }

      await fetchOrder();
      setActionLoading(false);
    } catch (err) {
      setError('An error occurred');
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Cancel this order?')) return;

    setActionLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/${params.id}/cancel`, {
        method: 'POST',
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to cancel order');
        setActionLoading(false);
        return;
      }

      await fetchOrder();
      setActionLoading(false);
    } catch (err) {
      setError('An error occurred');
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        userName={session?.user?.name || undefined}
        userEmail={session?.user?.email || ''}
        userRole={session?.user?.role}
      >
        <div className="text-center py-8">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout
        userName={session?.user?.name || undefined}
        userEmail={session?.user?.email || ''}
        userRole={session?.user?.role}
      >
        <div className="text-center py-8 text-red-600">Order not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userName={session?.user?.name || undefined}
      userEmail={session?.user?.email || ''}
      userRole={session?.user?.role}
    >
      <div className="max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600 mt-1">Order ID: {order.id}</p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === 'CONFIRMED'
                ? 'bg-green-100 text-green-800'
                : order.status === 'DRAFT'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {order.status}
          </span>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <Card title="Customer Information">
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{order.customer.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{order.customer.email || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{order.customer.phone || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created By</dt>
                <dd className="mt-1 text-sm text-gray-900">{order.user?.name || order.user?.email}</dd>
              </div>
            </dl>
          </Card>

          <Card title="Order Items">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Product</th>
                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">SKU</th>
                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Qty</th>
                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">
                      Unit Price
                    </th>
                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-t border-gray-200">
                      <td className="py-2 px-4 text-sm">{item.product.name}</td>
                      <td className="py-2 px-4 text-sm">{item.product.sku}</td>
                      <td className="py-2 px-4 text-sm">{item.qty}</td>
                      <td className="py-2 px-4 text-sm">{formatCurrency(Number(item.unitPrice))}</td>
                      <td className="py-2 px-4 text-sm font-semibold">
                        {formatCurrency(Number(item.subtotal))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td colSpan={4} className="py-3 px-4 text-right font-semibold">
                      Total:
                    </td>
                    <td className="py-3 px-4 font-bold text-lg">
                      {formatCurrency(Number(order.total))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {order.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Notes:</strong> {order.notes}
                </p>
              </div>
            )}
          </Card>

          <div className="flex gap-2">
            {isAdmin && order.status === 'DRAFT' && (
              <>
                <Button onClick={handleConfirm} disabled={actionLoading}>
                  {actionLoading ? 'Processing...' : 'Confirm Order'}
                </Button>
                <Button variant="danger" onClick={handleCancel} disabled={actionLoading}>
                  Cancel Order
                </Button>
              </>
            )}
            <Button variant="secondary" onClick={() => router.push('/orders')}>
              Back to Orders
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
