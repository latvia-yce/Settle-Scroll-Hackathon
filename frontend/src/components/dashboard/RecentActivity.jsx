// components/dashboard/RecentActivity.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecentActivity = () => {
  const navigate = useNavigate();

  const activities = [
    {
      id: 'INV-2024-004',
      avatarColor: 'bg-blue-500/20',
      avatarIconColor: 'text-blue-400',
      avatarIcon: 'person',
      name: 'Munira M.',
      description: 'Freelance Invoice #004',
      type: 'Incoming',
      typeIcon: 'call_received',
      amount: '$500.00 USDC',
      gasFee: 'FREE (Sponsored)',
      gasIcon: 'bolt',
      status: 'Completed',
      amountValue: 500.00
    },
    {
      id: 'INV-2024-005',
      avatarColor: 'bg-purple-500/20',
      avatarIconColor: 'text-purple-400',
      avatarIcon: 'business',
      name: 'Client Corp',
      description: 'Web Design Retainer',
      type: 'Incoming',
      typeIcon: 'call_received',
      amount: '$750.00 USDC',
      gasFee: 'FREE (Sponsored)',
      gasIcon: 'bolt',
      status: 'Completed',
      amountValue: 750.00
    },
    {
      id: 'INV-2024-006',
      avatarColor: 'bg-orange-500/20',
      avatarIconColor: 'text-orange-400',
      avatarIcon: 'shopping_cart',
      name: 'SaaS Tools Inc.',
      description: 'Monthly Subscription',
      type: 'Outgoing',
      typeIcon: 'call_made',
      amount: '$29.00 USDC',
      gasFee: '$0.02',
      gasIcon: 'local_gas_station',
      status: 'Completed',
      amountValue: 29.00
    }
  ];

  const handleRowClick = (invoiceId) => {
    navigate(`/invoices/${invoiceId}`);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Recent Activity</h3>
        <button 
          onClick={() => navigate('/invoices')}
          className="text-sm text-primary hover:text-green-400 font-medium transition-colors"
        >
          View All
        </button>
      </div>
      
      <div className="rounded-xl border border-white/10 overflow-hidden bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-xs uppercase tracking-wider text-gray-400 font-medium">
                <th className="px-5 py-3">Transaction</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Gas Fee</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {activities.map((activity) => (
                <tr 
                  key={activity.id}
                  onClick={() => handleRowClick(activity.id)}
                  className="hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full ${activity.avatarColor} ${activity.avatarIconColor} flex items-center justify-center border ${activity.avatarColor.replace('/20', '/20')}`}>
                        <span className="material-symbols-outlined text-xs">{activity.avatarIcon}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-medium text-sm">{activity.name}</span>
                        <span className="text-gray-500 text-xs">{activity.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 text-gray-300 text-xs font-medium border border-white/5">
                      <span className="material-symbols-outlined text-[12px]">{activity.typeIcon}</span> {activity.type}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-white font-semibold">{activity.amount}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${activity.gasFee.includes('FREE') ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(15,184,71,0.1)]' : 'bg-white/5 text-gray-400 border border-white/10'} text-xs font-bold`}>
                      <span className="material-symbols-outlined text-[12px]">{activity.gasIcon}</span> {activity.gasFee}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-primary text-xs font-medium flex items-center justify-end gap-1">
                      {activity.status} <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;