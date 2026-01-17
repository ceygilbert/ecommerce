
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  LayoutGrid, 
  Database, 
  ShoppingBag, 
  CreditCard, 
  Sliders, 
  FileText, 
  Settings,
  LogOut,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Globe,
  Users
} from 'lucide-react';

interface AdminLayoutProps {
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(location.pathname.includes('category') || location.pathname.includes('subcategory'));

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/customers', icon: Users, label: 'Customers' },
    { path: '/admin/products', icon: Package, label: 'Products', hasSub: true },
    { 
      label: 'Category', 
      icon: LayoutGrid, 
      isDropdown: true,
      children: [
        { path: '/admin/categories', label: 'Manage Category' },
        { path: '/admin/subcategories', label: 'Manage Subcategory' }
      ]
    },
    { path: '/admin/brands', icon: Globe, label: 'Brands' },
    { path: '/admin/inventory', icon: Database, label: 'Inventory' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/purchases', icon: CreditCard, label: 'Purchases' },
    { path: '/admin/attributes', icon: Sliders, label: 'Attributes' },
    { path: '/admin/invoices', icon: FileText, label: 'Invoices' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex text-slate-700">
      <aside className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        bg-white transition-all duration-300 fixed h-full z-30 border-r border-slate-100 shadow-sm
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#E9E1FF] rounded-xl flex items-center justify-center text-[#6C1DDB]">
            <ShoppingBag size={24} />
          </div>
          {isSidebarOpen && (
            <h1 className="text-2xl font-black tracking-tighter text-[#6C1DDB]">Lexron</h1>
          )}
        </div>

        <div className="mt-4 px-4 py-2 h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-4">
            {isSidebarOpen ? 'General' : '•••'}
          </p>
          <nav className="space-y-1">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              
              if (item.isDropdown) {
                const isActive = item.children?.some(child => location.pathname === child.path);
                return (
                  <div key={idx} className="space-y-1">
                    <button
                      onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
                      className={`
                        w-full flex items-center p-3 rounded-2xl transition-all duration-200 group relative
                        ${isActive && !isCategoryExpanded ? 'bg-purple-50 text-[#6C1DDB]' : 'text-slate-500 hover:bg-slate-50'}
                      `}
                    >
                      <Icon size={20} className={isActive ? 'text-[#6C1DDB]' : 'text-slate-400 group-hover:text-[#6C1DDB]'} />
                      {isSidebarOpen && (
                        <div className="flex flex-1 items-center justify-between ml-3">
                          <span className="font-semibold text-sm">{item.label}</span>
                          {isCategoryExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </div>
                      )}
                    </button>
                    {isCategoryExpanded && isSidebarOpen && (
                      <div className="ml-9 space-y-1">
                        {item.children?.map(child => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`
                              block py-2 px-3 rounded-xl text-xs font-semibold transition-colors
                              ${location.pathname === child.path ? 'text-[#6C1DDB] bg-purple-50' : 'text-slate-400 hover:text-[#6C1DDB]'}
                            `}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center p-3 rounded-2xl transition-all duration-200 group relative
                    ${isActive 
                      ? 'bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] text-white shadow-lg shadow-purple-200' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#6C1DDB]'} />
                  {isSidebarOpen && (
                    <div className="flex flex-1 items-center justify-between ml-3">
                      <span className="font-semibold text-sm">{item.label}</span>
                      {item.hasSub && <ChevronRight size={14} className={isActive ? 'text-white' : 'text-slate-300'} />}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-8 w-full px-4 text-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mb-4 text-slate-300 hover:text-slate-600 transition-colors"
          >
            {isSidebarOpen ? <X size={20} className="mx-auto" /> : <Menu size={20} className="mx-auto" />}
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center w-full p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3 font-semibold text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="px-8 py-6 flex items-center justify-between sticky top-0 bg-[#F8F9FD]/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-800">Welcome! 👋</h2>
          </div>
          <div className="flex-1 max-w-md mx-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6C1DDB]" size={18} />
              <input 
                type="text" 
                placeholder="Search ..." 
                className="w-full bg-white border border-slate-100 rounded-full py-2.5 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <button className="p-2.5 bg-white rounded-full text-slate-400 border border-slate-50 shadow-sm relative"><Bell size={20} /></button>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">Admin User</p>
                <p className="text-[10px] text-slate-400 font-medium">Lexron Operator</p>
              </div>
              <img src="https://i.pravatar.cc/150?u=admin" className="w-11 h-11 rounded-2xl object-cover ring-2 ring-purple-100" />
            </div>
          </div>
        </header>

        <div className="px-8 pb-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
