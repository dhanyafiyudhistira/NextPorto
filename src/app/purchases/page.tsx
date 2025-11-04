'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/currency';
import Link from 'next/link';

interface Purchase {
  id: string;
  supplier: { name: string };
  total: number;
  createdAt: string;
  items: Array<{ qty: number }>;
}

export default function PurchasesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const res = await fetch('/api/purchases');
      if (res.ok) {
        const data = await res.json();
        setPurchases(data);
      }
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      userName={session?.user?.name || undefined}
      userEmail={session?.user?.email || ''}
      userRole={session?.user?.role}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Purchases</h1>
            <p className="text-gray-600 mt-1">Manage supplier purchases</p>
          </div>
          <Link href="/purchases/new">
            <Button>
              <span className="mr-1">+</span> Create Purchase
            </Button>
          </Link>
        </div>

        <Card>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Purchase ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Supplier
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Total Items
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Total Cost
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500">
                        No purchases found
                      </td>
                    </tr>
                  ) : (
                    purchases.map((purchase) => (
                      <tr key={purchase.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {purchase.id.slice(0, 8)}...
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">{purchase.supplier.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{purchase.items.length}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 font-semibold">
                          {formatCurrency(Number(purchase.total))}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {new Date(purchase.createdAt).toLocaleDateString('id-ID')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
