import { NextResponse } from 'next/server';
import { getUserCollection } from '@/lib/mongodb-auth';

export async function POST(request) {
  const payload = await request.json();
  const email = payload?.email?.trim()?.toLowerCase();
  const password = payload?.password;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const users = await getUserCollection();
  const exists = await users.findOne({ email });

  if (exists) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
  }

  await users.insertOne({ email, password, role: 'user', createdAt: new Date() });
  return NextResponse.json({ ok: true }, { status: 201 });
}
