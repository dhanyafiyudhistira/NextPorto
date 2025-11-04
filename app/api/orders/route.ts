import { NextResponse } from 'next/server';
import { getOrders, addOrder } from '@/lib/storage';
import { Order } from '@/lib/types';

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order: Order = {
      id: Date.now().toString(),
      customerId: body.customerId,
      notes: body.notes,
      items: body.items,
      total: body.total,
      createdAt: new Date().toISOString(),
    };

    const newOrder = await addOrder(order);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
