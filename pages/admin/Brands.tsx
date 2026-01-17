
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Upload, 
  Loader2, 
  AlertCircle, 
  AlertTriangle, 
  Image as ImageIcon,
  Globe,
  X,
  Check
} from 'lucide-react';
import { supabase } from '../../services/supabase';
import { Brand } from '../../types';

const AdminBrands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', logo_url: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('brands').select('*').order('name');
      if (error) throw error;
      setBrands(data || []);
    } catch (err: any) {
      console.error("Fetch Brands Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      // Upload to 'brands' bucket - ensure this bucket exists in Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('brands')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('brands')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, logo_url: publicUrl }));
    } catch (err: any) {
      alert(`Upload failed: ${err.message}. Make sure you have a 'brands' bucket created in Supabase Storage with public access.`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setSaveLoading(true);
    try {
      if (editingBrand) {
        const { error } = await supabase
          .from('brands')
          .update({ name: formData.name, logo_url: formData.logo_url })
          .eq('id', editingBrand.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('brands')
          .insert([formData]);
        if (error) throw error;
      }
      
      fetchBrands();
      closeModal();
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    
    setSaveLoading(true);
    try {
      const { error } = await supabase.from('brands').delete().eq('id', confirmDeleteId);
      if (error) throw error;
      setBrands(prev => prev.filter(b => b.id !== confirmDeleteId));
      setConfirmDeleteId(null);
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const openEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({ name: brand.name, logo_url: brand.logo_url || '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
    setFormData({ name: '', logo_url: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[28px] border border-slate-50 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Globe size={24} /></div>
          Brand Partners
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:opacity-90 font-bold text-sm shadow-lg shadow-blue-100 transition-all"
        >
          <Plus size={18} /> New Partner
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <div key={brand.id} className="bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm group hover:border-blue-200 transition-all text-center">
              <div className="relative mb-6 mx-auto w-24 h-24 bg-[#F8F9FD] rounded-[24px] flex items-center justify-center overflow-hidden border border-slate-50 group-hover:border-blue-100 transition-all">
                {brand.logo_url ? (
                  <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain p-2" />
                ) : (
                  <ImageIcon size={32} className="text-slate-300" />
                )}
                
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-tight">{brand.name}</h3>
              
              <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={() => openEdit(brand)}
                  className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => setConfirmDeleteId(brand.id)}
                  className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {/* Add Placeholder */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="border-4 border-dashed border-slate-100 rounded-[32px] p-8 flex flex-col items-center justify-center text-slate-300 hover:text-blue-400 hover:border-blue-100 hover:bg-blue-50/30 transition-all"
          >
            <Plus size={40} className="mb-2" />
            <span className="font-bold">Add Partner</span>
          </button>
        </div>
      )}

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-10 animate-in zoom-in-95 overflow-hidden relative">
            <button onClick={closeModal} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-black text-slate-900 mb-8">
              {editingBrand ? 'Edit Partner' : 'New Brand Partner'}
            </h3>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1">Brand Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. NVIDIA, Apple, Logitech"
                  className="w-full px-6 py-4 bg-[#F8F9FD] rounded-2xl outline-none border-2 border-transparent focus:border-blue-200 transition-all font-semibold"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1">Brand Logo</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    w-full h-40 border-4 border-dashed rounded-[32px] flex flex-col items-center justify-center cursor-pointer transition-all
                    ${formData.logo_url ? 'border-blue-100 bg-blue-50/30' : 'border-slate-100 bg-[#F8F9FD] hover:border-blue-200'}
                  `}
                >
                  {uploading ? (
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                  ) : formData.logo_url ? (
                    <div className="relative group w-full h-full flex items-center justify-center p-4">
                      <img src={formData.logo_url} className="max-h-full object-contain" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[28px] flex items-center justify-center">
                        <p className="text-white text-xs font-bold">Change Logo</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} className="text-slate-300 mb-2" />
                      <p className="text-xs font-bold text-slate-400">Upload SVG, PNG or JPG</p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="submit"
                  disabled={saveLoading || uploading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saveLoading && <Loader2 size={18} className="animate-spin" />}
                  {editingBrand ? 'Update Partner' : 'Save Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 text-center animate-in zoom-in-95">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Remove Partner?</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Are you sure you want to remove this brand? Products linked to this brand might lose their association.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={handleDelete}
                disabled={saveLoading}
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-100 hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                {saveLoading && <Loader2 size={18} className="animate-spin" />}
                Yes, Remove
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

export default AdminBrands;
