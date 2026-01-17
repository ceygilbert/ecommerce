
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp, ShoppingBag, Users, AlertCircle, Plus } from 'lucide-react';

const Dashboard: React.FC = () => {
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
    { label: 'New Customers', value: '382', change: '-1.4%', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'System Alerts', value: '18', change: 'Alert', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top Banner Section (Lexron Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShoppingBag size={140} className="text-[#6C1DDB]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-[#6C1DDB]">
                 <ShoppingBag size={20} />
               </div>
               <div>
                  <h3 className="text-xl font-bold">Lexron</h3>
                  <p className="text-xs text-slate-400">Lexron12gmail.com</p>
               </div>
               <div className="ml-auto text-right">
                  <p className="text-sm font-bold">Larkon Admin.</p>
                  <p className="text-[10px] text-slate-400">1729 Bangor St, USA</p>
               </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6 border-y border-slate-100 mt-6">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Invoice:</p>
                <p className="text-sm font-bold text-slate-800">#INV-0758267/90</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Issue Date</p>
                <p className="text-sm font-bold text-slate-800">23 April 2025</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Due Date</p>
                <p className="text-sm font-bold text-slate-800">26 April 2025</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Amount</p>
                <p className="text-sm font-bold text-[#6C1DDB]">$737.00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-6 flex justify-between items-center">
              Client Details
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400">•••</button>
            </h4>
            <div className="flex items-center gap-4 mb-6">
              <img src="https://i.pravatar.cc/150?u=howard" className="w-14 h-14 rounded-2xl object-cover" />
              <div>
                <p className="font-bold text-slate-900 leading-none mb-1">Esther Howard</p>
                <p className="text-xs text-slate-400 font-medium">ckctm12@gmail.com</p>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-900 mb-1">Uihut Agency LTD</p>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">3471 Rainy Day Drive Tulsa, USA</p>
            <button className="w-full bg-gradient-to-r from-purple-400 to-indigo-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-purple-100 hover:opacity-90 transition-opacity">
              Add Customer
            </button>
          </div>
        </div>
      </div>

      {/* Analytics & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm">
          <h3 className="font-bold text-lg mb-8">Sales Overview</h3>
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
                   <stat.icon size={28} />
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
