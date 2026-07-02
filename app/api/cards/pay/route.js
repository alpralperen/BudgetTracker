import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { card_id, amount } = await request.json();
    
    if (!card_id || !amount) {
      return NextResponse.json({ success: false, message: 'Eksik bilgi girdiniz' }, { status: 400 });
    }

    const payAmount = parseFloat(amount);

    // 1. Kart borcunu azalt
    const updateResult = await query(
      `UPDATE cards SET current_debt = GREATEST(current_debt - $1, 0) WHERE id = $2 RETURNING *`,
      [payAmount, card_id]
    );

    if (updateResult.rowCount === 0) {
      return NextResponse.json({ success: false, message: 'Kart bulunamadı' }, { status: 404 });
    }

    const card = updateResult.rows[0];

    // 2. Harcamalar tablosuna (geçmişe) ödeme olarak ekle
    // Not: Harici ödeme olduğu için cüzdandan düşmüyoruz
    const expenseTitle = `${card.name} - Kart Borcu Ödemesi`;
    await query(
      `INSERT INTO expenses (title, amount, payment_method, card_id) 
       VALUES ($1, $2, $3, $4)`,
      [expenseTitle, payAmount, 'Kredi Kartı Ödemesi', card_id]
    );

    return NextResponse.json({ success: true, data: card });
  } catch (error) {
    console.error('Error paying card:', error);
    return NextResponse.json({ success: false, message: 'Ödeme gerçekleştirilemedi' }, { status: 500 });
  }
}
