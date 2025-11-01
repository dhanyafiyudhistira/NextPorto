'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { PurchaseItemRow, PurchaseItem } from '@/components/purchase/PurchaseItemRow'
import { Plus, Save } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Supplier {
  id: string
  name: string
}

interface Product {
  id: string
  sku: string
  name: string
  unit: string
  price: number
  cost: number
}

export default function NewPurchasePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [supplierId, setSupplierId] = useState('')
  const [items, setItems] = useState<PurchaseItem[]>([
    {
      productId: '',
      quantity: 1,
      unitCost: 0,
      subtotal: 0,
    },
  ])

  useEffect(() => {
    fetchSuppliers()
    fetchProducts()
  }, [])

  async function fetchSuppliers() {
    try {
      const res = await fetch('/api/suppliers')
      if (res.ok) {
        const data = await res.json()
        setSuppliers(data.filter((s: any) => s.isActive))
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error)
    }
  }

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(
          data
            .filter((p: any) => p.isActive)
            .map((p: any) => ({
              ...p,
              price: Number(p.price),
              cost: Number(p.cost),
            }))
        )
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const handleItemChange = (index: number, item: PurchaseItem) => {
    const newItems = [...items]
    newItems[index] = item
    setItems(newItems)
  }

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Minimal harus ada 1 item',
      })
      return
    }
    setItems(items.filter((_, i) => i !== index))
  }

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        productId: '',
        quantity: 1,
        unitCost: 0,
        subtotal: 0,
      },
    ])
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0)
  }

  const validateForm = () => {
    if (!supplierId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Supplier wajib dipilih',
      })
      return false
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!item.productId) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Item #${i + 1}: Produk wajib dipilih`,
        })
        return false
      }
      if (item.quantity < 1) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Item #${i + 1}: Quantity minimal 1`,
        })
        return false
      }
      if (item.unitCost < 0) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Item #${i + 1}: Unit cost harus >= 0`,
        })
        return false
      }
    }

    // Check for duplicate products
    const productIds = items.map((item) => item.productId)
    const uniqueProductIds = new Set(productIds)
    if (productIds.length !== uniqueProductIds.size) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Tidak boleh ada produk yang sama',
      })
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId,
          items,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Terjadi kesalahan',
        })
        return
      }

      toast({
        title: 'Berhasil',
        description: `Purchase ${result.purchaseNo} berhasil dibuat`,
      })

      router.push('/purchases')
      router.refresh()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Terjadi kesalahan. Silakan coba lagi.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleSubmit()
      }
      // Alt + = to add item
      if (e.altKey && e.key === '=') {
        e.preventDefault()
        handleAddItem()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [supplierId, items])

  const grandTotal = calculateTotal()

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Purchase</h1>
          <p className="text-muted-foreground">
            Buat purchase order baru dari supplier
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Purchase Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="max-w-md">
              <label className="text-sm font-medium mb-2 block">
                Supplier *
              </label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Items</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddItem}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item (Alt + =)
                </Button>
              </div>

              {items.map((item, index) => (
                <PurchaseItemRow
                  key={index}
                  item={item}
                  index={index}
                  products={products}
                  onChange={handleItemChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-end gap-4 border-t pt-6">
            <div className="w-full max-w-sm space-y-2">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Grand Total:</span>
                <span className="text-primary">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground text-right">
                {items.length} item(s)
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Create Purchase (Ctrl + Enter)'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}
