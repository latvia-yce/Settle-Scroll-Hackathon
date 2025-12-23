// pages/Invoices.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Layout/DashboardLayout';
import DashboardHeader from '../components/dashboard/DashboardHeader';

function Invoices() {
  const navigate = useNavigate();
  const { isConnected, account } = useWeb3();
  const { getFreelancerInvoices, getClientInvoices, loading } = useInvoice();

  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [activeTab, setActiveTab] = useState('freelancer'); // 'freelancer' or 'client'

  // Load invoices based on active tab
  React.useEffect(() => {
    const loadInvoices = async () => {
      if (!isConnected || !account) return;

      setLoadingInvoices(true);
      try {
        let result;
        if (activeTab === 'freelancer') {
          result = await getFreelancerInvoices(account);
        } else {
          result = await getClientInvoices(account);
        }

        if (result.success) {
          // Transform invoice IDs to invoice objects (this would need actual contract calls)
          const transformedInvoices = result.invoiceIds.map((id, index) => ({
            id: id.toString(),
            client: activeTab === 'freelancer' ? 'Client ' + (index + 1) : 'You',
            amount: '$0.00', // Would need to fetch actual amount
            date: new Date().toLocaleDateString(),
            status: 'Pending', // Would need to fetch actual status
          }));
          setInvoices(transformedInvoices);
        }
      } catch (error) {
        console.error('Failed to load invoices:', error);
      } finally {
        setLoadingInvoices(false);
      }
    };

    loadInvoices();
  }, [isConnected, account, activeTab, getFreelancerInvoices, getClientInvoices]);

  const handleCreateInvoice = () => {
    navigate('/create-invoice');
  };

  const handleInvoiceClick = (invoiceId) => {
    navigate(`/invoices/${invoiceId}`);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Paid': return 'bg-green-500/10 text-green-500';
      case 'Pending': return 'bg-yellow-500/10 text-yellow-500';
      case 'Overdue': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Paid': return 'check_circle';
      case 'Pending': return 'pending';
      case 'Overdue': return 'error';
      default: return 'receipt';
    }
  };

  return (
    <DashboardLayout>
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <DashboardHeader />
        
        <div className="flex-1 p-6 max-w-6xl mx-auto w-full">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-xl font-bold text-white">Invoices</h1>
            <button 
              onClick={handleCreateInvoice}
              className="bg-primary hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Create Invoice
            </button>
          </div>
          
          {/* Invoices List */}
          <div className="bg-surface border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5 text-xs uppercase tracking-wider text-gray-400 font-medium">
                    <th className="px-6 py-4">Invoice ID</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {invoices.map((invoice) => (
                    <tr 
                      key={invoice.id}
                      onClick={() => handleInvoiceClick(invoice.id)}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                            <span className="material-symbols-outlined text-sm">receipt</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-medium text-sm">{invoice.id}</span>
                            <span className="text-gray-500 text-xs">Click to view details</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-medium">{invoice.client}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-semibold">{invoice.amount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400 text-sm">{invoice.date}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${getStatusColor(invoice.status)} text-xs font-bold`}>
                          <span className="material-symbols-outlined text-[14px]">{getStatusIcon(invoice.status)}</span>
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Loading State */}
            {loadingInvoices && (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-400 text-sm">Loading invoices...</p>
              </div>
            )}

            {/* Empty State */}
            {!loadingInvoices && invoices.length === 0 && isConnected && (
              <div className="p-12 text-center">
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-gray-400 text-2xl">description</span>
                </div>
                <h3 className="text-white text-lg font-medium mb-2">
                  {activeTab === 'freelancer' ? 'No invoices sent yet' : 'No invoices received yet'}
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  {activeTab === 'freelancer'
                    ? 'Create your first invoice to get started'
                    : 'Invoices sent to you will appear here'
                  }
                </p>
                {activeTab === 'freelancer' && (
                  <button
                    onClick={handleCreateInvoice}
                    className="bg-primary hover:bg-green-500 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto"
                  >
                    <span className="material-symbols-outlined">add</span>
                    Create Your First Invoice
                  </button>
                )}
              </div>
            )}

            {/* Not Connected State */}
            {!isConnected && !loadingInvoices && (
              <div className="p-12 text-center">
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-gray-400 text-2xl">account_balance_wallet</span>
                </div>
                <h3 className="text-white text-lg font-medium mb-2">Connect Your Wallet</h3>
                <p className="text-gray-400 text-sm">Connect your wallet to view and manage your invoices</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}

export default Invoices;