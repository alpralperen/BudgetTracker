"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './cards.module.css';

export default function Cards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Add Card State
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [currentDebt, setCurrentDebt] = useState('0');
  const [statementDay, setStatementDay] = useState(5);
  const [dueDay, setDueDay] = useState(15);
  const [submitting, setSubmitting] = useState(false);

  // Edit Debt State
  const [editingCardId, setEditingCardId] = useState(null);
  const [editDebtValue, setEditDebtValue] = useState('');

  // Accordion State
  const [expandedCardId, setExpandedCardId] = useState(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const res = await fetch('/api/cards');
      const json = await res.json();
      if (json.success) {
        setCards(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async () => {
    if (!name || !limit) {
      alert('Lütfen kart adı ve limitini girin.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          limit: parseFloat(limit),
          current_debt: parseFloat(currentDebt) || 0,
          statement_day: parseInt(statementDay),
          due_day: parseInt(dueDay)
        })
      });
      if (res.ok) {
        setName('');
        setLimit('');
        setCurrentDebt('0');
        setShowAddForm(false);
        fetchCards();
      }
    } catch (err) {
      console.error(err);
      alert('Kart eklenemedi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateDebt = async (id) => {
    try {
      const res = await fetch('/api/cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          current_debt: parseFloat(editDebtValue) || 0
        })
      });
      if (res.ok) {
        setEditingCardId(null);
        fetchCards();
      } else {
        alert('Borç güncellenemedi.');
      }
    } catch (err) {
      console.error(err);
      alert('Bir hata oluştu.');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className={styles.title}>Kartlarım</h1>
        <button className={styles.menuBtn}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </header>

      {cards.length === 0 ? (
        <div style={{ textAlign: 'center', margin: '2rem 0', color: 'var(--text-light-theme-sub)' }}>
          Hiç kartınız yok, aşağıdan ekleyebilirsiniz.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {cards.map(card => {
            const isExpanded = expandedCardId === card.id;

            return (
              <div 
                key={card.id} 
                style={{ 
                  background: 'white', 
                  borderRadius: '16px', 
                  border: '1px solid var(--border-color)', 
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  boxShadow: isExpanded ? 'var(--shadow-md)' : 'var(--shadow-sm)'
                }}
              >
                {/* Closed Header Section */}
                <div 
                  onClick={() => setExpandedCardId(isExpanded ? null : card.id)}
                  style={{ 
                    padding: '1.25rem', display: 'flex', justifyContent: 'space-between', 
                    alignItems: 'center', cursor: 'pointer' 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '50%', 
                      background: 'var(--bg-light)', display: 'flex', 
                      justifyContent: 'center', alignItems: 'center', color: 'var(--primary-teal)'
                    }}>
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-light-theme-main)' }}>{card.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-light-theme-sub)' }}>
                        Kalan: {Number(card.limit - card.current_debt).toLocaleString()} TL
                      </div>
                    </div>
                  </div>
                  <div>
                    <svg 
                      width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      style={{ 
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', 
                        transition: 'transform 0.3s ease', color: 'var(--text-light-theme-sub)'
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light-theme-sub)', marginBottom: '0.25rem' }}>Toplam Limit</div>
                        <div style={{ fontWeight: 600 }}>{Number(card.limit).toLocaleString('tr-TR')} TL</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light-theme-sub)', marginBottom: '0.25rem' }}>Asgari Ödeme</div>
                        <div style={{ fontWeight: 600 }}>{(card.current_debt * 0.2).toLocaleString('tr-TR')} TL</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light-theme-sub)', marginBottom: '0.25rem' }}>Hesap Kesim</div>
                        <div style={{ fontWeight: 600 }}>{card.statement_day}. Gün</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light-theme-sub)', marginBottom: '0.25rem' }}>Son Ödeme</div>
                        <div style={{ fontWeight: 600 }}>{card.due_day}. Gün</div>
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-light)', padding: '1rem', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Güncel Borç</span>
                        {editingCardId === card.id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input 
                              type="number" 
                              value={editDebtValue} 
                              onChange={e => setEditDebtValue(e.target.value)}
                              style={{ width: '80px', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', color: '#000' }}
                              autoFocus
                            />
                            <button onClick={() => handleUpdateDebt(card.id)} style={{ background: 'var(--primary-teal)', color: 'white', padding: '0.5rem', borderRadius: '8px' }}>✓</button>
                            <button onClick={() => setEditingCardId(null)} style={{ background: '#ccc', color: '#333', padding: '0.5rem', borderRadius: '8px' }}>✕</button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 700, color: '#D9455F' }}>{Number(card.current_debt).toLocaleString('tr-TR')} TL</span>
                            <button 
                              onClick={() => { setEditingCardId(card.id); setEditDebtValue(card.current_debt); }} 
                              style={{ color: 'var(--primary-teal)', padding: '0.2rem' }}
                            >
                              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showAddForm ? (
        <div className={styles.addCardForm}>
          <h3 style={{ marginBottom: '1rem' }}>Yeni Kart Ekle</h3>
          <div className={styles.formGroup}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Kart Adı</label>
            <input 
              type="text" 
              className={styles.input} 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Örn: İş Bankası Kredi Kartı" 
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Limit (TL)</label>
              <input 
                type="number" 
                className={styles.input} 
                value={limit} 
                onChange={e => setLimit(e.target.value)} 
                placeholder="Örn: 25000" 
              />
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Güncel Borç (TL)</label>
              <input 
                type="number" 
                className={styles.input} 
                value={currentDebt} 
                onChange={e => setCurrentDebt(e.target.value)} 
                placeholder="Örn: 1500" 
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Hesap Kesim (Gün)</label>
              <input 
                type="number" 
                className={styles.input} 
                value={statementDay} 
                onChange={e => setStatementDay(e.target.value)} 
                min="1" max="31"
              />
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Son Ödeme (Gün)</label>
              <input 
                type="number" 
                className={styles.input} 
                value={dueDay} 
                onChange={e => setDueDay(e.target.value)} 
                min="1" max="31"
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button className="btn-primary" style={{ background: '#ddd', color: '#333' }} onClick={() => setShowAddForm(false)}>İptal</button>
            <button className="btn-primary" onClick={handleAddCard} disabled={submitting}>
              {submitting ? 'Ekleniyor...' : 'Ekle'}
            </button>
          </div>
        </div>
      ) : (
        <button 
          className="btn-primary" 
          onClick={() => setShowAddForm(true)}
          style={{ marginBottom: '2rem' }}
        >
          + Yeni Kart Ekle
        </button>
      )}

      <div style={{ height: '40px' }}></div>
    </div>
  );
}
