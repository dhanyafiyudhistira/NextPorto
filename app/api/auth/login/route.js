import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { getAuthDb } from '@/lib/mongodb-auth';

function hashPassword(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'email and password are required' }, { status: 400 });
    }

    const db = await getAuthDb();
    const user = await db.collection('users').findOne({ email });

    if (!user || user.passwordHash !== hashPassword(password)) {
      return NextResponse.json({ error: 'invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
