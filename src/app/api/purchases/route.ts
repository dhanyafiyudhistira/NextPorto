import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { purchaseSchema } from '@/lib/validators'
import {
  withApiHandler,
  successResponse,
  validateBody,
  safeAsync,
} from '@/lib/api-handler'

export const GET = withApiHandler(
  async (req: NextRequest) => {
    const purchases = await safeAsync(
      () => prisma.purchase.findMany({
        include: {
          supplier: true,
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      'GET /api/purchases'
    )

    return successResponse(purchases)
  },
  { requireAuth: true }
)

export const POST = withApiHandler(
  async (req: NextRequest) => {
    const validated = await validateBody(req, purchaseSchema)

    // Calculate total on server side
    const totalAmount = validated.items.reduce(
      (sum, item) => sum + item.subtotal,
      0
    )

    // Generate purchase number
    const lastPurchase = await safeAsync(
      () => prisma.purchase.findFirst({
        orderBy: { createdAt: 'desc' },
      }),
      'Generate purchase number'
    )

    const purchaseNo = lastPurchase
      ? `PO-${String(parseInt(lastPurchase.purchaseNo.split('-')[1]) + 1).padStart(5, '0')}`
      : 'PO-00001'

    // Create purchase with items and update stock in a transaction
    const purchase = await safeAsync(
      () => prisma.$transaction(async (tx) => {
        // Create purchase
        const newPurchase = await tx.purchase.create({
          data: {
            purchaseNo,
            supplierId: validated.supplierId,
            totalAmount,
            notes: validated.notes,
            items: {
              create: validated.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitCost: item.unitCost,
                subtotal: item.subtotal,
              })),
            },
          },
          include: {
            supplier: true,
            items: {
              include: {
                product: true,
              },
            },
          },
        })

        // Update product stock
        for (const item of validated.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              quantityOnHand: {
                increment: item.quantity,
              },
            },
          })
        }

        return newPurchase
      }),
      'POST /api/purchases - create purchase transaction'
    )

    return successResponse(purchase, 201)
  },
  { requireAuth: true }
)
