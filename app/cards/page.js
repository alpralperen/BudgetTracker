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

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>;

  const mainCard = cards[0]; // Just showing the first one as detailed for the design layout

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className={styles.title}>Kart Detayı</h1>
        <button className={styles.menuBtn}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </header>

      {mainCard ? (
        <>
          <div className={styles.mainCardDetail}>
            <div className={styles.cardHeader}>
              <svg className={styles.cardIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <div className={styles.cardName}>{mainCard.name}</div>
            </div>
            
            <div className={styles.cardStats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Limit</span>
                <span className={styles.statValue}>{Number(mainCard.limit).toLocaleString('tr-TR')} TL</span>
              </div>
              <div className={styles.statItem} style={{ textAlign: 'right' }}>
                <span className={styles.statLabel}>Güncel Borç</span>
                <span className={styles.statValue}>{Number(mainCard.current_debt).toLocaleString('tr-TR')} TL</span>
              </div>
            </div>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailBox}>
              <div className={styles.boxHeader}>
                <span className={styles.boxTitle}>Kullanılabilir Limit</span>
                <svg className={styles.boxIcon} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className={styles.boxValue}>{(mainCard.limit - mainCard.current_debt).toLocaleString('tr-TR')} TL</span>
            </div>

            <div className={styles.detailBox}>
              <div className={styles.boxHeader}>
                <span className={styles.boxTitle}>Asgari Ödeme</span>
                <svg className={styles.boxIcon} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className={styles.boxValue}>{(mainCard.current_debt * 0.2).toLocaleString('tr-TR')} TL</span>
              <span className={styles.boxSub}>%20</span>
            </div>

            <div className={styles.detailBox}>
              <div className={styles.boxHeader}>
                <span className={styles.boxTitle}>Hesap Kesim Tarihi</span>
                <svg className={styles.boxIcon} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className={styles.boxValue}>{mainCard.statement_day} Her Ay</span>
            </div>

            <div className={styles.detailBox}>
              <div className={styles.boxHeader}>
                <span className={styles.boxTitle}>Son Ödeme Tarihi</span>
                <svg className={styles.boxIcon} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className={styles.boxValue}>{mainCard.due_day} Her Ay</span>
            </div>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>Hiç kartınız yok, aşağıdan ekleyebilirsiniz.</div>
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

      {/* List of other cards could go here, but for now we follow the "Kart Detayı" design for the first one */}
      {cards.length > 1 && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Diğer Kartlarınız</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cards.slice(1).map(card => (
              <div key={card.id} style={{ background: 'white', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 600 }}>{card.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-light-theme-sub)' }}>Güncel Borç: {Number(card.current_debt).toLocaleString()} TL</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ height: '40px' }}></div>
    </div>
  );
}
