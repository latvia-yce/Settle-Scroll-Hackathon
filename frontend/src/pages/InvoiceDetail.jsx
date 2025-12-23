// pages/InvoiceDetail.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/Layout/DashboardLayout';
import InvoiceDetailHeader from '../components/invoices/InvoiceDetailHeader';

function InvoiceDetail() {
  const handleCopyLink = () => {
    const link = "https://scroll.inv/pay/8x9s...";
    navigator.clipboard.writeText(link);
    // You could add a toast notification here
  };

  return (
    <DashboardLayout>
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto scrollbar-hide">
        <InvoiceDetailHeader />
        
        <div className="flex-1 p-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link 
              to="/invoices" 
              className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Invoices
            </Link>
            <span className="text-gray-700 dark:text-gray-600">/</span>
            <span className="text-gray-900 dark:text-white font-medium">#INV-2024-004</span>
          </div>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Invoice Details */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="rounded-2xl bg-surface border border-white/10 p-8 flex flex-col gap-8 relative overflow-hidden">
                {/* Top gradient line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent"></div>
                
                {/* Invoice Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                  <div className="flex flex-col gap-2">
                    <p className="text-primary text-xs font-bold tracking-widest uppercase">Invoice</p>
                    <h1 className="text-4xl font-bold text-white tracking-tight">#INV-2024-004</h1>
                    <p className="text-gray-400 text-sm">
                      Issued on <span className="text-white">Oct 24, 2024</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-1 bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total Amount</span>
                    <span className="text-2xl font-bold text-white">
                      $750.00 <span className="text-sm text-gray-500">USDC</span>
                    </span>
                  </div>
                </div>
                
                <div className="h-px w-full bg-white/5"></div>
                
                {/* Billed To & Payable To */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Billed To */}
                  <div className="flex flex-col gap-4">
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Billed To</p>
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 shrink-0">
                        <span className="material-symbols-outlined">business</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-white text-lg font-bold">Client Corp</h3>
                        <a 
                          className="text-primary text-sm hover:underline" 
                          href="mailto:billing@clientcorp.com"
                        >
                          billing@clientcorp.com
                        </a>
                        <p className="text-gray-500 text-sm leading-relaxed mt-1">
                          123 Innovation Drive<br/>
                          Tech City, TC 94043
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payable To */}
                  <div className="flex flex-col gap-4">
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Payable To</p>
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-white/5 overflow-hidden border border-white/10 shrink-0">
                        <img 
                          alt="User Avatar" 
                          className="h-full w-full object-cover" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeacGymUMH3-nk-dJf8IIQJblBD8tlqgylMEQXql_rj24-CqL-iTGhpVsohY1yy7dfAjAuGgoUq5mSGnbrRNRFm9zXuNrVxQJkZlqVMVysE8R5655Y2FmeQQ7TyTQAr8zgwc68RdEQdJeieFYt1iynhmPspIHoT_RmXMJrTi_SBtaM9Cfo4k6QRqNXy3yiIn5wr0jC2LVQ8QVwgL5KjngolI9IiBFEVMfUP_g6kWCr68XsJqBTEy54LP456QcFObfw3uq4yO9gCuFw"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-white text-lg font-bold">Munira M.</h3>
                        <p className="text-gray-400 text-sm">Wallet: 0x71C...9A23</p>
                        <span className="inline-flex mt-1 items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 w-fit">
                          <span className="material-symbols-outlined text-[12px]">verified</span> Verified Freelancer
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Service Details Table */}
                <div className="mt-2">
                  <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-4">Service Details</p>
                  <div className="bg-black/40 rounded-xl border border-white/5 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-white/5 text-xs text-gray-400 uppercase tracking-wide">
                        <tr>
                          <th className="px-6 py-4 font-medium border-b border-white/5">Description</th>
                          <th className="px-6 py-4 font-medium text-right border-b border-white/5">Hours</th>
                          <th className="px-6 py-4 font-medium text-right border-b border-white/5">Rate</th>
                          <th className="px-6 py-4 font-medium text-right border-b border-white/5">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm">
                        <tr>
                          <td className="px-6 py-5 text-white font-medium">
                            Web Design Retainer - October
                            <div className="text-gray-500 text-xs font-normal mt-1">
                              UI/UX improvements and dashboard iteration
                            </div>
                          </td>
                          <td className="px-6 py-5 text-gray-400 text-right">10</td>
                          <td className="px-6 py-5 text-gray-400 text-right">$75.00</td>
                          <td className="px-6 py-5 text-white font-bold text-right">$750.00</td>
                        </tr>
                      </tbody>
                      <tfoot className="bg-white/5">
                        <tr>
                          <td className="px-6 py-4 text-right text-gray-400 text-xs uppercase font-bold tracking-wider" colSpan="3">
                            Total Due
                          </td>
                          <td className="px-6 py-4 text-right text-white font-bold text-lg">$750.00</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Actions & Info */}
            <div className="flex flex-col gap-6">
              {/* Payment Status Card */}
              <div className="rounded-2xl bg-background-dark border border-white/10 p-1 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-surface rounded-xl p-6 h-full flex flex-col gap-6 z-10">
                  <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-yellow-500/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm font-medium">Payment Status</span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                      <span className="material-symbols-outlined text-[16px] animate-pulse">pending</span> Pending
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Balance Due</span>
                    <div className="flex items-baseline gap-1">
                      <h2 className="text-5xl font-bold text-white tracking-tight">$750.00</h2>
                      <span className="text-xl text-gray-500 font-medium">USDC</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 mt-2">
                    <button className="group w-full flex items-center justify-center gap-2 bg-primary hover:bg-green-500 text-white px-4 py-3.5 rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(15,184,71,0.2)] hover:shadow-[0_0_30px_rgba(15,184,71,0.4)] hover:-translate-y-0.5">
                      <span className="material-symbols-outlined group-hover:animate-bounce">send</span>
                      Remind Client
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-3.5 rounded-lg font-medium border border-white/10 transition-colors">
                      <span className="material-symbols-outlined">check_circle</span>
                      Mark as Paid
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Shareable Payment Link */}
              <div className="rounded-2xl bg-surface border border-white/10 p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <span className="material-symbols-outlined text-primary">link</span>
                  Shareable Payment Link
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-gray-400 text-sm truncate font-mono select-all">
                    https://scroll.inv/pay/8x9s...
                  </div>
                  <button 
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors flex items-center justify-center"
                    title="Copy"
                  >
                    <span className="material-symbols-outlined text-[20px]">content_copy</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Clients can pay instantly using USDC on Scroll network. Gasless transactions sponsored by platform.
                </p>
              </div>
              
              {/* History Timeline */}
              <div className="rounded-2xl bg-surface border border-white/10 p-6">
                <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-500 text-sm">history</span> History
                </h3>
                <div className="relative pl-4 border-l border-white/10 space-y-6">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-surface"></div>
                    <p className="text-sm text-gray-300">Invoice Created</p>
                    <p className="text-xs text-gray-500 mt-0.5">Oct 24, 2024 • 10:23 AM</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-white/20 ring-4 ring-surface"></div>
                    <p className="text-sm text-gray-300">Sent to Client</p>
                    <p className="text-xs text-gray-500 mt-0.5">Oct 24, 2024 • 10:25 AM</p>
                  </div>
                </div>
                
                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 opacity-60 mt-2">
                  <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
                  <span className="text-xs text-gray-400 font-medium">Secured by Scroll ZKP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}

export default InvoiceDetail;