
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
  MoreVertical,
  X,
  UserPlus,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { supabase, mockDb } from '../../services/supabase';
import { Profile } from '../../types';

const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
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
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setCustomers(data || []);
      
      if (data?.length === 0) {
        setCustomers(mockDb.profiles as Profile[]);
      }
    } catch (err: any) {
      console.warn("Falling back to mock customer data.");
      setCustomers(mockDb.profiles as Profile[]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedCustomer) {
        const { error } = await supabase
          .from('profiles')
          .update(formData)
          .eq('id', selectedCustomer.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('profiles')
          .insert([{ ...formData, created_at: new Date().toISOString() }]);
        if (error) throw error;
      }
      fetchCustomers();
      closeModal();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this customer profile?')) return;
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
      full_name: customer.full_name,
      email: customer.email,
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
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Customer Management</h2>
            <p className="text-xs text-slate-400 font-medium">Manage and monitor customer profiles</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#F8F9FD] border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-purple-200 transition-all text-sm"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6C1DDB] to-[#4A00E0] text-white rounded-2xl hover:opacity-90 font-bold text-sm shadow-lg shadow-purple-100 transition-all"
          >
            <UserPlus size={18} /> New Profile
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[28px] border border-slate-50 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Users size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Customers</p>
            <p className="text-2xl font-black text-slate-800">{customers.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[28px] border border-slate-50 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Calendar size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Accounts</p>
            <p className="text-2xl font-black text-slate-800">{customers.filter(c => c.status === 'active').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[28px] border border-slate-50 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <AlertTriangle size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suspended</p>
            <p className="text-2xl font-black text-slate-800">{customers.filter(c => c.status === 'suspended').length}</p>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-[32px] border border-slate-50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Loader2 className="animate-spin text-[#6C1DDB]" size={48} />
            <p className="text-slate-400 font-bold italic">Gathering customer profiles...</p>
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
                          <p className="font-bold text-slate-900 mb-0.5">{customer.full_name}</p>
                          <p className="text-[10px] font-bold text-[#6C1DDB] bg-purple-50 px-2 py-0.5 rounded-full inline-block">ID: {customer.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <Mail size={12} className="text-slate-300" /> {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <Phone size={12} className="text-slate-300" /> {customer.phone || 'N/A'}
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

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-10 animate-in zoom-in-95 relative">
            <button onClick={closeModal} className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 transition-colors">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 mb-8">{selectedCustomer ? 'Edit Customer' : 'New Customer Profile'}</h3>
            
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
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email Address</label>
                  <input 
                    type="email" required
                    className="w-full px-5 py-4 bg-[#F8F9FD] rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 border-2 border-transparent transition-all font-semibold"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Phone Number</label>
                  <input 
                    type="text"
                    className="w-full px-5 py-4 bg-[#F8F9FD] rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 border-2 border-transparent transition-all font-semibold"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Account Status</label>
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
                {selectedCustomer ? 'Update Profile' : 'Create Profile'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {isDetailOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[48px] p-12 animate-in slide-in-from-bottom-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Users size={180} className="text-[#6C1DDB]" />
            </div>
            
            <button onClick={() => setIsDetailOpen(false)} className="absolute top-10 right-10 p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full">
              <X size={24} />
            </button>

            <div className="relative z-10">
              <div className="flex items-center gap-8 mb-10">
                <img 
                  src={selectedCustomer.avatar_url || `https://i.pravatar.cc/150?u=${selectedCustomer.id}`} 
                  className="w-32 h-32 rounded-[40px] object-cover border-4 border-slate-50 shadow-xl"
                />
                <div>
                  <h3 className="text-4xl font-black text-slate-900 leading-tight mb-2">{selectedCustomer.full_name}</h3>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                      selectedCustomer.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {selectedCustomer.status}
                    </span>
                    <span className="text-sm font-bold text-slate-400">Customer since {new Date(selectedCustomer.created_at).getFullYear()}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Mail size={12} /> Contact Email
                      </p>
                      <p className="font-bold text-slate-800 text-lg">{selectedCustomer.email}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Phone size={12} /> Phone Number
                      </p>
                      <p className="font-bold text-slate-800 text-lg">{selectedCustomer.phone || 'Not Provided'}</p>
                   </div>
                </div>
                <div className="space-y-6">
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <MapPin size={12} /> Registered Address
                      </p>
                      <p className="font-bold text-slate-800 text-sm leading-relaxed">{selectedCustomer.address || 'No address saved'}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Calendar size={12} /> Registration Date
                      </p>
                      <p className="font-bold text-slate-800 text-lg">{new Date(selectedCustomer.created_at).toLocaleString()}</p>
                   </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-100 flex gap-4">
                 <button 
                  onClick={() => { setIsDetailOpen(false); openEdit(selectedCustomer); }}
                  className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors"
                >
                  Edit Profile
                </button>
                <button 
                  className="px-8 py-4 bg-purple-50 text-[#6C1DDB] font-bold rounded-2xl hover:bg-purple-100 transition-colors"
                >
                  View Order History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
