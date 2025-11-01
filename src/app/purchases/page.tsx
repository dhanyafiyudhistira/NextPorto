import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/lib/utils'

async function getPurchases() {
  return await prisma.purchase.findMany({
    include: {
      supplier: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function PurchasesPage() {
  await getServerSession(authOptions)
  const purchases = await getPurchases()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Purchases</h1>
            <p className="text-muted-foreground">
              Kelola pembelian dari supplier
            </p>
          </div>
          <Link href="/purchases/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Purchase
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Purchase History</CardTitle>
          </CardHeader>
          <CardContent>
            {purchases.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Belum ada data purchase
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Purchase No</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-medium">
                        {purchase.purchaseNo}
                      </TableCell>
                      <TableCell>{purchase.supplier.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {purchase.items.length} items
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold">
                        {formatCurrency(Number(purchase.totalAmount))}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(purchase.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
