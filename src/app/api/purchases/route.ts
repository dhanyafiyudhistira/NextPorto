import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { purchaseSchema } from '@/lib/validators';

// GET all purchases
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
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
    });

    return NextResponse.json(purchases);
  } catch (error) {
    console.error('Get purchases error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchases' },
      { status: 500 }
    );
  }
}

// POST create purchase (ADMIN only, increase stock)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const validated = purchaseSchema.parse(body);

    // Use transaction to ensure data consistency
    const purchase = await prisma.$transaction(async (tx) => {
      // Calculate totals
      let total = 0;
      const itemsWithSubtotal = validated.items.map((item) => {
        const subtotal = item.qty * item.unitCost;
        total += subtotal;
        return {
          productId: item.productId,
          qty: item.qty,
          unitCost: item.unitCost,
          subtotal,
        };
      });

      // Create purchase
      const newPurchase = await tx.purchase.create({
        data: {
          supplierId: validated.supplierId,
          notes: validated.notes,
          total,
          items: {
            create: itemsWithSubtotal,
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
      });

      // Increase stock for each item
      for (const item of validated.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantityOnHand: {
              increment: item.qty,
            },
          },
        });
      }

      return newPurchase;
    });

    return NextResponse.json(
      {
        message: 'Purchase created successfully and stock updated',
        purchase,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create purchase error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create purchase' },
      { status: 500 }
    );
  }
}
