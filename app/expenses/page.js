"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const res = await fetch('/api/expenses');
        const json = await res.json();
        if (json.success) {
          setExpenses(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchExpenses();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>;

  return (
    <div style={{ padding: '1.5rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Link href="/" style={{
          background: 'var(--card-light)', border: '1px solid var(--border-color)', 
          borderRadius: '12px', width: '40px', height: '40px', display: 'flex', 
          justifyContent: 'center', alignItems: 'center', marginRight: '1rem'
        }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Tüm Harcamalar</h1>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {expenses.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-light-theme-sub)' }}>Henüz harcama yok.</div>
        ) : (
          expenses.map(exp => {
            const isCash = exp.payment_method === 'Nakit';
            const iconBg = isCash ? '#EAF7F4' : '#E8F1FA';
            const iconCol = isCash ? '#38B294' : '#1D5C96';

            return (
              <div key={exp.id} style={{ display: 'flex', alignItems: 'center', background: 'var(--card-light)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '12px', display: 'flex', 
                  justifyContent: 'center', alignItems: 'center', marginRight: '1rem',
                  backgroundColor: iconBg, color: iconCol
                }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{exp.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light-theme-sub)' }}>{exp.card_name || 'Nakit'}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', textAlign: 'right' }}>{Number(exp.amount).toLocaleString('tr-TR')} TL</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light-theme-sub)', textAlign: 'right', marginTop: '0.2rem' }}>
                    {new Date(exp.date).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div style={{ height: '40px' }}></div>
    </div>
  );
}
