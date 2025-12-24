// pages/SecureTransfer.jsx
import React, { useState } from 'react';

function SecureTransfer() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState('pending'); // 'pending', 'processing', 'success', 'error'
  
  // In your SecureTransfer.jsx, update the handleConfirmTransaction function:
const handleConfirmTransaction = () => {
    setIsProcessing(true);
    setTransactionStatus('processing');
    
    // Simulate transaction processing
    setTimeout(() => {
    setIsProcessing(false);
    setTransactionStatus('success');
    
    // Redirect to success page after 2 seconds
    setTimeout(() => {
        navigate('/success');
    }, 2000);
    }, 3000);
};

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="dark">
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center text-slate-900 dark:text-white overflow-x-hidden selection:bg-primary selection:text-white">
        {/* Background Elements for visual depth */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
        </div>

        {/* Layouting Container */}
        <div className="relative w-full max-w-[1200px] px-4 py-8 flex flex-col md:flex-row gap-8 items-start justify-center grow">
          {/* Main Transaction Card */}
          <main className="w-full max-w-[520px] mx-auto flex flex-col gap-6 z-10">
            {/* Logo Header */}
            <div className="flex items-center justify-center gap-2 mb-4 opacity-90">
              <div className="size-6 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    clipRule="evenodd" 
                    d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" 
                    fill="currentColor" 
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-white text-xl font-bold tracking-tight">Scroll Pay</h2>
            </div>

            {/* Card */}
            <div className="bg-surface-dark border border-border-dark rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm">
              {/* Card Header */}
              <div className="p-8 border-b border-border-dark bg-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                <div className="flex flex-col gap-2 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-white text-3xl font-black tracking-tight mb-1">Secure Transfer</h1>
                      <p className="text-text-secondary text-sm font-medium">Review Transaction</p>
                    </div>
                    <span className="material-symbols-outlined text-primary text-4xl opacity-80">verified_user</span>
                  </div>
                  <p className="text-text-secondary text-xs mt-2 opacity-80">
                    Please verify the transaction details carefully before confirming.
                  </p>
                </div>
              </div>

              {/* Amount Display */}
              <div className="py-10 px-8 flex justify-center bg-gradient-to-b from-surface-dark to-[#050a06]">
                <h1 className="text-white text-5xl font-bold tracking-tight text-center drop-shadow-lg tabular-nums">
                  $1,250 <span className="text-2xl text-text-secondary font-medium">USDC</span>
                </h1>
              </div>

              {/* Details List */}
              <div className="px-8 pb-8">
                <div className="space-y-4">
                  {/* From */}
                  <div 
                    className="flex items-center justify-between group cursor-pointer"
                    onClick={() => copyToClipboard('0x71C...9A2')}
                  >
                    <p className="text-text-secondary text-sm font-medium">From</p>
                    <div className="flex items-center gap-2 text-white bg-[#1a261e] px-3 py-1.5 rounded-full border border-border-dark group-hover:border-primary/30 transition-colors">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 block"></div>
                      <span className="text-sm font-mono tracking-wide">0x71C...9A2</span>
                      <span className="material-symbols-outlined text-xs text-text-secondary">content_copy</span>
                    </div>
                  </div>

                  {/* To */}
                  <div 
                    className="flex items-center justify-between group cursor-pointer"
                    onClick={() => copyToClipboard('0x3f0...11b')}
                  >
                    <p className="text-text-secondary text-sm font-medium">To</p>
                    <div className="flex items-center gap-2 text-white bg-[#1a261e] px-3 py-1.5 rounded-full border border-border-dark group-hover:border-primary/30 transition-colors">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 block"></div>
                      <span className="text-sm font-mono tracking-wide">0x3f0...11b</span>
                      <span className="material-symbols-outlined text-xs text-text-secondary">content_copy</span>
                    </div>
                  </div>

                  <div className="h-px bg-border-dark my-4"></div>

                  {/* Network Fee */}
                  <div className="flex justify-between items-center py-1">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-text-secondary text-sm">local_gas_station</span>
                      <p className="text-text-secondary text-sm font-medium">Network Fee</p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary text-sm font-bold tracking-wide shadow-neon inline-block px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                        <span className="line-through opacity-50 mr-2 text-white">$0.31</span>
                        FREE (Sponsored)
                      </p>
                    </div>
                  </div>

                  {/* Est Time */}
                  <div className="flex justify-between items-center py-1">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-text-secondary text-sm">timer</span>
                      <p className="text-text-secondary text-sm font-medium">Est. Time</p>
                    </div>
                    <div className="flex items-center gap-1 text-white">
                      <span className="material-symbols-outlined text-yellow-400 text-sm">bolt</span>
                      <p className="text-sm font-bold">&lt; 10 Seconds</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-8">
                  <button 
                    onClick={handleConfirmTransaction}
                    disabled={isProcessing}
                    className={`group w-full relative flex items-center justify-center overflow-hidden rounded-lg h-14 text-white text-base font-bold tracking-wide transition-all ${
                      isProcessing 
                        ? 'bg-primary/50 cursor-not-allowed' 
                        : 'bg-primary hover:bg-primary-hover shadow-[0_0_20px_rgba(15,184,71,0.3)] hover:shadow-[0_0_30px_rgba(15,184,71,0.5)]'
                    }`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <svg 
                          className="animate-spin h-5 w-5 text-white" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24"
                        >
                          <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                          ></circle>
                          <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <span className="relative z-10 flex items-center gap-2">
                        Confirm Transaction
                        <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      </span>
                    )}
                  </button>
                </div>

                {/* Security Badge */}
                <div className="mt-6 flex justify-center items-center gap-2 text-text-secondary opacity-60 hover:opacity-100 transition-opacity cursor-help">
                  <span className="material-symbols-outlined text-sm">shield_lock</span>
                  <p className="text-xs font-medium uppercase tracking-wider">Secured by Scroll ZKP</p>
                </div>
              </div>
            </div>
          </main>

          {/* UI State Demonstrations (Side Panel for Design Context) */}
          <aside className="w-full max-w-[360px] flex flex-col gap-6 mt-12 md:mt-0 opacity-90">
            <h3 className="text-text-secondary text-xs font-bold uppercase tracking-widest pl-2"></h3>
            
            {/* Loading State Representation */}
            <div className="bg-surface-dark border border-border-dark rounded-xl p-6 relative overflow-hidden">
              <div className="flex flex-col gap-4 items-center justify-center text-center py-4">
                <div className="relative size-12">
                  <svg 
                    className="animate-spin text-primary w-full h-full" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    ></circle>
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Settling Transaction</p>
                  <p className="text-text-secondary text-sm mt-1">Processing gasless settlement...</p>
                </div>
              </div>
              {/* Visual cue for context */}
              <div className="absolute bottom-0 left-0 h-1 bg-primary w-2/3 animate-pulse"></div>
            </div>

            {/* Error State Representation */}
            <div className="bg-danger-surface border border-danger/30 rounded-xl p-4 flex gap-3 items-start">
              <span className="material-symbols-outlined text-danger shrink-0 mt-0.5">error</span>
              <div>
                <p className="text-white font-bold text-sm">Transaction Failed</p>
                <p className="text-danger-200 text-xs mt-1 leading-relaxed text-gray-300">
                  Insufficient USDC Balance. Please top up your wallet and try again.
                </p>
              </div>
            </div>

            {/* Toast Example */}
            <div className="bg-surface-dark border border-border-dark rounded-lg p-3 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary shadow-neon"></div>
                <span className="text-sm font-mono text-text-secondary">
                  Gas saved: <span className="text-white font-bold">$14.20</span>
                </span>
              </div>
              <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                LIFETIME
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default SecureTransfer;