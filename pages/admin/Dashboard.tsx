
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, ShoppingBag, Users, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../services/supabase';

const Dashboard: React.FC = () => {
  const [customerCount, setCustomerCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (!error) setCustomerCount(count || 0);
    } catch (err) {
      console.error("Dashboard count error:", err);
    } finally {
      setLoading(false);
    }
  };

  const salesData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  const stats = [
    { label: 'Total Revenue', value: '$124,592', change: '+12.5%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Orders', value: '1,240', change: '+5.2%', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Live Customers', value: loading ? '...' : customerCount.toString(), change: '+NEW', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'System Alerts', value: '18', change: 'Alert', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top Banner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-[#6C1DDB]">
             <ShoppingBag size={140} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-[#6C1DDB]">
                 <ShoppingBag size={20} />
               </div>
               <div>
                  <h3 className="text-xl font-bold">TechCore Lexron</h3>
                  <p className="text-xs text-slate-400">Database Active</p>
               </div>
               <div className="ml-auto text-right">
                  <p className="text-sm font-bold">System Pulse</p>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Connected</p>
               </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6 border-y border-slate-100 mt-6">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Live Feed:</p>
                <p className="text-sm font-bold text-slate-800">Operational</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Sync Status</p>
                <p className="text-sm font-bold text-slate-800">Real-time</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Server Region</p>
                <p className="text-sm font-bold text-slate-800">Cloud DB</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">API Latency</p>
                <p className="text-sm font-bold text-[#6C1DDB]">12ms</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-6 flex justify-between items-center">
              Active Session
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400">•••</button>
            </h4>
            <div className="flex items-center gap-4 mb-6">
              <img src="https://i.pravatar.cc/150?u=admin" className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-100 shadow-sm" />
              <div>
                <p className="font-bold text-slate-900 leading-none mb-1">Admin Lexron</p>
                <p className="text-xs text-slate-400 font-medium tracking-tight">System Administrator</p>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-2xl mb-6">
               <p className="text-[10px] font-bold text-[#6C1DDB] uppercase tracking-widest mb-1">Current Task</p>
               <p className="text-xs font-bold text-slate-700">Database Synchronization & User Management</p>
            </div>
            <button className="w-full bg-gradient-to-r from-purple-400 to-indigo-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-purple-100 hover:opacity-90 transition-opacity">
              System Audit
            </button>
          </div>
        </div>
      </div>

      {/* Analytics & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm">
          <h3 className="font-bold text-lg mb-8">E-Store Traffic</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C1DDB" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6C1DDB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="sales" stroke="#6C1DDB" strokeWidth={4} fillOpacity={1} fill="url(#purpleGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
           {stats.map((stat, i) => (
             <div key={i} className="bg-white p-6 rounded-[28px] border border-slate-50 shadow-sm flex items-center justify-between group hover:border-purple-200 transition-colors">
               <div className="flex items-center gap-4">
                 <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                   {loading && stat.label === 'Live Customers' ? <Loader2 className="animate-spin" size={20} /> : <stat.icon size={28} />}
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                   <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                 </div>
               </div>
               <div className="text-right">
                 <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                   {stat.change}
                 </span>
               </div>
             </div>
           ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
