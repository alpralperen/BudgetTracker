import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM cards ORDER BY created_at DESC');
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({ success: false, message: 'Veriler alınamadı' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, limit, current_debt = 0, statement_day = 1, due_day = 10 } = await request.json();
    
    if (!name || !limit) {
      return NextResponse.json({ success: false, message: 'Gerekli alanlar eksik' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO cards (name, "limit", current_debt, statement_day, due_day) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, limit, current_debt, statement_day, due_day]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error adding card:', error);
    return NextResponse.json({ success: false, message: 'Kart eklenemedi' }, { status: 500 });
  }
}
