// pages/Invoices.jsx
import React from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import DashboardHeader from '../components/dashboard/DashboardHeader';

function Invoices() {
  return (
    <DashboardLayout>
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <DashboardHeader />
        
        <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Invoices</h1>
            <button className="bg-primary hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium">
              + Create Invoice
            </button>
          </div>
          
          {/* Invoices list would go here */}
          <div className="bg-surface border border-white/10 rounded-xl p-6">
            <p className="text-gray-400">Your invoices will appear here...</p>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}

export default Invoices;