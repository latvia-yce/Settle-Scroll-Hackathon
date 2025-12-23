// components/ConnectWalletModal.jsx
import React, { useEffect } from 'react';

const ConnectWalletModal = ({ isOpen, onClose }) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Center Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-glow-gradient opacity-60"></div>
        {/* Top Right Accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Login Card */}
        <div className="bg-surface-dark border border-border-dark rounded-xl p-8 shadow-2xl relative overflow-hidden group">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          
          {/* Subtle top highlight */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          {/* Card Header */}
          <div className="text-center mb-8">
            <div className="size-12 text-primary flex items-center justify-center bg-primary/10 rounded-lg mx-auto mb-4">
              <span className="material-symbols-outlined text-[28px]">receipt_long</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-3">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Invoice in USDC with zero gas fees. <br/>Securely login to manage your payments.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Connect Wallet Button */}
            <button className="relative w-full group/btn flex items-center justify-center gap-3 h-12 bg-primary hover:bg-[#0da33e] text-white font-bold rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(15,184,71,0.3)] hover:shadow-[0_0_30px_rgba(15,184,71,0.5)]">
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
              <span>Connect Wallet</span>
              <div className="absolute inset-0 rounded-lg ring-2 ring-white/20 group-hover/btn:ring-white/40 transition-all"></div>
            </button>
            
            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-border-dark"></div>
              <span className="flex-shrink-0 mx-4 text-xs text-gray-500 uppercase tracking-widest font-medium">Or</span>
              <div className="flex-grow border-t border-border-dark"></div>
            </div>
            
            {/* Continue with Google (AA) */}
            <button className="w-full flex items-center justify-center gap-3 h-12 bg-[#1c271f] hover:bg-[#253329] border border-border-dark text-white font-semibold rounded-lg transition-colors duration-200">
              {/* Google SVG Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
          
          {/* Trust Signal */}
          <div className="mt-8 pt-6 border-t border-border-dark flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-primary/80 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span className="text-xs font-semibold tracking-wide uppercase">Secured by Scroll ZKP</span>
            </div>
          </div>
        </div>
        
        {/* Features Grid below card (Subtle) */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <span className="material-symbols-outlined text-[24px]">bolt</span>
            <span className="text-xs font-medium">Instant</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <span className="material-symbols-outlined text-[24px]">local_gas_station</span>
            <span className="text-xs font-medium">Gasless</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <span className="material-symbols-outlined text-[24px]">lock</span>
            <span className="text-xs font-medium">Private</span>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>© 2024 Scroll Invoice. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletModal;