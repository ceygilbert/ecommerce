
import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Illustration */}
        <div className="hidden lg:flex justify-center items-center relative h-[500px]">
          {/* Main Arched Door */}
          <div className="absolute left-1/4 bottom-10 w-48 h-72 bg-[#D1A3FF] rounded-t-full border-b-4 border-gray-300">
            <div className="grid grid-cols-2 grid-rows-3 gap-2 p-6 h-full">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/40 rounded-sm"></div>
              ))}
            </div>
            {/* Door Handle */}
            <div className="absolute right-[-12px] top-1/2 w-6 h-6 bg-[#6B11CB] rounded-full border-2 border-white"></div>
          </div>
          
          {/* Character */}
          <div className="absolute left-[45%] bottom-10 z-10">
            <svg width="120" height="240" viewBox="0 0 120 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Simplified Character Body */}
              <circle cx="60" cy="40" r="18" fill="#3F3D56" /> {/* Head */}
              <rect x="42" y="58" width="36" height="60" rx="10" fill="#6C1DDB" /> {/* Shirt */}
              <rect x="45" y="118" width="14" height="80" fill="#2F2E41" /> {/* Left Leg */}
              <rect x="61" y="118" width="14" height="80" fill="#2F2E41" /> {/* Right Leg */}
              <rect x="42" y="198" width="20" height="6" fill="#3F3D56" /> {/* Left Shoe */}
              <rect x="58" y="198" width="20" height="6" fill="#3F3D56" /> {/* Right Shoe */}
              <path d="M30 110 L45 70" stroke="#FFC1B6" strokeWidth="12" strokeLinecap="round" /> {/* Arm reaching */}
            </svg>
          </div>

          {/* Abstract Leaves/Background */}
          <div className="absolute left-0 bottom-0 w-64 h-48 bg-[#F3E8FF] rounded-full blur-3xl opacity-50 -z-10"></div>
          <div className="absolute right-0 bottom-10 w-40 h-40 bg-[#F3E8FF] rounded-full blur-2xl opacity-40 -z-10"></div>
          
          {/* Simple Ground Line */}
          <div className="absolute bottom-10 left-0 right-0 h-0.5 bg-gray-300"></div>
        </div>

        {/* Right Side: Form */}
        <div className="max-w-md w-full mx-auto lg:mx-0">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-[#6C1DDB] mb-4">Log In</h1>
            <p className="text-gray-500 leading-relaxed">
              Log in with your data that you entered during your registration
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Username Field */}
            <div className="relative">
              <label className="absolute -top-3 left-4 bg-white px-2 text-sm text-gray-400 font-medium z-10">
                Username
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#6C1DDB] rounded-lg py-4 px-5 text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#6C1DDB] transition-all"
                placeholder="alvinjoseph6@gmail.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-gray-100 rounded-lg py-4 px-5 text-gray-800 focus:outline-none focus:border-[#6C1DDB] transition-all"
                  placeholder="**********"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Checkbox and Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-[#6C1DDB] focus:ring-[#6C1DDB] transition-all"
                />
                <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors">Keep me logged in</span>
              </label>
              <a href="#" className="text-sm font-bold text-[#6C1DDB] hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <div className="pt-4 flex justify-center">
              <div className="relative inline-block w-48">
                {/* Decorative blob behind button as seen in design */}
                <div className="absolute -inset-2 bg-[#D1A3FF] rounded-full opacity-30 blur-lg -z-10"></div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#6C1DDB] to-[#2B0E68] text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    'Login'
                  )}
                </button>
              </div>
            </div>

            <div className="pt-4 text-center text-sm">
              <span className="text-gray-400">Don't have an account? </span>
              <Link to="/admin/register" className="text-[#6C1DDB] font-bold hover:underline">
                Register Admin
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
