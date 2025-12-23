// pages/CreateInvoice.jsx
import React, { useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { useInvoice } from '../hooks/useWeb3';
import { useAccountAbstraction } from '../hooks/useAccountAbstraction';

function CreateInvoice() {
  const { isConnected, account, isCorrectNetwork } = useWeb3();
  const { createInvoice, loading: invoiceLoading } = useInvoice();
  const { createInvoiceGasless, canPerformGaslessTx } = useAccountAbstraction();

  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');
  const [useGasless, setUseGasless] = useState(true);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isConnected) {
      setShowWalletModal(true);
      return;
    }

    if (!isCorrectNetwork) {
      alert('Please switch to Scroll Sepolia network');
      return;
    }

    if (!clientAddress || !amount || !serviceDescription || !dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const dueDateTimestamp = Math.floor(new Date(dueDate).getTime() / 1000);

      let result;
      if (useGasless && canPerformGaslessTx()) {
        result = await createInvoiceGasless(amount, clientAddress, serviceDescription, dueDateTimestamp);
      } else {
        result = await createInvoice(amount, clientAddress, serviceDescription, dueDateTimestamp);
      }

      if (result.success) {
        setInvoiceId(result.invoiceId || 'inv-' + Math.random().toString(36).substr(2, 9));
        setShowSuccessModal(true);
      } else {
        alert('Failed to create invoice: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Error creating invoice: ' + error.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="dark">
      <div className="bg-black text-white font-display min-h-screen flex flex-col overflow-x-hidden antialiased selection:bg-[#0fb847] selection:text-black">
        {/* Navbar */}
        <header className="w-full border-b border-[#222] bg-black/50 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 select-none">
              <div className="flex items-center justify-center size-8 rounded bg-[#0fb847]/20 text-[#0fb847]">
                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
              </div>
              <h2 className="text-white text-lg font-bold tracking-tight">Settle</h2>
            </div>
            <button className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#111] border border-[#333] hover:bg-[#1a1a1a] transition-colors cursor-pointer group">
              <div className="size-2 rounded-full bg-[#0fb847] shadow-[0_0_8px_#0fb847]"></div>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white">0x71C...9A23</span>
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6 py-8 relative">
          {/* Abstract Background Glows */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <img 
              className="absolute top-[-20%] left-[10%] w-[800px] h-[800px] opacity-40 blur-3xl" 
              alt="Abstract green glow gradient for background atmosphere" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgzs2BAtHhWDFbRxrYeaLmwoDcD1OXIwOVAUCJCdhNuuDNP8wCWEvEC7-_uvduxULcqQaKezbxiIcNm7vDPuOzWfg-S59H-y2Y7G6EzV83BYeZU_XpVISwyGzwFL8Sl8xW_JqpwgYA8AIv4pRjXlEkPMwFjY1LTe_Ow1qO0ZLev2WziYtLX2gJNrCMfsnsusoWuy-cQOWM21F6RuFSQhYOXU4Ofw0cxJBdSP4qsFlnfWCWEYsTEnWakK6RLGDAmpSaqSysiNqzP7JU"
            />
          </div>

          <div className="relative z-10 w-full max-w-[560px] flex flex-col gap-6">
            {/* Page Header */}
            <div className="flex flex-col gap-2 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Create New Invoice</h1>
              <p className="text-[#888] text-sm md:text-base font-normal">Gasless USDC invoicing on Scroll Network</p>
            </div>

            {/* Form Card */}
            <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-6 md:p-8 shadow-[0_0_40px_-15px_rgba(0,0,0,0.8)]">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Client Name Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400">Client Name</label>
                  <input
                    className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white placeholder:text-[#555] focus:outline-none focus:border-[#0fb847] focus:ring-1 focus:ring-[#0fb847] transition-all"
                    placeholder="e.g., Kayaba Labs"
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>

                {/* Client Address Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400">Client Wallet Address</label>
                  <input
                    className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white placeholder:text-[#555] focus:outline-none focus:border-[#0fb847] focus:ring-1 focus:ring-[#0fb847] transition-all font-mono"
                    placeholder="0x..."
                    type="text"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                  />
                </div>

                {/* Amount Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400">Amount to Request</label>
                  <div className="relative flex items-center">
                    <input 
                      className="w-full bg-[#111] border border-[#333] rounded-lg pl-4 pr-16 py-3 text-white placeholder:text-[#555] focus:outline-none focus:border-[#0fb847] focus:ring-1 focus:ring-[#0fb847] transition-all font-mono" 
                      placeholder="0.00" 
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <div className="absolute right-4 pointer-events-none flex items-center gap-2">
                      <span className="text-[#0fb847] font-bold text-sm">USDC</span>
                    </div>
                  </div>
                  {/* Validation Message Example */}
                  {/* <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    Please enter a valid amount.
                  </p> */}
                </div>

                {/* Service Description Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400">Service Description</label>
                  <textarea 
                    className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white placeholder:text-[#555] focus:outline-none focus:border-[#0fb847] focus:ring-1 focus:ring-[#0fb847] transition-all min-h-[100px] resize-none" 
                    placeholder="e.g., Smart Contract Audit for Q3 2024"
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                  ></textarea>
                </div>

                {/* Recipient Wallet Field (Read Only) */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-400">Receiving Wallet</label>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-gray-600 text-[18px]">lock</span>
                    </div>
                    <input 
                      className="w-full bg-[#050505] border border-[#222] rounded-lg pl-10 pr-4 py-3 text-gray-500 font-mono text-sm cursor-not-allowed focus:outline-none select-none" 
                      readOnly 
                      type="text" 
                      value="0x71C7656EC7ab88b098defB751B7401B5f6d89A23"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-xs text-[#333] font-medium border border-[#222] px-1.5 py-0.5 rounded">READ ONLY</span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#222] w-full my-2"></div>

                {/* Action Button */}
                <button
                  type="submit"
                  disabled={invoiceLoading || !isConnected}
                  className="w-full bg-[#0fb847] hover:bg-[#0da03f] disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold text-base md:text-lg rounded-lg py-3.5 transition-all shadow-[0_0_20px_-8px_#0fb847] hover:shadow-[0_0_30px_-5px_#0fb847] flex items-center justify-center gap-2 group active:scale-[0.99]"
                >
                  {invoiceLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                      <span>Creating Invoice...</span>
                    </>
                  ) : !isConnected ? (
                    <>
                      <span>Connect Wallet to Create Invoice</span>
                      <span className="material-symbols-outlined">account_balance_wallet</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Payment Link</span>
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-2 mt-2 opacity-60 hover:opacity-100 transition-opacity cursor-help">
              <span className="material-symbols-outlined text-[#0fb847] text-[20px]">verified_user</span>
              <span className="text-xs md:text-sm text-gray-400 font-medium tracking-wide">
                Secured by Scroll ZKP
              </span>
            </div>
          </div>
        </main>

        {/* Success Modal - Initially hidden */}
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm ${showSuccessModal ? '' : 'hidden'}`}
          onClick={() => setShowSuccessModal(false)}
        >
          <div className="bg-[#111] border border-[#333] rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
            {/* Modal Glow */}
            <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-64 h-64 bg-[#0fb847]/10 rounded-full blur-[60px] pointer-events-none"></div>
            
            <div className="size-16 rounded-full bg-[#0fb847]/10 text-[#0fb847] flex items-center justify-center mb-6 ring-1 ring-[#0fb847]/30 relative z-10">
              <span className="material-symbols-outlined text-4xl">check</span>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Invoice Created!</h3>
            <p className="text-gray-400 mb-6 text-sm relative z-10">Share the link below to get paid.</p>
            
            <div className="w-full bg-black border border-[#333] rounded-lg p-1.5 flex items-center gap-2 mb-6 relative z-10">
              <div className="flex-1 px-3 text-sm text-gray-300 font-mono truncate">
                settle.finance/pay/inv-123
              </div>
              <button 
                onClick={() => copyToClipboard('settle.finance/pay/inv-123')}
                className="bg-[#222] hover:bg-[#333] text-white rounded p-2 transition-colors flex items-center justify-center shrink-0"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
              </button>
            </div>
            
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="text-gray-500 hover:text-white text-sm font-medium transition-colors relative z-10"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateInvoice;