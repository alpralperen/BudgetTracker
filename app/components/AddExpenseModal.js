"use client";

import { useState, useEffect } from 'react';
import styles from './AddExpenseModal.module.css';

export default function AddExpenseModal({ isOpen, onClose }) {
  const [cards, setCards] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Nakit');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCards();
    }
  }, [isOpen]);

  const fetchCards = async () => {
    try {
      const res = await fetch('/api/cards');
      const data = await res.json();
      if (data.success) {
        setCards(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!title || !amount) {
      alert("Lütfen harcama ismi ve miktar giriniz.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          amount: parseFloat(amount),
          payment_method: paymentMethod,
          date
        })
      });

      if (res.ok) {
        // Reset form
        setTitle('');
        setAmount('');
        setPaymentMethod('Nakit');
        onClose();
        // optionally trigger a re-fetch of dashboard data by emitting an event or reloading
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className={styles.title}>Harcama Ekle</h2>
          <button className={styles.scanBtn}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </button>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Harcama İsmi</label>
          <input 
            type="text" 
            placeholder="Harcama ismini girin" 
            className={styles.input}
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Miktar (TL)</label>
          <input 
            type="number" 
            placeholder="0,00" 
            className={styles.input}
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Kart / Hesap</label>
          <div className={styles.paymentOptions}>
            {cards.map(card => (
              <div 
                key={card.id} 
                className={`${styles.paymentOption} ${paymentMethod === card.id ? styles.selected : ''}`}
                onClick={() => setPaymentMethod(card.id)}
              >
                <div className={styles.optionIcon} style={{ background: '#E8F1FA', color: '#1D5C96' }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className={styles.optionDetails}>
                  <div className={styles.optionName}>{card.name}</div>
                  <div className={styles.optionSub}>{Number(card.current_debt).toLocaleString('tr-TR')} TL borç</div>
                </div>
                <div className={styles.radioBtn}>
                  <div className={styles.radioBtnInner}></div>
                </div>
              </div>
            ))}

            <div 
              className={`${styles.paymentOption} ${paymentMethod === 'Nakit' ? styles.selected : ''}`}
              onClick={() => setPaymentMethod('Nakit')}
            >
              <div className={styles.optionIcon} style={{ background: '#EAF7F4', color: '#38B294' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className={styles.optionDetails}>
                <div className={styles.optionName}>Nakit</div>
                <div className={styles.optionSub}>Nakit harcama</div>
              </div>
              <div className={styles.radioBtn}>
                <div className={styles.radioBtnInner}></div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Tarih</label>
          <input 
            type="date" 
            className={styles.input}
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        <div className={styles.saveBtnWrapper}>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}
