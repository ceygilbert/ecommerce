
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ListTree, Loader2, Save, X, AlertCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { Category, Subcategory } from '../../types';

const AdminSubcategories: React.FC = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingSub, setEditingSub] = useState<Subcategory | null>(null);
  const [newSub, setNewSub] = useState({ name: '', slug: '', category_id: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, subRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('subcategories').select('*').order('name')
      ]);
      if (catRes.error) throw catRes.error;
      if (subRes.error) throw subRes.error;
      if (catRes.data) setCategories(catRes.data);
      if (subRes.data) setSubcategories(subRes.data);
    } catch (err: any) {
      console.error("Fetch Data Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newSub.name || !newSub.slug || !newSub.category_id) {
      alert("Please fill in all fields.");
      return;
    }

    setSaveLoading(true);
    try {
      const { data, error } = await supabase.from('subcategories').insert([newSub]).select();
      if (error) throw error;
      if (data) {
        setSubcategories(prev => [...prev, data[0]]);
        setNewSub({ name: '', slug: '', category_id: '' });
        setIsAdding(false);
      }
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingSub || !editingSub.name || !editingSub.slug || !editingSub.category_id) return;
    
    setSaveLoading(true);
    try {
      const { error } = await supabase
        .from('subcategories')
        .update({ 
          name: editingSub.name, 
          slug: editingSub.slug, 
          category_id: editingSub.category_id 
        })
        .eq('id', editingSub.id);
      
      if (error) throw error;
      
      setSubcategories(prev => prev.map(s => s.id === editingSub.id ? editingSub : s));
      setEditingSub(null);
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!confirmDeleteId) return;
    
    setDeletingId(confirmDeleteId);
    setConfirmDeleteId(null);
    try {
      const { error } = await supabase.from('subcategories').delete().eq('id', confirmDeleteId);
      if (error) throw error;
      
      setSubcategories(prev => prev.filter(s => s.id !== confirmDeleteId));
    } catch (err: any) {
      console.error("Subcategory Delete Error:", err);
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[28px] border border-slate-50 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-[#4A00E0] rounded-xl"><ListTree size={24} /></div>
          Sub-Categories
        </h2>
        <button 
          type="button"
          onClick={() => setIsAdding(true)}
          disabled={isAdding || categories.length === 0}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] text-white rounded-2xl hover:opacity-90 font-bold text-sm shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
        >
          <Plus size={18} /> New Sub-Item
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-[28px] border-2 border-dashed border-indigo-200 animate-in zoom-in-95">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select 
              className="px-5 py-3 bg-[#F8F9FD] rounded-xl text-sm font-semibold"
              value={newSub.category_id}
              onChange={e => setNewSub({ ...newSub, category_id: e.target.value })}
            >
              <option value="">Select Parent...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input 
              type="text" placeholder="Name" 
              className="px-5 py-3 bg-[#F8F9FD] rounded-xl"
              value={newSub.name}
              onChange={e => setNewSub({ ...newSub, name: e.target.value })}
            />
            <input 
              type="text" placeholder="Slug" 
              className="px-5 py-3 bg-[#F8F9FD] rounded-xl"
              value={newSub.slug}
              onChange={e => setNewSub({ ...newSub, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            />
          </div>
          <div className="mt-6 flex gap-2">
            <button type="button" onClick={handleAdd} disabled={saveLoading} className="bg-[#4A00E0] text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 flex items-center gap-2">
              {saveLoading && <Loader2 size={16} className="animate-spin" />}
              Save Item
            </button>
            <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 text-slate-400 font-bold">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#4A00E0]" size={40} /></div>
      ) : (
        <div className="bg-white rounded-[32px] border border-slate-50 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#F8F9FD] text-slate-400 text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="px-8 py-5">Subcategory</th>
                <th className="px-8 py-5">Parent</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {subcategories.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#F8F9FD]/50 transition-colors group">
                  <td className="px-8 py-5 font-bold text-slate-900">{sub.name}</td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-indigo-50 text-[#4A00E0] rounded-full text-[10px] font-black uppercase">
                      {categories.find(c => c.id === sub.category_id)?.name || 'Unlinked'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        type="button"
                        onClick={() => setEditingSub(sub)} 
                        className="p-2 text-slate-300 hover:text-blue-500 rounded-xl transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        type="button"
                        disabled={deletingId === sub.id}
                        onClick={() => setConfirmDeleteId(sub.id)} 
                        className="p-2 text-slate-300 hover:text-red-500 rounded-xl transition-all"
                      >
                        {deletingId === sub.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {subcategories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-8 py-10 text-center text-slate-400 italic">No subcategories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Sub Modal */}
      {editingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[40px] p-10 animate-in zoom-in-95">
            <h3 className="text-2xl font-black text-slate-900 mb-8">Edit Subcategory</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Parent Category</label>
                <select 
                  className="w-full px-5 py-4 bg-[#F8F9FD] rounded-2xl outline-none border border-transparent focus:border-indigo-200"
                  value={editingSub.category_id}
                  onChange={e => setEditingSub({...editingSub, category_id: e.target.value})}
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Name</label>
                  <input 
                    type="text" className="w-full px-5 py-4 bg-[#F8F9FD] rounded-2xl outline-none"
                    value={editingSub.name}
                    onChange={e => setEditingSub({...editingSub, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Slug</label>
                  <input 
                    type="text" className="w-full px-5 py-4 bg-[#F8F9FD] rounded-2xl outline-none"
                    value={editingSub.slug}
                    onChange={e => setEditingSub({...editingSub, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  />
                </div>
              </div>
            </div>
            <div className="mt-10 flex gap-3">
              <button 
                type="button"
                onClick={handleUpdate}
                disabled={saveLoading}
                className="flex-1 bg-[#4A00E0] text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2"
              >
                {saveLoading && <Loader2 size={18} className="animate-spin" />}
                Update Sub-Item
              </button>
              <button type="button" onClick={() => setEditingSub(null)} className="flex-1 py-4 text-slate-400 font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 text-center animate-in zoom-in-95">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Delete Subcategory?</h3>
            <p className="text-slate-500 mb-8">Are you sure you want to remove this item? This action is permanent and will remove it from all associated products.</p>
            <div className="flex gap-3">
              <button 
                onClick={handleDeleteConfirmed}
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-100 hover:bg-red-600 transition-colors"
              >
                Yes, Delete
              </button>
              <button 
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubcategories;
