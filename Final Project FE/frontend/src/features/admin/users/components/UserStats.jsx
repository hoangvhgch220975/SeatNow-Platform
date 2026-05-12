import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, UserCheck, Shield } from 'lucide-react';

/**
 * @file UserStats.jsx
 * @description Statistic cards for Admin User Management
 */
const UserStats = ({ stats, loading }) => {
  const { t } = useTranslation();

  const statItems = [
    {
      label: t('admin.users.stats.total'),
      value: stats?.totalUsers || 0,
      icon: <Users size={20} />,
      color: 'bg-violet-50 text-violet-600',
      borderColor: 'border-slate-100'
    },
    {
      label: t('admin.users.stats.customers'),
      value: stats?.totalCustomers || 0,
      icon: <UserCheck size={20} />,
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-100'
    },
    {
      label: t('admin.users.stats.owners'),
      value: stats?.totalOwners || 0,
      icon: <Shield size={20} />,
      color: 'bg-emerald-50 text-emerald-600',
      borderColor: 'border-emerald-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statItems.map((item, index) => (
        <div 
          key={index}
          className={`px-6 py-5 bg-white border ${item.borderColor} rounded-[32px] shadow-sm hover:shadow-md transition-all flex items-center gap-5 group cursor-default`}
        >
          <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
            {loading ? (
               <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : item.icon}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">
              {item.label}
            </p>
            <p className={`text-3xl font-black ${loading ? 'opacity-20 animate-pulse' : 'text-slate-900'} leading-none tracking-tight`}>
              {item.value.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserStats;
