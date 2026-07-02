"use client";

import Link from 'next/link';

export default function ReportsPage() {
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
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Raporlar</h1>
      </header>

      <div style={{ 
        background: 'var(--card-light)', 
        borderRadius: '24px', 
        padding: '2rem', 
        textAlign: 'center',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%', background: '#EAF7F4', color: '#38B294',
          display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1rem'
        }}>
          <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Gelişmiş Raporlar</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-light-theme-sub)', lineHeight: 1.5 }}>
          Bu sayfa yakında eklenecek. Geçmiş aylara dönük harcama analizlerinizi ve grafiklerinizi buradan takip edebileceksiniz.
        </p>
      </div>
      
      <div style={{ height: '40px' }}></div>
    </div>
  );
}
