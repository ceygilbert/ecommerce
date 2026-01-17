
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Users, 
  Loader2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  X,
  UserPlus,
  AlertTriangle,
  ChevronRight,
  DatabaseZap
} from 'lucide-react';
import { supabase } from '../../services/supabase';
import { Profile } from '../../types';

const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Profile | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active' as 'active' | 'suspended'
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCustomers(data || []);
    } catch (err: any) {
      console.error("Supabase Fetch Error:", err);
      setError(err.message || "Could not connect to the 'profiles' table. Please ensure you have run the SQL schema in your Supabase editor.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    (c.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
    (c.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedCustomer) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            phone: formData.phone,
            address: formData.address,
            status: formData.status
          })
          .eq('id', selectedCustomer.id);
        if (error) throw error;
      } else {
        // Note: For a strictly linked auth system, manual insertion requires an auth user.
        // Usually admins would manage profiles generated via registration.
        const { error } = await supabase
          .from('profiles')
          .insert([{ 
            ...formData, 
            id: crypto.randomUUID(), // Warning: This might fail if the FK constraint to auth.users is active
            created_at: new Date().toISOString() 
          }]);
        if (error) throw error;
      }
      fetchCustomers();
      closeModal();
    } catch (err: any) {
      alert(`Database Error: ${err.message}. (Tip: Manual creation is limited if Profile ID must match an Auth User ID)`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this customer profile?')) return;
    setIsDeletingId(id);
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setIsDeletingId(null);
    }
  };

  const openEdit = (customer: Profile) => {
    setSelectedCustomer(customer);
    setFormData({
      full_name: customer.full_name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      status: customer.status
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
    setFormData({ full_name: '', email: '', phone: '', address: '', status: 'active' });
  };

  const viewDetails = (customer: Profile) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[28px] border border-slate-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Database Customers</h2>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <DatabaseZap size={12} className="text-emerald-500" />
              Live connection to Supabase profiles
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter live users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#F8F9FD] border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-purple-200 transition-all text-sm"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6C1DDB] to-[#4A00E0] text-white rounded-2xl hover:opacity-90 font-bold text-sm shadow-lg shadow-purple-100 transition-all"
          >
            <UserPlus size={18} /> New Entry
          </button>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-red-50 border border-red-100 rounded-[28px] flex items-center gap-4 text-red-600 animate-in slide-in-from-top-4">
          <AlertTriangle size={32} />
          <div>
            <p className="font-bold">Configuration Required</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[28px] border border-slate-50 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Users size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Active</p>
            <p className="text-2xl font-black text-slate-800">{customers.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[28px] border border-slate-50 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Calendar size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Registrations</p>
            <p className="text-2xl font-black text-slate-800">
              {customers.filter(c => new Date(c.created_at).getMonth() === new Date().getMonth()).length}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[28px] border border-slate-50 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <AlertTriangle size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action Required</p>
            <p className="text-2xl font-black text-slate-800">{customers.filter(c => c.status === 'suspended').length}</p>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-[32px] border border-slate-50 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Loader2 className="animate-spin text-[#6C1DDB]" size={48} />
            <p className="text-slate-400 font-bold italic">Communicating with Supabase...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-slate-400">
            <Users size={48} className="mb-4 opacity-20" />
            <p className="font-bold">No customers found in the database.</p>
            <p className="text-xs">Profiles appear here automatically when users register.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#F8F9FD] text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-8 py-6">Customer Profile</th>
                  <th className="px-8 py-6">Contact Info</th>
                  <th className="px-8 py-6">Account Status</th>
                  <th className="px-8 py-6">Joined Date</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-[#F8F9FD]/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={customer.avatar_url || `https://i.pravatar.cc/150?u=${customer.id}`} 
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-sm"
                        />
                        <div>
                          <p className="font-bold text-slate-900 mb-0.5">{customer.full_name || 'Unnamed User'}</p>
                          <p className="text-[10px] font-bold text-[#6C1DDB] bg-purple-50 px-2 py-0.5 rounded-full inline-block">UUID: {customer.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <Mail size={12} className="text-slate-300" /> {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <Phone size={12} className="text-slate-300" /> {customer.phone || 'No phone'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                        customer.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Calendar size={14} className="text-slate-300" />
                        {new Date(customer.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => viewDetails(customer)}
                          className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                          <ChevronRight size={18} />
                        </button>
                        <button 
                          onClick={() => openEdit(customer)}
                          className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(customer.id)}
                          disabled={isDeletingId === customer.id}
                          className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          {isDeletingId === customer.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail & Edit Modals (Same as before but with loading states linked to fetchCustomers) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-10 animate-in zoom-in-95 relative">
            <button onClick={closeModal} className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 transition-colors">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 mb-8">{selectedCustomer ? 'Edit Database Entry' : 'Manual Customer Entry'}</h3>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Full Name</label>
                  <input 
                    type="text" required
                    className="w-full px-5 py-4 bg-[#F8F9FD] rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 border-2 border-transparent transition-all font-semibold"
                    value={formData.full_name}
                    onChange={e => setFormData({...formData, full_name: e.target.value})}
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email (Read Only for existing)</label>
                  <input 
                    type="email" required disabled={!!selectedCustomer}
                    className="w-full px-5 py-4 bg-[#F8F9FD] rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 border-2 border-transparent transition-all font-semibold disabled:opacity-50"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Phone</label>
                  <input 
                    type="text"
                    className="w-full px-5 py-4 bg-[#F8F9FD] rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 border-2 border-transparent transition-all font-semibold"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Status</label>
                  <select 
                    className="w-full px-5 py-4 bg-[#F8F9FD] rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 border-2 border-transparent transition-all font-bold"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Shipping Address</label>
                  <textarea 
                    rows={3}
                    className="w-full px-5 py-4 bg-[#F8F9FD] rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 border-2 border-transparent transition-all font-semibold resize-none"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  ></textarea>
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#6C1DDB] to-[#2B0E68] text-white py-4 rounded-2xl font-bold shadow-lg shadow-purple-100 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={20} />}
                {selectedCustomer ? 'Sync Database' : 'Insert Entry'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
