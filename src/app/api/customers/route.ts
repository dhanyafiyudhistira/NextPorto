import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { customerSchema } from '@/lib/validators'
import {
  withApiHandler,
  successResponse,
  validateBody,
  safeAsync,
} from '@/lib/api-handler'

export const GET = withApiHandler(
  async (req: NextRequest) => {
    const customers = await safeAsync(
      () => prisma.customer.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      'GET /api/customers'
    )

    return successResponse(customers)
  },
  { requireAuth: true }
)

export const POST = withApiHandler(
  async (req: NextRequest) => {
    const validated = await validateBody(req, customerSchema)

    const customer = await safeAsync(
      () => prisma.customer.create({
        data: validated,
      }),
      'POST /api/customers'
    )

    return successResponse(customer, 201)
  },
  { requireAuth: true }
)
