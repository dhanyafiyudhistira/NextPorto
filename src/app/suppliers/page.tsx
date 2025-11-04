'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import Link from 'next/link';

interface Supplier {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export default function SuppliersPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('/api/suppliers');
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data);
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus supplier ini?')) return;

    try {
      const res = await fetch(`/api/suppliers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSuppliers();
      }
    } catch (error) {
      console.error('Failed to delete supplier:', error);
    }
  };

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: 'Name', accessor: 'name' as const },
    { header: 'Email', accessor: (row: Supplier) => row.email || '-' },
    { header: 'Phone', accessor: (row: Supplier) => row.phone || '-' },
    {
      header: 'Actions',
      accessor: (row: Supplier) => (
        <div className="flex gap-2">
          <Link href={`/suppliers/${row.id}/edit`}>
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
            <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
            <p className="text-gray-600 mt-1">Manage your suppliers</p>
          </div>
          <Link href="/suppliers/new">
            <Button>
              <span className="mr-1">+</span> Add Supplier
            </Button>
          </Link>
        </div>

        <Card>
          <div className="mb-4">
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <Table data={filteredSuppliers} columns={columns} emptyMessage="No suppliers found" />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
