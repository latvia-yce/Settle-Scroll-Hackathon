// pages/InvoiceDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Layouting/DashboardLayout';
import { useWeb3Context } from '../contexts/Web3Context';
import { useInvoice } from '../hooks/useWeb3';
import { useAccountAbstraction } from '../hooks/useAccountAbstraction';

function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isConnected, account, isCorrectNetwork } = useWeb3Context();
  const { payInvoice, loading: paymentLoading } = useInvoice();
  const { payInvoiceGasless, canPerformGaslessTx } = useAccountAbstraction();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  // Mock invoice data - in a real app, you would fetch this from an API
  const mockInvoices = {
    'INV-2024-001': {
      id: 'INV-2024-001',
      clientName: 'Client A',
      clientEmail: 'client.a@example.com',
      clientAddress: '123 Business Ave\nNew York, NY 10001',
      amount: 500.00,
      date: 'Oct 24, 2024',
      serviceDescription: 'Web Development Services',
      status: 'Paid',
      items: [
        { description: 'Website Development', hours: 10, rate: 50.00, amount: 500.00 }
      ]
    },
    'INV-2024-002': {
      id: 'INV-2024-002',
      clientName: 'Client B',
      clientEmail: 'client.b@example.com',
      clientAddress: '456 Corporate Blvd\nSan Francisco, CA 94105',
      amount: 750.00,
      date: 'Oct 23, 2024',
      serviceDescription: 'UI/UX Design Consultation',
      status: 'Pending',
      items: [
        { description: 'UI/UX Design', hours: 15, rate: 50.00, amount: 750.00 }
      ]
    },
    'INV-2024-003': {
      id: 'INV-2024-003',
      clientName: 'Client C',
      clientEmail: 'client.c@example.com',
      clientAddress: '789 Tech Street\nSeattle, WA 98101',
      amount: 1200.00,
      date: 'Oct 22, 2024',
      serviceDescription: 'Full-stack Development Project',
      status: 'Paid',
      items: [
        { description: 'Frontend Development', hours: 20, rate: 40.00, amount: 800.00 },
        { description: 'Backend Development', hours: 10, rate: 40.00, amount: 400.00 }
      ]
    },
    'INV-2024-004': {
      id: 'INV-2024-004',
      clientName: 'Client Corp',
      clientEmail: 'billing@clientcorp.com',
      clientAddress: '123 Innovation Drive\nTech City, TC 94043',
      amount: 750.00,
      date: 'Oct 24, 2024',
      serviceDescription: 'Web Design Retainer - October\nUI/UX improvements and dashboard iteration',
      status: 'Pending',
      items: [
        { description: 'Web Design Retainer - October', hours: 10, rate: 75.00, amount: 750.00 }
      ]
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundInvoice = mockInvoices[id] || mockInvoices['INV-2024-004'];
      setInvoice(foundInvoice);
      setLoading(false);
    }, 300);
  }, [id]);

  const handlePayment = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!isCorrectNetwork) {
      alert('Please switch to Scroll Sepolia network');
      return;
    }

    setPaying(true);
    try {
      const paymentAmount = invoice.amount.toString();

      let result;
      if (canPerformGaslessTx()) {
        result = await payInvoiceGasless(id, paymentAmount);
      } else {
        result = await payInvoice(id, paymentAmount);
      }

      if (result.success) {
        // Update invoice status to paid
        setInvoice(prev => ({ ...prev, status: 'Paid' }));
        alert('Payment successful!');
        // Navigate to success page or refresh
        navigate('/success');
      } else {
        alert('Payment failed: ' + result.error);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error.message);
    } finally {
      setPaying(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Paid': return 'bg-green-500/10 text-green-500';
      case 'Pending': return 'bg-yellow-500/10 text-yellow-500';
      case 'Overdue': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="text-white mt-4">Loading invoice...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!invoice) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">error</span>
            <h2 className="text-2xl font-bold text-white mb-2">Invoice Not Found</h2>
            <p className="text-gray-400 mb-6">The invoice you're looking for doesn't exist.</p>
            <Link 
              to="/invoices" 
              className="text-primary hover:text-green-400 font-medium transition-colors"
            >
              Return to Invoices
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        {/* Use the existing DashboardHeader */}
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
        
        <div className="flex-1 p-6 max-w-6xl mx-auto w-full flex flex-col gap-5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link
              to="/invoices"
              className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Invoices
            </Link>
            <span className="text-gray-700 dark:text-gray-600">/</span>
            <span className="text-gray-900 dark:text-white font-medium">{invoice.id}</span>
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
                    <h1 className="text-4xl font-bold text-white tracking-tight">{invoice.id}</h1>
                    <p className="text-gray-400 text-sm">
                      Issued on <span className="text-white">{invoice.date}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-1 bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total Amount</span>
                    <span className="text-2xl font-bold text-white">
                      ${invoice.amount.toFixed(2)} <span className="text-sm text-gray-500">USDC</span>
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
                        <h3 className="text-white text-lg font-bold">{invoice.clientName}</h3>
                        <a 
                          className="text-primary text-sm hover:underline" 
                          href={`mailto:${invoice.clientEmail}`}
                        >
                          {invoice.clientEmail}
                        </a>
                        <p className="text-gray-500 text-sm leading-relaxed mt-1">
                          {invoice.clientAddress.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                              {line}
                              {i < invoice.clientAddress.split('\n').length - 1 && <br />}
                            </React.Fragment>
                          ))}
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
                        {invoice.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-5 text-white font-medium">
                              {item.description}
                              <div className="text-gray-500 text-xs font-normal mt-1">
                                {invoice.serviceDescription.split('\n')[index] || ''}
                              </div>
                            </td>
                            <td className="px-6 py-5 text-gray-400 text-right">{item.hours}</td>
                            <td className="px-6 py-5 text-gray-400 text-right">${item.rate.toFixed(2)}</td>
                            <td className="px-6 py-5 text-white font-bold text-right">${item.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-white/5">
                        <tr>
                          <td className="px-6 py-4 text-right text-gray-400 text-xs uppercase font-bold tracking-wider" colSpan="3">
                            Total Due
                          </td>
                          <td className="px-6 py-4 text-right text-white font-bold text-lg">${invoice.amount.toFixed(2)}</td>
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
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  invoice.status === 'Paid' ? 'from-green-500/20' : 
                  invoice.status === 'Pending' ? 'from-yellow-500/20' : 'from-red-500/20'
                } to-transparent opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                <div className="relative bg-surface rounded-xl p-6 h-full flex flex-col gap-6 z-10">
                  <div className={`absolute top-0 right-0 w-[150px] h-[150px] ${
                    invoice.status === 'Paid' ? 'bg-green-500/10' : 
                    invoice.status === 'Pending' ? 'bg-yellow-500/10' : 'bg-red-500/10'
                  } blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none`}></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm font-medium">Payment Status</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${
                      invoice.status === 'Paid' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                      invoice.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                      'bg-red-500/10 text-red-500 border border-red-500/20'
                    } text-xs font-bold shadow-[0_0_15px_rgba(234,179,8,0.1)]`}>
                      <span className="material-symbols-outlined text-[16px] animate-pulse">
                        {invoice.status === 'Paid' ? 'check_circle' : 
                         invoice.status === 'Pending' ? 'pending' : 'error'}
                      </span> 
                      {invoice.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Balance Due</span>
                    <div className="flex items-baseline gap-1">
                      <h2 className="text-5xl font-bold text-white tracking-tight">${invoice.amount.toFixed(2)}</h2>
                      <span className="text-xl text-gray-500 font-medium">USDC</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 mt-2">
                    {invoice.status === 'Pending' ? (
                      <>
                        <button
                          onClick={handlePayment}
                          disabled={paying || !isConnected}
                          className="group w-full flex items-center justify-center gap-2 bg-primary hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3.5 rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(15,184,71,0.2)] hover:shadow-[0_0_30px_rgba(15,184,71,0.4)] hover:-translate-y-0.5"
                        >
                          {paying ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span>Processing Payment...</span>
                            </>
                          ) : !isConnected ? (
                            <>
                              <span className="material-symbols-outlined">account_balance_wallet</span>
                              <span>Connect Wallet to Pay</span>
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined group-hover:animate-bounce">send</span>
                              <span>Pay Invoice</span>
                            </>
                          )}
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-3.5 rounded-lg font-medium border border-white/10 transition-colors">
                          <span className="material-symbols-outlined">check_circle</span>
                          Mark as Paid
                        </button>
                      </>
                    ) : invoice.status === 'Paid' ? (
                      <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-3.5 rounded-lg font-medium border border-white/10 transition-colors">
                        <span className="material-symbols-outlined">download</span>
                        Download Receipt
                      </button>
                    ) : (
                      <button className="group w-full flex items-center justify-center gap-2 bg-primary hover:bg-green-500 text-white px-4 py-3.5 rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(15,184,71,0.2)] hover:shadow-[0_0_30px_rgba(15,184,71,0.4)] hover:-translate-y-0.5">
                        <span className="material-symbols-outlined">autorenew</span>
                        Resend Invoice
                      </button>
                    )}
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
                    https://scroll.inv/pay/{invoice.id.toLowerCase()}
                  </div>
                  <button 
                    onClick={() => copyToClipboard(`https://scroll.inv/pay/${invoice.id.toLowerCase()}`)}
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
                    <p className="text-xs text-gray-500 mt-0.5">{invoice.date} • 10:23 AM</p>
                  </div>
                  {invoice.status === 'Paid' ? (
                    <>
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-green-500 ring-4 ring-surface"></div>
                        <p className="text-sm text-gray-300">Payment Received</p>
                        <p className="text-xs text-gray-500 mt-0.5">{invoice.date} • 14:45 PM</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-green-500 ring-4 ring-surface"></div>
                        <p className="text-sm text-gray-300">Settlement Complete</p>
                        <p className="text-xs text-gray-500 mt-0.5">{invoice.date} • 14:46 PM</p>
                      </div>
                    </>
                  ) : (
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-white/20 ring-4 ring-surface"></div>
                      <p className="text-sm text-gray-300">Sent to Client</p>
                      <p className="text-xs text-gray-500 mt-0.5">{invoice.date} • 10:25 AM</p>
                    </div>
                  )}
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