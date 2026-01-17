
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderTree, Loader2, Save, X, AlertCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { Category } from '../../types';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [newCat, setNewCat] = useState({ name: '', slug: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      setCategories(data || []);
    } catch (err: any) {
      console.error("Fetch Categories Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newCat.name || !newCat.slug) {
      alert("Please fill in both name and slug.");
      return;
    }
    
    setSaveLoading(true);
    try {
      const { data, error } = await supabase.from('categories').insert([newCat]).select();
      if (error) throw error;
      if (data) {
        setCategories(prev => [...prev, data[0]]);
        setNewCat({ name: '', slug: '' });
        setIsAdding(false);
      }
    } catch (err: any) {
      alert(`Failed to save: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingCat || !editingCat.name || !editingCat.slug) return;
    
    setSaveLoading(true);
    try {
      const { error } = await supabase
        .from('categories')
        .update({ name: editingCat.name, slug: editingCat.slug })
        .eq('id', editingCat.id);
      
      if (error) throw error;
      
      setCategories(prev => prev.map(c => c.id === editingCat.id ? editingCat : c));
      setEditingCat(null);
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
      const { error } = await supabase.from('categories').delete().eq('id', confirmDeleteId);
      if (error) throw error;
      setCategories(prev => prev.filter(c => c.id !== confirmDeleteId));
    } catch (err: any) {
      console.error("Delete Error:", err);
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[28px] border border-slate-50 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <div className="p-2 bg-purple-50 text-[#6C1DDB] rounded-xl"><FolderTree size={24} /></div>
          Manage Categories
        </h2>
        <button 
          type="button"
          onClick={() => setIsAdding(true)}
          disabled={isAdding || !!editingCat}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] text-white rounded-2xl hover:opacity-90 font-bold text-sm shadow-lg shadow-purple-100 transition-all disabled:opacity-50"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-[28px] border-2 border-dashed border-purple-200 animate-in slide-in-from-top-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">Name</label>
              <input 
                type="text" 
                placeholder="Category Name" 
                className="w-full px-5 py-3 bg-[#F8F9FD] rounded-xl outline-none focus:ring-2 focus:ring-purple-100"
                value={newCat.name}
                onChange={e => setNewCat({ ...newCat, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">Slug</label>
              <input 
                type="text" 
                placeholder="url-slug" 
                className="w-full px-5 py-3 bg-[#F8F9FD] rounded-xl outline-none focus:ring-2 focus:ring-purple-100"
                value={newCat.slug}
                onChange={e => setNewCat({ ...newCat, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button 
              type="button"
              onClick={handleAdd} 
              disabled={saveLoading}
              className="flex items-center gap-2 bg-[#6C1DDB] text-white px-6 py-2 rounded-xl font-bold disabled:opacity-50"
            >
              {saveLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
              Save
            </button>
            <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2 text-slate-400 font-bold">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#6C1DDB]" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm group hover:border-purple-200 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-[#F8F9FD] rounded-2xl flex items-center justify-center text-[#6C1DDB] text-xl font-black">
                  {cat.name.charAt(0)}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    type="button"
                    onClick={() => setEditingCat(cat)}
                    className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    type="button"
                    disabled={deletingId === cat.id}
                    onClick={() => setConfirmDeleteId(cat.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl"
                  >
                    {deletingId === cat.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{cat.name}</h3>
              <p className="text-slate-400 text-xs mt-1">path: /{cat.slug}</p>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-10 animate-in zoom-in-95">
            <h3 className="text-2xl font-black text-slate-900 mb-6">Edit Category</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Category Name</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-[#F8F9FD] rounded-2xl outline-none focus:ring-2 focus:ring-purple-200"
                  value={editingCat.name}
                  onChange={e => setEditingCat({...editingCat, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Slug</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-[#F8F9FD] rounded-2xl outline-none focus:ring-2 focus:ring-purple-200"
                  value={editingCat.slug}
                  onChange={e => setEditingCat({...editingCat, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                />
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <button 
                type="button"
                onClick={handleUpdate}
                disabled={saveLoading}
                className="flex-1 bg-[#6C1DDB] text-white py-4 rounded-2xl font-bold shadow-lg shadow-purple-100 flex items-center justify-center gap-2"
              >
                {saveLoading && <Loader2 size={18} className="animate-spin" />}
                Save Changes
              </button>
              <button 
                type="button"
                onClick={() => setEditingCat(null)}
                className="flex-1 py-4 text-slate-400 font-bold"
              >
                Cancel
              </button>
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
            <h3 className="text-2xl font-black text-slate-900 mb-2">Are you sure?</h3>
            <p className="text-slate-500 mb-8">This will permanently delete this category and all associated data. This action cannot be undone.</p>
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

export default AdminCategories;
