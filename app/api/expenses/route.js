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

    let isCard = payment_method !== 'Nakit';
    let result;

    if (isCard) {
      // 1. Kart borcunu güncelle
      await query(
        `UPDATE cards SET current_debt = current_debt + $1 WHERE id = $2`,
        [amount, payment_method]
      );

      // 2. Harcamayı ekle
      result = await query(
        `INSERT INTO expenses (title, amount, payment_method, date) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [title, amount, payment_method, expenseDate]
      );
    } else { // Nakit
      // Nakit ise cüzdandan (wallet) düş
      const checkResult = await query('SELECT id FROM wallet LIMIT 1');
      if (checkResult.rowCount > 0) {
        await query('UPDATE wallet SET balance = balance - $1 WHERE id = $2', [amount, checkResult.rows[0].id]);
      } else {
        // Cüzdan yoksa eksi bakiye ile oluştur
        await query('INSERT INTO wallet (balance) VALUES ($1)', [-parseFloat(amount)]);
      }

      result = await query(
        `INSERT INTO expenses (title, amount, payment_method, date) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [title, amount, 'Nakit', expenseDate]
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error adding expense:', error);
    return NextResponse.json({ success: false, message: 'Harcama eklenemedi' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID gerekli' }, { status: 400 });
    }

    // Harcamayı bul
    const expenseRes = await query(`SELECT * FROM expenses WHERE id = $1`, [id]);
    if (expenseRes.rowCount === 0) {
      return NextResponse.json({ success: false, message: 'Harcama bulunamadı' }, { status: 404 });
    }
    
    const expense = expenseRes.rows[0];
    
    // Geri alma (Revert) işlemleri
    if (expense.payment_method === 'Nakit') {
      // Nakit iadesi
      const checkResult = await query('SELECT id FROM wallet LIMIT 1');
      if (checkResult.rowCount > 0) {
        await query('UPDATE wallet SET balance = balance + $1 WHERE id = $2', [expense.amount, checkResult.rows[0].id]);
      }
    } else if (expense.payment_method === 'Kredi Kartı Ödemesi') {
      // Eğer bir ödeme geri alınıyorsa, kartın borcu geri artmalı (bunu bilemeyebiliriz, bu yüzden es geçiyoruz ya da kullanıcı manuel düzeltir)
      // Şimdilik sadece siliyoruz
    } else {
      // Kredi kartı harcaması iadesi
      await query(
        `UPDATE cards SET current_debt = GREATEST(current_debt - $1, 0) WHERE id = $2`,
        [expense.amount, expense.payment_method]
      );
    }

    // Harcamayı sil
    await query(`DELETE FROM expenses WHERE id = $1`, [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ success: false, message: 'Harcama silinemedi' }, { status: 500 });
  }
}

