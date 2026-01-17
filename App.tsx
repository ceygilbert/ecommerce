
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/admin/Login';
import AdminRegister from './pages/admin/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminCategories from './pages/admin/Categories';
import AdminSubcategories from './pages/admin/Subcategories';
import AdminBrands from './pages/admin/Brands';
import AdminLayout from './components/AdminLayout';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdminAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdminAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAdminLogout = async () => {
    await supabase.auth.signOut();
    setIsAdminAuthenticated(false);
  };

  if (isAdminAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-100 border-t-[#6C1DDB] rounded-full animate-spin"></div>
          <p className="font-bold text-[#6C1DDB] animate-pulse">Initializing Lexron...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/admin/login" 
          element={isAdminAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />} 
        />
        <Route 
          path="/admin/register" 
          element={isAdminAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <AdminRegister />} 
        />

        {isAdminAuthenticated ? (
          <Route path="/admin" element={<AdminLayout onLogout={handleAdminLogout} />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="subcategories" element={<AdminSubcategories />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        ) : (
          <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />
        )}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
