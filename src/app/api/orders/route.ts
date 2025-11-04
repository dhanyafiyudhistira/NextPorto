import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { orderSchema } from '@/lib/validators';

// GET all orders
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const orders = await prisma.order.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        customer: true,
        user: {
          select: { name: true, email: true },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST create order (DRAFT)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = orderSchema.parse(body);

    // Calculate totals
    let total = 0;
    const itemsWithSubtotal = validated.items.map((item) => {
      const subtotal = item.qty * item.unitPrice;
      total += subtotal;
      return {
        productId: item.productId,
        qty: item.qty,
        unitPrice: item.unitPrice,
        subtotal,
      };
    });

    // Create order in transaction
    const order = await prisma.order.create({
      data: {
        customerId: validated.customerId,
        userId: session.user.id,
        status: 'DRAFT',
        notes: validated.notes,
        total,
        items: {
          create: itemsWithSubtotal,
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error('Create order error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
