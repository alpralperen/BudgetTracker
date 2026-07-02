"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchExpenses = async () => {
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
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDeleteExpense = async (id) => {
    if (!confirm('Bu harcamayı silmek istediğinize emin misiniz? Bakiye/borç işlemleriniz geri alınacaktır.')) return;
    
    setDeletingId(id);
    try {
      const res = await fetch('/api/expenses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        fetchExpenses();
      } else {
        alert('Harcama silinemedi.');
      }
    } catch (e) {
      console.error(e);
      alert('Silme sırasında hata oluştu.');
    } finally {
      setDeletingId(null);
    }
  };

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
            const iconBg = isCash ? '#FBE9E7' : '#E8F1FA';
            const iconCol = isCash ? '#D84315' : '#1D5C96';

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
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light-theme-sub)' }}>{exp.card_name || exp.payment_method}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    -{Number(exp.amount).toLocaleString('tr-TR')} TL
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light-theme-sub)' }}>
                      {new Date(exp.date).toLocaleDateString('tr-TR')}
                    </span>
                    <button 
                      onClick={() => handleDeleteExpense(exp.id)}
                      disabled={deletingId === exp.id}
                      style={{ 
                        background: 'none', border: 'none', color: '#EF4444', 
                        cursor: 'pointer', padding: '0.1rem', opacity: deletingId === exp.id ? 0.5 : 1
                      }}
                      title="Harcamayı Sil"
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
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
