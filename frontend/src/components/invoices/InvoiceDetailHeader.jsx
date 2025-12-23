// components/invoices/InvoiceDetailHeader.jsx
import React from 'react';

const InvoiceDetailHeader = () => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 px-8 py-5 flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">Invoice Details</h2>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Scroll Mainnet</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <div className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-black"></div>
        </button>
        
        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-surface overflow-hidden border border-white/10">
          <img 
            alt="User Avatar" 
            className="h-full w-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeacGymUMH3-nk-dJf8IIQJblBD8tlqgylMEQXql_rj24-CqL-iTGhpVsohY1yy7dfAjAuGgoUq5mSGnbrRNRFm9zXuNrVxQJkZlqVMVysE8R5655Y2FmeQQ7TyTQAr8zgwc68RdEQdJeieFYt1iynhmPspIHoT_RmXMJrTi_SBtaM9Cfo4k6QRqNXy3yiIn5wr0jC2LVQ8QVwgL5KjngolI9IiBFEVMfUP_g6kWCr68XsJqBTEy54LP456QcFObfw3uq4yO9gCuFw"
          />
        </div>
      </div>
    </header>
  );
};

export default InvoiceDetailHeader;