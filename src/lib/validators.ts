import { z } from 'zod';

/**
 * Zod validation schemas for forms and API endpoints
 */

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

// Product schemas
export const productSchema = z.object({
  sku: z.string().min(1, 'SKU wajib diisi'),
  name: z.string().min(1, 'Nama produk wajib diisi'),
  unit: z.string().min(1, 'Satuan wajib diisi'),
  price: z.coerce.number().positive('Harga harus lebih dari 0'),
  reorderPoint: z.coerce.number().int().min(0, 'Reorder point minimal 0'),
  quantityOnHand: z.coerce.number().int().min(0, 'Stok minimal 0'),
  isActive: z.boolean().default(true),
});

// Customer schemas
export const customerSchema = z.object({
  name: z.string().min(1, 'Nama customer wajib diisi'),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// Supplier schemas
export const supplierSchema = z.object({
  name: z.string().min(1, 'Nama supplier wajib diisi'),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// Order item schema
export const orderItemSchema = z.object({
  productId: z.string().min(1, 'Produk wajib dipilih'),
  qty: z.coerce.number().int().positive('Qty harus lebih dari 0'),
  unitPrice: z.coerce.number().positive('Harga harus lebih dari 0'),
});

// Order schema
export const orderSchema = z.object({
  customerId: z.string().min(1, 'Customer wajib dipilih'),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'Minimal 1 item diperlukan'),
});

// Purchase item schema
export const purchaseItemSchema = z.object({
  productId: z.string().min(1, 'Produk wajib dipilih'),
  qty: z.coerce.number().int().positive('Qty harus lebih dari 0'),
  unitCost: z.coerce.number().positive('Harga harus lebih dari 0'),
});

// Purchase schema
export const purchaseSchema = z.object({
  supplierId: z.string().min(1, 'Supplier wajib dipilih'),
  notes: z.string().optional(),
  items: z.array(purchaseItemSchema).min(1, 'Minimal 1 item diperlukan'),
});

// Types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type SupplierInput = z.infer<typeof supplierSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type PurchaseInput = z.infer<typeof purchaseSchema>;
