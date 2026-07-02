import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM wallet LIMIT 1');
    const wallet = result.rows[0] || { balance: 0 };
    return NextResponse.json({ success: true, data: wallet });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    // Return 0 if table doesn't exist yet to prevent crashes
    return NextResponse.json({ success: true, data: { balance: 0 } });
  }
}

export async function PUT(request) {
  try {
    const { balance } = await request.json();
    
    if (balance === undefined) {
      return NextResponse.json({ success: false, message: 'Bakiye belirtilmedi' }, { status: 400 });
    }

    // Check if wallet exists
    const checkResult = await query('SELECT id FROM wallet LIMIT 1');
    let result;

    if (checkResult.rowCount === 0) {
      result = await query('INSERT INTO wallet (balance) VALUES ($1) RETURNING *', [parseFloat(balance)]);
    } else {
      result = await query('UPDATE wallet SET balance = $1 WHERE id = $2 RETURNING *', [parseFloat(balance), checkResult.rows[0].id]);
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating wallet:', error);
    return NextResponse.json({ success: false, message: 'Cüzdan güncellenemedi' }, { status: 500 });
  }
}
