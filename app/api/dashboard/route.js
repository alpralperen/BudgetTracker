import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // 1. Toplam harcamaları al (bu ay) - Ödemeler harcama sayılmaz
    const expensesResult = await query(`
      SELECT SUM(amount) as total 
      FROM expenses 
      WHERE date_trunc('month', date) = date_trunc('month', CURRENT_DATE)
      AND payment_method != 'Kredi Kartı Ödemesi'
    `);
    const totalExpenses = expensesResult.rows[0].total || 0;

    // 2. Kartları al
    const cardsResult = await query(`
      SELECT * FROM cards ORDER BY created_at ASC
    `);

    // 3. Nakit bakiyesini al
    let walletBalance = 0;
    try {
      const walletResult = await query('SELECT balance FROM wallet LIMIT 1');
      if (walletResult.rowCount > 0) {
        walletBalance = walletResult.rows[0].balance;
      }
    } catch(e) {
      // Wallet table might not exist yet
    }

    // 4. Son harcamaları al
    const recentExpensesResult = await query(`
      SELECT e.*, c.name as card_name 
      FROM expenses e
      LEFT JOIN cards c ON e.payment_method = c.id::text
      ORDER BY e.date DESC, e.created_at DESC
      LIMIT 5
    `);

    // Dinamik bütçe = Nakit + Kart Limitleri Toplamı
    const totalCardLimit = cardsResult.rows.reduce((sum, card) => sum + Number(card.limit), 0);
    const totalDebt = cardsResult.rows.reduce((sum, card) => sum + Number(card.current_debt), 0);
    const monthlyBudget = Number(walletBalance) + totalCardLimit;

    return NextResponse.json({ 
      success: true, 
      data: {
        totalExpenses,
        cards: cardsResult.rows,
        recentExpenses: recentExpensesResult.rows,
        walletBalance,
        monthlyBudget,
        totalDebt
      }
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    return NextResponse.json({ success: false, message: 'Veriler alınamadı' }, { status: 500 });
  }
}
