import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { purchaseSchema } from '@/lib/validators'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const purchases = await prisma.purchase.findMany({
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

    return NextResponse.json(purchases)
  } catch (error) {
    console.error('Get purchases error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validated = purchaseSchema.parse(body)

    // Calculate total on server side
    const totalAmount = validated.items.reduce(
      (sum, item) => sum + item.subtotal,
      0
    )

    // Generate purchase number
    const lastPurchase = await prisma.purchase.findFirst({
      orderBy: { createdAt: 'desc' },
    })

    const purchaseNo = lastPurchase
      ? `PO-${String(parseInt(lastPurchase.purchaseNo.split('-')[1]) + 1).padStart(5, '0')}`
      : 'PO-00001'

    // Create purchase with items and update stock in a transaction
    const purchase = await prisma.$transaction(async (tx) => {
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
    })

    return NextResponse.json(purchase, { status: 201 })
  } catch (error: any) {
    console.error('Create purchase error:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Data tidak valid', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
