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

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export default function CustomersPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus customer ini?')) return;

    try {
      const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCustomers();
      }
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: 'Name', accessor: 'name' as const },
    { header: 'Email', accessor: (row: Customer) => row.email || '-' },
    { header: 'Phone', accessor: (row: Customer) => row.phone || '-' },
    {
      header: 'Actions',
      accessor: (row: Customer) => (
        <div className="flex gap-2">
          <Link href={`/customers/${row.id}/edit`}>
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
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600 mt-1">Manage your customers</p>
          </div>
          <Link href="/customers/new">
            <Button>
              <span className="mr-1">+</span> Add Customer
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
            <Table data={filteredCustomers} columns={columns} emptyMessage="No customers found" />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
