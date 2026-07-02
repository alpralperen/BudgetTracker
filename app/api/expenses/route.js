import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT e.*, c.name as card_name 
      FROM expenses e
      LEFT JOIN cards c ON e.payment_method = c.id::text
      ORDER BY e.date DESC, e.created_at DESC
      LIMIT 50
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ success: false, message: 'Harcamalar alınamadı' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, amount, payment_method, date } = await request.json();
    
    if (!title || !amount || !payment_method) {
      return NextResponse.json({ success: false, message: 'Eksik bilgi girdiniz' }, { status: 400 });
    }

    const expenseDate = date || new Date().toISOString().split('T')[0];

    // Transaction logic to also update card if payment_method is a UUID (card ID)
    // We'll use a simple approach: if payment_method != 'Nakit', try to update card
    
    let isCard = payment_method !== 'Nakit';

    if (isCard) {
      // Update card first
      await query(
        `UPDATE cards SET current_debt = current_debt + $1 WHERE id = $2`,
        [amount, payment_method]
      );
    }

    const result = await query(
      `INSERT INTO expenses (title, amount, payment_method, date) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, amount, payment_method, expenseDate]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error adding expense:', error);
    return NextResponse.json({ success: false, message: 'Harcama eklenemedi' }, { status: 500 });
  }
}
