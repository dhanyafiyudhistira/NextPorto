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
  const user = await users.findOne({ email, password });

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  return NextResponse.json({ ok: true, role: user.role });
}
