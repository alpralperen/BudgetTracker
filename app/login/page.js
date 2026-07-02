"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function Login() {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const router = useRouter();

  // Add dark-mode class to body on mount, remove on unmount
  useEffect(() => {
    document.body.classList.add('dark-mode');
    return () => {
      document.body.classList.remove('dark-mode');
    };
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;

    const newPin = [...pin];
    // take only the last character if multiple are entered
    newPin[index] = value.substring(value.length - 1);
    setPin(newPin);

    // auto focus next
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    const enteredPin = pin.join('');
    if (enteredPin.length < 6) {
      setError('Lütfen 6 haneli PIN girin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: enteredPin }),
      });

      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.message || 'Hatalı PIN');
        setPin(['', '', '', '', '', '']);
        inputRefs.current[0].focus();
      }
    } catch (err) {
      setError('Bir hata oluştu. Tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.logoContainer}>
        <svg className={styles.logoIcon} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="15" y="25" width="70" height="50" rx="10" stroke="white" strokeWidth="4" />
          <path d="M25 55L40 40L55 50L75 30" stroke="#38B294" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="75" cy="30" r="4" fill="#38B294" />
        </svg>
        <h1 className={styles.title}>BudgetTracker</h1>
        <p className={styles.subtitle}>Bütçeni takip et, kontrol sende olsun.</p>
      </div>

      <div className={styles.pinContainer}>
        {pin.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={styles.pinBox}
          />
        ))}
      </div>

      {error && <p className={styles.errorText}>{error}</p>}

      <div className={styles.buttonContainer}>
        <button 
          className="btn-primary" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Giriş Yapılıyor...' : 'Başlayalım →'}
        </button>
      </div>
    </div>
  );
}
