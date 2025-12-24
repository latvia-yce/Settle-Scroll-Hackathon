// components/Layouting/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/invoices', icon: 'description', label: 'Invoices' },
    { path: '/settings', icon: 'settings', label: 'Settings' },
  ];
  
  return (
    <aside className="w-64 bg-white dark:bg-background-dark border-r border-gray-200 dark:border-white/5 flex flex-col justify-between shrink-0 h-full relative z-20">
      <div className="flex flex-col gap-6 p-5">
        {/* Logo */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>bolt</span>
            <h1 className="text-lg font-bold tracking-tight">Settle</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-medium pl-8">Settle Payments</p>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                  isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                } transition-colors`}
              >
                <span 
                  className="material-symbols-outlined" 
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Bottom Section */}
      <div className="p-5 flex flex-col gap-4">
        {/* Security Badge */}
        <div className="rounded-xl bg-gradient-to-br from-background-dark to-black border border-white/10 p-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-white" style={{ fontSize: '64px' }}>shield</span>
          </div>
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>verified_user</span>
              <span className="text-xs font-bold uppercase tracking-wider">Secured</span>
            </div>
            <p className="text-sm text-gray-300 font-medium leading-tight">Transactions protected by Scroll ZKP</p>
          </div>
        </div>
        
        <a className="flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-white transition-colors" href="#">
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm font-medium">Logout</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;