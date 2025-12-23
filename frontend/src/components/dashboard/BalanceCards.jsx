// components/dashboard/BalanceCards.jsx
import React from 'react';

const BalanceCards = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Main Balance Card */}
      <div className="lg:col-span-2 rounded-2xl bg-background-dark border border-white/10 p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[200px]">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/20 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        
        <div className="relative z-10 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total Balance</p>
            <h3 className="text-4xl font-bold text-white tracking-tight">
              $1,250.00 <span className="text-xl text-gray-500 font-medium">USDC</span>
            </h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
            <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
          </div>
        </div>
        
        <div className="relative z-10 flex items-center gap-3 mt-6">
          <button className="flex items-center gap-2 bg-primary hover:bg-green-500 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(15,184,71,0.3)] hover:shadow-[0_0_30px_rgba(15,184,71,0.5)]">
            <span className="material-symbols-outlined">call_received</span>
            Receive Payment
          </button>
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-lg font-medium border border-white/10 transition-colors">
            <span className="material-symbols-outlined">send</span>
            Send
          </button>
        </div>
      </div>
      
      {/* Mini Stat Card */}
      <div className="rounded-2xl bg-surface border border-white/5 p-6 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">trending_up</span>
            <span className="text-sm font-medium text-gray-400">Monthly Inflow</span>
          </div>
          <p className="text-3xl font-bold text-white">+$3,450.00</p>
          <p className="text-xs text-primary mt-2 flex items-center gap-1">
            <span className="bg-primary/20 px-1.5 py-0.5 rounded text-primary font-bold">+12%</span>
            vs last month
          </p>
        </div>
      </div>
    </div>
  );
};

export default BalanceCards;