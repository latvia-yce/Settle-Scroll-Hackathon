// pages/Dashboard.jsx
import React from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import BalanceCards from '../components/dashboard/BalanceCards';
import RecentActivity from '../components/dashboard/RecentActivity';

function Dashboard() {
  return (
    <DashboardLayout>
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <DashboardHeader />
        
        <div className="flex-1 p-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
          <BalanceCards />
          <RecentActivity />
        </div>
      </main>
    </DashboardLayout>
  );
}

export default Dashboard;