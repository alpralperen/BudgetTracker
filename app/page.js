"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const [data, setData] = useState({ totalExpenses: 0, cards: [], recentExpenses: [], walletBalance: 0, monthlyBudget: 0 });
  const [loading, setLoading] = useState(true);
  
  // Edit Cash Modal State
  const [showCashModal, setShowCashModal] = useState(false);
  const [cashInput, setCashInput] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/dashboard');
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleUpdateCash = async () => {
    try {
      const res = await fetch('/api/wallet', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balance: cashInput })
      });
      if (res.ok) {
        setShowCashModal(false);
        // Refresh data
        const refreshRes = await fetch('/api/dashboard');
        const json = await refreshRes.json();
        if (json.success) setData(json.data);
      }
    } catch(e) {
      console.error(e);
      alert('Nakit güncellenemedi');
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>;
  }

  const { totalExpenses, cards, recentExpenses, walletBalance, monthlyBudget, totalDebt } = data;
  const budgetPercentage = monthlyBudget > 0 ? Math.min(Math.round((totalDebt / monthlyBudget) * 100), 100) : 0;

  const getCardStyle = (name) => {
    if (name.toLowerCase().includes('iş bankası')) return { bg: '#1D5C96', iconBg: '#E8F1FA', iconCol: '#1D5C96' };
    if (name.toLowerCase().includes('akbank')) return { bg: '#8C52FF', iconBg: '#F3E8FF', iconCol: '#8C52FF' };
    return { bg: '#6B7280', iconBg: '#F3F4F6', iconCol: '#6B7280' };
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <div className={styles.greeting}>Merhaba! 👋</div>
          <h1 className={styles.title}>Genel Bakış</h1>
        </div>
        <div className={styles.bellIcon}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
      </header>

      <section className={styles.mainCard}>
        <div className={styles.chartCircle}>
          %{budgetPercentage}
        </div>
        <div className={styles.cardTitle}>Bu Ay Toplam Harcama</div>
        <div className={styles.totalAmount}>
          {Number(totalExpenses).toLocaleString('tr-TR')} <span className={styles.currency}>TL</span>
        </div>
        <div className={styles.trend}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          %18 geçen aya göre
        </div>

        <div className={styles.budgetRow}>
          <div className={styles.budgetInfo}>
            <div className={styles.budgetLabels}>
              <span>Aylık Bütçe</span>
              <span>{Number(monthlyBudget).toLocaleString('tr-TR')} TL</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${budgetPercentage}%` }}></div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Kartlarım</h2>
          <Link href="/cards" className={styles.seeAll}>Tümü</Link>
        </div>
        
        <div className={styles.cardList}>
          {cards.map(card => {
            const styleInfo = getCardStyle(card.name);
            return (
              <div key={card.id} className={styles.bankCard}>
                <div className={styles.cardIcon} style={{ backgroundColor: styleInfo.iconBg, color: styleInfo.iconCol }}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className={styles.cardDetails}>
                  <div className={styles.cardName}>{card.name}</div>
                  <div className={styles.cardLimit}>Limit: {Number(card.limit).toLocaleString('tr-TR')} TL</div>
                </div>
                <div className={styles.cardBalances}>
                  <div className={styles.cardDebt}>Kalan: {Number(card.limit - card.current_debt).toLocaleString('tr-TR')} TL</div>
                  <div className={styles.cardDate}>Son Ödeme: {card.due_day} Her Ay</div>
                </div>
              </div>
            );
          })}
          
          <div className={styles.bankCard} onClick={() => { setCashInput(walletBalance); setShowCashModal(true); }} style={{ cursor: 'pointer' }}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#EAF7F4', color: '#38B294' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className={styles.cardDetails}>
              <div className={styles.cardName}>Nakit Cüzdanı</div>
              <div className={styles.cardLimit} style={{ color: '#38B294' }}>Düzenlemek için tıkla</div>
            </div>
            <div className={styles.cardBalances}>
              <div className={styles.cardDebt}>{Number(walletBalance).toLocaleString('tr-TR')} TL</div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Son Harcamalar</h2>
          <span className={styles.seeAll}>Tümü</span>
        </div>

        <div className={styles.expenseList}>
          {recentExpenses.map((exp, idx) => {
            const isCash = exp.payment_method === 'Nakit';
            const iconBg = isCash ? '#EAF7F4' : '#E8F1FA';
            const iconCol = isCash ? '#38B294' : '#1D5C96';
            
            return (
              <div key={exp.id || idx} className={styles.expenseItem}>
                <div className={styles.expenseIcon} style={{ backgroundColor: iconBg, color: iconCol }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className={styles.expenseDetails}>
                  <div className={styles.expenseName}>{exp.title}</div>
                  <div className={styles.expenseSource}>{exp.card_name || 'Nakit'}</div>
                </div>
                <div>
                  <div className={styles.expenseAmount}>{Number(exp.amount).toLocaleString('tr-TR')} TL</div>
                  <div className={styles.expenseDate}>Bugün</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      
      {showCashModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'var(--card-light)', padding: '2rem', 
            borderRadius: '24px', width: '90%', maxWidth: '400px'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Nakit Bakiye Düzenle</h3>
            <input 
              type="number"
              value={cashInput}
              onChange={e => setCashInput(e.target.value)}
              style={{
                width: '100%', padding: '1rem', border: '1px solid var(--border-color)',
                borderRadius: '12px', marginBottom: '1rem', fontSize: '1.1rem', color: '#000'
              }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setShowCashModal(false)}
                style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: '#eee', color: '#333', fontWeight: '600' }}
              >
                İptal
              </button>
              <button 
                onClick={handleUpdateCash}
                style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: 'var(--primary-teal)', color: '#fff', fontWeight: '600' }}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ height: '40px' }}></div>
    </div>
  );
}
