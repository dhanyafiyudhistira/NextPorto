import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// POST confirm order (ADMIN only, reduce stock)
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Get order with items
      const order = await tx.order.findUnique({
        where: { id: params.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status === 'CONFIRMED') {
        throw new Error('Order sudah dikonfirmasi');
      }

      if (order.status === 'CANCELED') {
        throw new Error('Order sudah dibatalkan');
      }

      // Check stock availability for all items
      for (const item of order.items) {
        if (item.product.quantityOnHand < item.qty) {
          throw new Error(
            `Stok tidak cukup untuk ${item.product.name}. Tersedia: ${item.product.quantityOnHand}, Diminta: ${item.qty}`
          );
        }
      }

      // Reduce stock for each item
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantityOnHand: {
              decrement: item.qty,
            },
          },
        });
      }

      // Update order status
      const updatedOrder = await tx.order.update({
        where: { id: params.id },
        data: {
          status: 'CONFIRMED',
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

      return updatedOrder;
    });

    return NextResponse.json({
      message: 'Order berhasil dikonfirmasi',
      order: result,
    });
  } catch (error: any) {
    console.error('Confirm order error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to confirm order' },
      { status: 400 }
    );
  }
}
