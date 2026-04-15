import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { getAuthDb } from '@/lib/mongodb-auth';

function hashPassword(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export async function POST(request) {
  const body = await request.json();
  const { name, email, password, role = 'user' } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'email and password are required' }, { status: 400 });
  }

  const db = await getAuthDb();
  const users = db.collection('users');

  const existing = await users.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: 'user already exists' }, { status: 409 });
  }

  const result = await users.insertOne({
    name: name || email,
    email,
    passwordHash: hashPassword(password),
    role,
    createdAt: new Date()
  });

  return NextResponse.json({ userId: String(result.insertedId) }, { status: 201 });
}
