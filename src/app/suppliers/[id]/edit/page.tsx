'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { supplierSchema, SupplierInput } from '@/lib/validators';

export default function EditSupplierPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierInput>({
    resolver: zodResolver(supplierSchema),
  });

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const res = await fetch(`/api/suppliers/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          reset(data);
        }
      } catch (err) {
        setError('Failed to fetch supplier');
      } finally {
        setFetching(false);
      }
    };

    fetchSupplier();
  }, [params.id, reset]);

  const onSubmit = async (data: SupplierInput) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/suppliers/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to update supplier');
        setLoading(false);
        return;
      }

      router.push('/suppliers');
      router.refresh();
    } catch (err) {
      setError('An error occurred');
      setLoading(false);
    }
  };

  if (fetching) {
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

  return (
    <DashboardLayout
      userName={session?.user?.name || undefined}
      userEmail={session?.user?.email || ''}
      userRole={session?.user?.role}
    >
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Supplier</h1>
          <p className="text-gray-600 mt-1">Update supplier information</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <Input label="Name" {...register('name')} error={errors.name?.message} required />

            <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />

            <Input label="Phone" {...register('phone')} error={errors.phone?.message} />

            <TextArea label="Address" {...register('address')} error={errors.address?.message} rows={3} />

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Supplier'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
