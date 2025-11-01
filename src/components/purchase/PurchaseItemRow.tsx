'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export interface PurchaseItem {
  productId: string
  quantity: number
  unitCost: number
  subtotal: number
}

interface PurchaseItemRowProps {
  item: PurchaseItem
  index: number
  products: Array<{ id: string; sku: string; name: string; unit: string; price: number; cost: number }>
  onChange: (index: number, item: PurchaseItem) => void
  onRemove: (index: number) => void
}

export function PurchaseItemRow({
  item,
  index,
  products,
  onChange,
  onRemove,
}: PurchaseItemRowProps) {
  const selectedProduct = products.find((p) => p.id === item.productId)

  const handleProductChange = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    // Use product's cost if available, otherwise use price
    const productCost = product ? (product.cost > 0 ? product.cost : product.price) : item.unitCost
    onChange(index, {
      ...item,
      productId,
      unitCost: productCost,
      subtotal: item.quantity * productCost,
    })
  }

  const handleQuantityChange = (newQuantity: number) => {
    const qty = Math.max(1, newQuantity) // Minimum 1
    onChange(index, {
      ...item,
      quantity: qty,
      subtotal: qty * item.unitCost,
    })
  }

  const handleUnitCostChange = (value: string) => {
    const cost = parseFloat(value) || 0
    onChange(index, {
      ...item,
      unitCost: cost,
      subtotal: item.quantity * cost,
    })
  }

  const incrementQuantity = () => {
    handleQuantityChange(item.quantity + 1)
  }

  const decrementQuantity = () => {
    handleQuantityChange(item.quantity - 1)
  }

  return (
    <div className="grid grid-cols-12 gap-3 items-start p-3 border rounded-lg bg-card">
      {/* Product Select - 4 cols */}
      <div className="col-span-12 md:col-span-4">
        <label className="text-xs font-medium text-muted-foreground mb-1 block">
          Product
        </label>
        <Select value={item.productId} onValueChange={handleProductChange}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih produk" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.sku} - {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quantity with +/- buttons - 3 cols */}
      <div className="col-span-6 md:col-span-3">
        <label className="text-xs font-medium text-muted-foreground mb-1 block">
          Quantity {selectedProduct && `(${selectedProduct.unit})`}
        </label>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0"
                onClick={decrementQuantity}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Kurangi</TooltipContent>
          </Tooltip>

          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            className="text-center"
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0"
                onClick={incrementQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Tambah</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Unit Cost - 2 cols */}
      <div className="col-span-6 md:col-span-2">
        <label className="text-xs font-medium text-muted-foreground mb-1 block">
          Unit Cost
        </label>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={item.unitCost}
          onChange={(e) => handleUnitCostChange(e.target.value)}
          placeholder="0"
        />
      </div>

      {/* Subtotal - 2 cols */}
      <div className="col-span-10 md:col-span-2">
        <label className="text-xs font-medium text-muted-foreground mb-1 block">
          Subtotal
        </label>
        <div className="h-10 px-3 py-2 rounded-md border bg-muted flex items-center">
          <span className="text-sm font-medium">
            {formatCurrency(item.subtotal)}
          </span>
        </div>
      </div>

      {/* Remove button - 1 col */}
      <div className="col-span-2 md:col-span-1">
        <label className="text-xs font-medium text-muted-foreground mb-1 block md:block hidden">
          &nbsp;
        </label>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-10 w-full"
              onClick={() => onRemove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Hapus</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
