import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ success: false, message: 'Slug is required' }, { status: 400 });
    }

    const [rows] = await pool.query('SELECT * FROM pages WHERE slug = ?', [slug]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Page not found' }, { status: 404 });
    }

    const page = rows[0];
    
    // Parse content if it's a string
    if (typeof page.content === 'string') {
      try {
        page.content = JSON.parse(page.content);
      } catch (e) {
        console.error('Failed to parse page content', e);
      }
    }

    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
