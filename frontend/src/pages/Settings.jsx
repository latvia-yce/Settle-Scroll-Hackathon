// pages/Settings.jsx
import React, { useState } from 'react';
import DashboardLayout from '../components/Layouting/DashboardLayout';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ConnectWallet from '../components/ConnectWallet';
import { useWeb3 } from '../hooks/useWeb3';
import { useAccountAbstraction } from '../hooks/useAccountAbstraction';

function Settings() {
  const [profileData, setProfileData] = useState({
    firstName: 'Munira',
    lastName: 'M.',
    email: 'munira@example.com'
  });

  const [notifications, setNotifications] = useState({
    paymentReceived: true,
    invoiceViewed: true,
    securityAlerts: true,
    marketingEmails: false
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  const handleProfileChange = (e) => {
    const { id, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleNotificationChange = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePasswordChange = (e) => {
    const { placeholder, value } = e.target;
    const field = placeholder.toLowerCase().includes('current') ? 'currentPassword' : 'newPassword';
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    // Save profile logic here
    console.log('Saving profile:', profileData);
  };

  const handleUpdatePassword = () => {
    // Update password logic here
    console.log('Updating password');
    setPasswordData({ currentPassword: '', newPassword: '' });
  };

  const handleDisconnectWallet = () => {
    // Disconnect wallet logic here
    console.log('Disconnecting wallet');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Delete account logic here
      console.log('Deleting account');
    }
  };

  return (
    <DashboardLayout>
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <DashboardHeader />
        
        <div className="flex-1 p-8 max-w-5xl mx-auto w-full flex flex-col gap-8">
          {/* Profile Settings */}
          <div className="rounded-2xl bg-surface border border-white/10 p-8 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">person</span>
                Profile Settings
              </h3>
              <button 
                onClick={handleSaveProfile}
                className="text-sm text-primary hover:text-green-400 font-medium transition-colors"
              >
                Save Changes
              </button>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Profile Picture */}
              <div className="flex flex-col gap-4 items-center min-w-[200px]">
                <div className="h-32 w-32 rounded-full bg-background-dark border-2 border-dashed border-white/20 flex items-center justify-center relative overflow-hidden group cursor-pointer hover:border-primary transition-colors">
                  <img 
                    alt="User Avatar" 
                    className="h-full w-full object-cover opacity-80 group-hover:opacity-50 transition-opacity" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeacGymUMH3-nk-dJf8IIQJblBD8tlqgylMEQXql_rj24-CqL-iTGhpVsohY1yy7dfAjAuGgoUq5mSGnbrRNRFm9zXuNrVxQJkZlqVMVysE8R5655Y2FmeQQ7TyTQAr8zgwc68RdEQdJeieFYt1iynhmPspIHoT_RmXMJrTi_SBtaM9Cfo4k6QRqNXy3yiIn5wr0jC2LVQ8QVwgL5KjngolI9IiBFEVMfUP_g6kWCr68XsJqBTEy54LP456QcFObfw3uq4yO9gCuFw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white">cloud_upload</span>
                  </div>
                </div>
                <button className="text-sm text-gray-400 hover:text-white transition-colors font-medium">
                  Change Avatar
                </button>
              </div>
              
              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-600"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-600"
                  />
                </div>
                
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-400" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-[20px]">
                      mail
                    </span>
                    <input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full bg-background-dark border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notifications & Security Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Notifications */}
            <div className="rounded-2xl bg-surface border border-white/10 p-8 flex flex-col h-full shadow-lg">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">notifications_active</span>
                Notifications
              </h3>
              
              <div className="flex flex-col gap-6">
                {/* Payment Received */}
                <div className="flex items-center justify-between group">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-white">Payment Received</span>
                    <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                      Get notified when you receive USDC
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.paymentReceived}
                      onChange={() => handleNotificationChange('paymentReceived')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                {/* Invoice Viewed */}
                <div className="flex items-center justify-between group">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-white">Invoice Viewed</span>
                    <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                      Alert when client views an invoice
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.invoiceViewed}
                      onChange={() => handleNotificationChange('invoiceViewed')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                {/* Security Alerts */}
                <div className="flex items-center justify-between group">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-white">Security Alerts</span>
                    <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                      Login attempts and password changes
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.securityAlerts}
                      onChange={() => handleNotificationChange('securityAlerts')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                {/* Marketing Emails */}
                <div className="flex items-center justify-between group border-t border-white/5 pt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-white">Marketing Emails</span>
                    <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                      Product updates and newsletters
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.marketingEmails}
                      onChange={() => handleNotificationChange('marketingEmails')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Security */}
            <div className="rounded-2xl bg-surface border border-white/10 p-8 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">shield</span>
                Security
              </h3>
              
              <div className="flex flex-col gap-6">
                {/* Connected Wallet */}
                <div className="bg-background-dark rounded-xl p-4 border border-white/5">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                    Connected Wallet
                  </p>
                  {isConnected ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-sm">account_balance_wallet</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white">
                              {network?.name || 'Unknown Network'}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'No account'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={disconnectWallet}
                          className="text-xs bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 py-1.5 rounded-md transition-colors font-medium"
                        >
                          Disconnect
                        </button>
                      </div>

                      {/* Smart Account Info */}
                      {smartAccountAddress && (
                        <div className="border-t border-white/5 pt-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-xs">smart_toy</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-white">Smart Account</span>
                                <span className="text-xs text-gray-500 font-mono">
                                  {smartAccountAddress.slice(0, 6)}...{smartAccountAddress.slice(-4)}
                                </span>
                              </div>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              isSmartAccountDeployed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {isSmartAccountDeployed ? 'Deployed' : 'Not Deployed'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 mb-3">No wallet connected</p>
                      <ConnectWallet />
                    </div>
                  )}
                </div>
                
                {/* Change Password */}
                <div className="flex flex-col gap-4">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Change Password
                  </p>
                  <div className="flex flex-col gap-3">
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-600"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-600"
                    />
                  </div>
                  <button 
                    onClick={handleUpdatePassword}
                    className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 py-2.5 rounded-lg text-sm font-medium transition-colors mt-1"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Delete Account */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h4 className="text-red-500 font-bold text-sm">Delete Account</h4>
              <p className="text-gray-500 text-xs">
                Permanently remove your account and all data. This cannot be undone.
              </p>
            </div>
            <button 
              onClick={handleDeleteAccount}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}

export default Settings;