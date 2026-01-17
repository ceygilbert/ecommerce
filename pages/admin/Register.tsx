
import React, { useState } from 'react';
import { Lock, Mail, ChevronRight, UserPlus, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

const AdminRegister: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'admin',
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user && data.session) {
        // Automatically logged in
        navigate('/admin/dashboard');
      } else {
        setError('Please check your email for a confirmation link.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-900/40">
            <UserPlus className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Admin Account</h1>
          <p className="text-slate-400">Temporary Registration Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700/50 backdrop-blur-sm">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="admin@techcore.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Admin Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-900/20"
            >
              {loading ? 'Creating Account...' : 'Register Administrator'}
              {!loading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-400">Already have an account?</span>{' '}
            <Link to="/admin/login" className="text-blue-400 font-bold hover:underline">
              Log In
            </Link>
          </div>
        </form>

        <p className="mt-8 text-center text-xs text-slate-500 px-6">
          By registering, you acknowledge this is a secure administrative portal.
          Ensure you use a strong unique password.
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
