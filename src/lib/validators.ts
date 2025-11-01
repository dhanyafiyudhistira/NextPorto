import { z } from 'zod'

// Auth validators
export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  name: z.string().min(2, 'Nama minimal 2 karakter').optional(),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
})

// Product validators
export const productSchema = z.object({
  sku: z.string().min(1, 'SKU wajib diisi'),
  name: z.string().min(1, 'Nama produk wajib diisi'),
  description: z.string().optional(),
  unit: z.string().default('PCS'),
  price: z.number().min(0, 'Harga harus >= 0'),
  cost: z.number().min(0, 'Harga pokok harus >= 0'),
  quantityOnHand: z.number().int().min(0, 'Stok harus >= 0').default(0),
  reorderPoint: z.number().int().min(0, 'Reorder point harus >= 0').default(10),
  isActive: z.boolean().default(true),
})

// Customer validators
export const customerSchema = z.object({
  name: z.string().min(1, 'Nama customer wajib diisi'),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  isActive: z.boolean().default(true),
})

// Supplier validators
export const supplierSchema = z.object({
  name: z.string().min(1, 'Nama supplier wajib diisi'),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  isActive: z.boolean().default(true),
})

// Order validators
export const orderItemSchema = z.object({
  productId: z.string().min(1, 'Produk wajib dipilih'),
  quantity: z.number().int().min(1, 'Qty minimal 1'),
  unitPrice: z.number().min(0, 'Harga harus >= 0'),
  subtotal: z.number().min(0, 'Subtotal harus >= 0'),
})

export const orderSchema = z.object({
  customerId: z.string().min(1, 'Customer wajib dipilih'),
  items: z.array(orderItemSchema).min(1, 'Minimal 1 item'),
  notes: z.string().optional(),
})

// Purchase validators
export const purchaseItemSchema = z.object({
  productId: z.string().min(1, 'Produk wajib dipilih'),
  quantity: z.number().int().min(1, 'Qty minimal 1'),
  unitCost: z.number().min(0, 'Harga harus >= 0'),
  subtotal: z.number().min(0, 'Subtotal harus >= 0'),
})

export const purchaseSchema = z.object({
  supplierId: z.string().min(1, 'Supplier wajib dipilih'),
  items: z.array(purchaseItemSchema).min(1, 'Minimal 1 item'),
  notes: z.string().optional(),
})
