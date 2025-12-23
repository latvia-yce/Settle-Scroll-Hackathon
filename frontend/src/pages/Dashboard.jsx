// pages/Dashboard.jsx
import React from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import BalanceCards from '../components/dashboard/BalanceCards';
import RecentActivity from '../components/dashboard/RecentActivity';
import ConnectWallet from '../components/ConnectWallet';
import { useWeb3 } from '../hooks/useWeb3';

function Dashboard() {
  const { isConnected, account } = useWeb3();

  return (
    <DashboardLayout>
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <DashboardHeader />
        
        <div className="flex-1 p-6 max-w-6xl mx-auto w-full flex flex-col gap-6">
          {/* Wallet Status */}
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
            <ConnectWallet />
          </div>
          
          {isConnected && (
            <div className="bg-surface border border-white/10 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span className="text-white font-medium">Connected: {account?.slice(0, 6)}...{account?.slice(-4)}</span>
                <span className="text-gray-400 text-sm">on Scroll Sepolia</span>
              </div>
            </div>
          )}
          
          <BalanceCards />
          <RecentActivity />
        </div>
      </main>
    </DashboardLayout>
  );
}

export default Dashboard;
