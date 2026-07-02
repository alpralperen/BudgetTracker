"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import BottomNav from './BottomNav';
import AddExpenseModal from './AddExpenseModal';

export default function ClientLayoutWrapper({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  const isLoginPage = pathname === '/login';

  return (
    <>
      <div style={{ paddingBottom: isLoginPage ? '0' : '80px' }}>
        {children}
      </div>
      
      {!isLoginPage && (
        <>
          <BottomNav onAddExpense={() => setIsModalOpen(true)} />
          <AddExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
      )}
    </>
  );
}
