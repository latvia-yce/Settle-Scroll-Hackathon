// components/Layout/DashboardLayout.jsx
import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="dark">
      <div className="bg-background-light dark:bg-black font-display text-slate-900 dark:text-white h-screen flex overflow-hidden selection:bg-primary selection:text-white">
        <Sidebar />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;