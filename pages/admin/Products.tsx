
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Upload, 
  Edit2, 
  Trash2, 
  Sparkles,
  FileDown,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { supabase, mockDb } from '../../services/supabase';
import { generateProductDescription } from '../../services/gemini';
import { Product } from '../../types';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('categories').select('*')
      ]);

      if (prodRes.error) throw prodRes.error;
      if (catRes.error) throw catRes.error;

      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      
      if (prodRes.data?.length === 0) {
        setProducts(mockDb.products as any);
      }
    } catch (err: any) {
      setError('Using local fallback for products.');
      setProducts(mockDb.products as any);
      setCategories(mockDb.categories as any);
    } finally {
      setLoading(false);
    }
  };

  const handleAiDescription = async (id: string, name: string) => {
    setIsAiGenerating(id);
    const desc = await generateProductDescription(name, "IT Store Product, Tech Specs focused.");
    setProducts(prev => prev.map(p => p.id === id ? { ...p, description: desc } : p));
    if (!id.startsWith('mock-')) {
      await supabase.from('products').update({ description: desc }).eq('id', id);
    }
    setIsAiGenerating(null);
  };

  const deleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        alert('Delete failed.');
      } else {
        setProducts(products.filter(p => p.id !== id));
      }
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[28px] border border-slate-50 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6C1DDB] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-12 pr-4 py-3 bg-[#F8F9FD] border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-purple-200 transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-600 font-bold text-sm transition-all"
          >
            <Upload size={18} /> Import
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] text-white rounded-2xl hover:opacity-90 font-bold text-sm transition-all shadow-lg shadow-purple-100">
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[32px] border border-slate-50 shadow-sm overflow-hidden min-h-[500px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[500px] gap-4">
            <Loader2 className="animate-spin text-[#6C1DDB]" size={48} />
            <p className="text-slate-400 font-bold">Synchronizing...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#F8F9FD] text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-8 py-5">Product Details</th>
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5">Price</th>
                  <th className="px-8 py-5">Inventory</th>
                  <th className="px-8 py-5">GenAI</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#F8F9FD]/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img 
                          src={product.image_url || 'https://via.placeholder.com/150'} 
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-50 group-hover:ring-purple-100 transition-all" 
                        />
                        <div>
                          <p className="font-bold text-slate-900 mb-0.5">{product.name}</p>
                          <p className="text-xs text-slate-400 font-medium line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-4 py-1.5 bg-purple-50 text-[#6C1DDB] rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {categories.find(c => c.id === product.category_id)?.name || 'Misc'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-black text-slate-900">${product.price?.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-400' : 'bg-orange-400'}`}></div>
                         <span className="text-sm font-bold text-slate-700">{product.stock} Units</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <button 
                        onClick={() => handleAiDescription(product.id, product.name)}
                        disabled={isAiGenerating === product.id}
                        className="flex items-center gap-2 text-[10px] font-bold text-[#6C1DDB] bg-[#E9E1FF] px-4 py-2 rounded-xl hover:bg-[#D1A3FF] hover:text-white transition-all disabled:opacity-50"
                      >
                        <Sparkles size={14} />
                        {isAiGenerating === product.id ? 'Optimizing...' : 'Sync Description'}
                      </button>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
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

      {/* CSV Modal - Updated Styling */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/20">
          <div className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-3xl font-black text-slate-900 mb-2">Inventory Sync</h3>
            <p className="text-slate-400 font-medium mb-10">Select your CSV file to synchronize bulk products.</p>
            
            <div className="border-4 border-dashed border-[#F8F9FD] rounded-[32px] p-12 text-center group hover:border-purple-200 transition-colors cursor-pointer bg-[#F8F9FD]/50">
              <Upload size={48} className="mx-auto text-[#6C1DDB] mb-6 group-hover:scale-110 transition-transform" />
              <p className="font-bold text-slate-700 mb-1">Click to browse file</p>
              <p className="text-xs text-slate-400">Supported formats: .CSV, .XLSX</p>
            </div>

            <div className="mt-10 flex gap-4">
               <button onClick={() => setIsImportModalOpen(false)} className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
               <button className="flex-1 py-4 bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] text-white font-bold rounded-2xl shadow-xl shadow-purple-100">Upload Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
