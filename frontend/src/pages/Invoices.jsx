// pages/Invoices.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Layout/DashboardLayout';
import DashboardHeader from '../components/dashboard/DashboardHeader';

function Invoices() {
  const navigate = useNavigate();
  const [invoices] = useState([
    { id: 'INV-2024-001', client: 'Client A', amount: '$500.00', date: 'Oct 24, 2024', status: 'Paid' },
    { id: 'INV-2024-002', client: 'Client B', amount: '$750.00', date: 'Oct 23, 2024', status: 'Pending' },
    { id: 'INV-2024-003', client: 'Client C', amount: '$1,200.00', date: 'Oct 22, 2024', status: 'Paid' },
    { id: 'INV-2024-004', client: 'Client D', amount: '$350.00', date: 'Oct 21, 2024', status: 'Overdue' },
  ]);

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
        
        <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Invoices</h1>
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
            
            {/* Empty State */}
            {invoices.length === 0 && (
              <div className="p-12 text-center">
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-gray-400 text-2xl">description</span>
                </div>
                <h3 className="text-white text-lg font-medium mb-2">No invoices yet</h3>
                <p className="text-gray-400 text-sm mb-6">Create your first invoice to get started</p>
                <button 
                  onClick={handleCreateInvoice}
                  className="bg-primary hover:bg-green-500 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto"
                >
                  <span className="material-symbols-outlined">add</span>
                  Create Your First Invoice
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}

export default Invoices;