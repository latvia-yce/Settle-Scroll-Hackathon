// pages/SettlementSuccess.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function SettlementSuccess() {
  const navigate = useNavigate();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="dark">
      <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen flex flex-col relative overflow-hidden">
        {/* Ambient Background Effects */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
        
        {/* Minimal Header */}
        <header className="w-full flex justify-center py-8 absolute top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="size-6 text-primary animate-pulse-slow">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_logo)">
                  <path 
                    clipRule="evenodd" 
                    d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" 
                    fill="currentColor" 
                    fillRule="evenodd"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_logo">
                    <rect fill="white" height="48" width="48"></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold tracking-widest uppercase opacity-80">Settle</h2>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative z-10">
          <div className="max-w-[480px] w-full flex flex-col items-center animate-scale-in">
            
            {/* Success Indicator */}
            <div className="mb-8 relative group">
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl neon-shadow"></div>
              {/* Checkmark Container */}
              <div className="relative flex items-center justify-center size-24 md:size-28 rounded-full border-2 border-primary bg-background-dark shadow-[0_0_30px_rgba(31,249,104,0.2)]">
                <span 
                  className="material-symbols-outlined text-primary text-[64px] md:text-[72px]" 
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}
                >
                  check
                </span>
              </div>
            </div>
            
            {/* Headline & Amount */}
            <div className="text-center mb-10">
              <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-3">
                Settlement Completed!
              </h1>
              <p className="text-primary text-2xl md:text-3xl font-bold tracking-tight text-glow font-mono">
                5,000.00 USDC
              </p>
            </div>
            
            {/* Transaction Details Card */}
            <div className="w-full bg-surface-dark border border-border-dark rounded-xl overflow-hidden backdrop-blur-md border-glow mb-8">
              <div className="p-5 space-y-4">
                
                {/* Transaction Hash */}
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <p className="text-[#9bbba6] text-sm font-medium">Transaction Hash</p>
                  <div 
                    className="flex items-center gap-2 group cursor-pointer" 
                    title="Copy Hash"
                    onClick={() => copyToClipboard('0x71C...9A2')}
                  >
                    <p className="text-white text-sm font-mono tracking-wide">0x71C...9A2</p>
                    <span className="material-symbols-outlined text-sm text-[#9bbba6] group-hover:text-primary transition-colors">
                      content_copy
                    </span>
                  </div>
                </div>
                
                {/* Network */}
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <p className="text-[#9bbba6] text-sm font-medium">Network</p>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-primary shadow-[0_0_5px_#1ff968]"></div>
                    <p className="text-white text-sm font-medium">Scroll L2</p>
                  </div>
                </div>
                
                {/* Timestamp */}
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <p className="text-[#9bbba6] text-sm font-medium">Time</p>
                  <p className="text-white text-sm font-medium">Oct 24, 2023 · 14:32 UTC</p>
                </div>
                
                {/* Gas Fee */}
                <div className="flex justify-between items-center">
                  <p className="text-[#9bbba6] text-sm font-medium">Gas Fee</p>
                  <div className="px-2 py-1 bg-primary/10 rounded border border-primary/20">
                    <p className="text-primary text-xs font-bold uppercase tracking-wide">$0.00 (Settle)</p>
                  </div>
                </div>
              </div>
              
              {/* Bottom Decorative Bar */}
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            </div>
            
            {/* Primary CTA */}
            <button 
              onClick={handleReturnToDashboard}
              className="w-full group bg-primary hover:bg-[#1adb5b] text-[#050505] h-12 rounded-lg font-bold text-base transition-all transform active:scale-[0.99] shadow-[0_0_20px_rgba(31,249,104,0.15)] hover:shadow-[0_0_30px_rgba(31,249,104,0.3)] flex items-center justify-center gap-2 overflow-hidden relative"
            >
              <span className="relative z-10">Return to Dashboard</span>
              <span className="material-symbols-outlined relative z-10 text-lg transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
              {/* Button shine effect */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-in-out z-0"></div>
            </button>
            
            {/* Security Badge */}
            <div className="mt-8 flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity duration-300">
              <span className="material-symbols-outlined text-2xl text-white">verified_user</span>
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white">
                Secured by Scroll ZKP
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SettlementSuccess;