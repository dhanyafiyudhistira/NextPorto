import { NextResponse } from 'next/server';
import { getCustomers, addCustomer } from '@/lib/storage';
import { Customer } from '@/lib/types';

export async function GET() {
  try {
    const customers = await getCustomers();
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customer: Customer = {
      id: Date.now().toString(),
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
    };

    const newCustomer = await addCustomer(customer);
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
