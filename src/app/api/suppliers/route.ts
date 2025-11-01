import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { supplierSchema } from '@/lib/validators'
import {
  withApiHandler,
  successResponse,
  validateBody,
  safeAsync,
} from '@/lib/api-handler'

export const GET = withApiHandler(
  async (req: NextRequest) => {
    const suppliers = await safeAsync(
      () => prisma.supplier.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      'GET /api/suppliers'
    )

    return successResponse(suppliers)
  },
  { requireAuth: true }
)

export const POST = withApiHandler(
  async (req: NextRequest) => {
    const validated = await validateBody(req, supplierSchema)

    const supplier = await safeAsync(
      () => prisma.supplier.create({
        data: validated,
      }),
      'POST /api/suppliers'
    )

    return successResponse(supplier, 201)
  },
  { requireAuth: true }
)
