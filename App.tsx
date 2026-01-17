
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
    return <div className="min-h-screen flex items-center justify-center bg-white font-bold text-[#6C1DDB]">Initializing Lexron...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/admin/login" 
          element={isAdminAuthenticated ? <Navigate to="/admin/dashboard" /> : <AdminLogin />} 
        />
        <Route 
          path="/admin/register" 
          element={isAdminAuthenticated ? <Navigate to="/admin/dashboard" /> : <AdminRegister />} 
        />

        {isAdminAuthenticated ? (
          <Route path="/admin" element={<AdminLayout onLogout={handleAdminLogout} />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="subcategories" element={<AdminSubcategories />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route index element={<Navigate to="/admin/dashboard" />} />
          </Route>
        ) : (
          <Route path="/admin/*" element={<Navigate to="/admin/login" />} />
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
