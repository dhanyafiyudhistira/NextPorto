import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { productSchema } from '@/lib/validators'
import {
  withApiHandler,
  successResponse,
  validateBody,
  requireAdmin,
  safeAsync,
} from '@/lib/api-handler'

export const GET = withApiHandler(
  async (req: NextRequest) => {
    const products = await safeAsync(
      () => prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      'GET /api/products'
    )

    return successResponse(products)
  },
  { requireAuth: true }
)

export const POST = withApiHandler(
  async (req: NextRequest) => {
    // Check if user is admin (canManageMaster typically means admin)
    await requireAdmin()

    const validated = await validateBody(req, productSchema)

    const product = await safeAsync(
      () => prisma.product.create({
        data: validated,
      }),
      'POST /api/products'
    )

    return successResponse(product, 201)
  },
  { requireAuth: true, requiredRole: 'ADMIN' }
)
