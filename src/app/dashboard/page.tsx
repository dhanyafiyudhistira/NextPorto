import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Users, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { logger } from '@/lib/logger'

async function getDashboardStats() {
  try {
    const [
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalCustomers,
      totalOrders,
      totalPurchases,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({
        where: {
          isActive: true,
          quantityOnHand: {
            lte: prisma.product.fields.reorderPoint,
          },
        },
      }),
      prisma.customer.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.purchase.count(),
    ])

    const recentOrders = await prisma.order.findMany({
      take: 5,
      include: {
        customer: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const lowStockItems = await prisma.product.findMany({
      where: {
        isActive: true,
        quantityOnHand: {
          lte: prisma.product.fields.reorderPoint,
        },
      },
      take: 5,
      orderBy: { quantityOnHand: 'asc' },
    })

    return {
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalCustomers,
      totalOrders,
      totalPurchases,
      recentOrders,
      lowStockItems,
    }
  } catch (error) {
    logger.dbError('Failed to fetch dashboard stats', error)

    // Return default/empty stats to prevent page crash
    return {
      totalProducts: 0,
      activeProducts: 0,
      lowStockProducts: 0,
      totalCustomers: 0,
      totalOrders: 0,
      totalPurchases: 0,
      recentOrders: [],
      lowStockItems: [],
    }
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  const stats = await getDashboardStats()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang, {session?.user?.name || session?.user?.email}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProducts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalProducts} total produk
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Low Stock Alert
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lowStockProducts}</div>
              <p className="text-xs text-muted-foreground">
                Produk perlu restock
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                Customer aktif
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalPurchases} purchases
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.lowStockItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Semua produk stoknya cukup
                </p>
              ) : (
                <div className="space-y-3">
                  {stats.lowStockItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          SKU: {item.sku}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-destructive">
                          {item.quantityOnHand} {item.unit}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Min: {item.reorderPoint}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Belum ada order
                </p>
              ) : (
                <div className="space-y-3">
                  {stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{order.orderNo}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.customer.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">
                          {formatCurrency(Number(order.totalAmount))}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
