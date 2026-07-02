import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // 1. Current Month Total Expenses
    const currentMonthResult = await query(`
      SELECT SUM(amount) as total 
      FROM expenses 
      WHERE EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE)
    `);
    const totalExpenses = parseFloat(currentMonthResult.rows[0]?.total || 0);

    // 2. Cards
    const cardsResult = await query('SELECT * FROM cards ORDER BY created_at ASC');
    const cards = cardsResult.rows;

    // 3. Recent Expenses
    const expensesResult = await query(`
      SELECT e.*, c.name as card_name 
      FROM expenses e
      LEFT JOIN cards c ON e.payment_method = c.id::text
      ORDER BY e.date DESC, e.created_at DESC
      LIMIT 5
    `);
    const recentExpenses = expensesResult.rows;

    return NextResponse.json({
      success: true,
      data: {
        totalExpenses,
        cards,
        recentExpenses
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ success: false, message: 'Veriler alınamadı' }, { status: 500 });
  }
}
