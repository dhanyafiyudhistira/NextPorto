import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { prisma } from '@/lib/db';
import { formatCurrency } from '@/lib/currency';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  const isAdmin = session.user.role === 'ADMIN';

  // Fetch dashboard statistics
  const [
    totalProducts,
    totalCustomers,
    totalSuppliers,
    totalOrders,
    confirmedOrders,
    draftOrders,
    lowStockProducts,
  ] = await Promise.all([
    isAdmin ? prisma.product.count() : null,
    isAdmin ? prisma.customer.count() : null,
    isAdmin ? prisma.supplier.count() : null,
    prisma.order.count(),
    prisma.order.count({ where: { status: 'CONFIRMED' } }),
    prisma.order.count({ where: { status: 'DRAFT' } }),
    isAdmin
      ? prisma.product.findMany({
          where: {
            quantityOnHand: { lte: prisma.product.fields.reorderPoint },
          },
          take: 5,
        })
      : null,
  ]);

  // Recent orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      customer: true,
    },
  });

  return (
    <DashboardLayout
      userName={session.user.name || undefined}
      userEmail={session.user.email}
      userRole={session.user.role}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang di ERP System</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isAdmin && (
            <>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{totalProducts}</p>
                  </div>
                  <div className="text-4xl">📦</div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Customers</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{totalCustomers}</p>
                  </div>
                  <div className="text-4xl">👥</div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Suppliers</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{totalSuppliers}</p>
                  </div>
                  <div className="text-4xl">🏭</div>
                </div>
              </Card>
            </>
          )}

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalOrders}</p>
              </div>
              <div className="text-4xl">🛒</div>
            </div>
          </Card>
        </div>

        {/* Order Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Order Status">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Confirmed</span>
                <span className="font-semibold text-green-600">{confirmedOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Draft</span>
                <span className="font-semibold text-yellow-600">{draftOrders}</span>
              </div>
            </div>
          </Card>

          {isAdmin && lowStockProducts && lowStockProducts.length > 0 && (
            <Card title="⚠️ Low Stock Alert">
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{product.name}</span>
                    <span className="font-semibold text-red-600">
                      {product.quantityOnHand} {product.unit}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Recent Orders */}
        <Card title="Recent Orders">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{order.id.slice(0, 8)}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{order.customer.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {formatCurrency(Number(order.total))}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'DRAFT'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
