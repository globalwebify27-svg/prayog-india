import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';
import * as jose from 'jose';

async function verifyAuth(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return { success: false };

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    return { success: true, user: payload };
  } catch (error) {
    return { success: false };
  }
}

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (!auth.success || auth.user.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [rows] = await pool.query('SELECT slug, title, updated_at FROM pages');
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await verifyAuth(request);
  if (!auth.success || auth.user.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, content } = body;

    if (!slug || !content) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);

    await pool.query(
      'UPDATE pages SET content = ? WHERE slug = ?',
      [contentStr, slug]
    );

    return NextResponse.json({ success: true, message: 'Page updated successfully' });
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
