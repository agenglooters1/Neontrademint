
import React, { useState } from 'react';
import { LogIn, ShieldCheck, Smartphone } from 'lucide-react';

interface AuthProps {
  onLogin: (phone: string) => void;
  onAdminAccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onAdminAccess }) => {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    setError('');

    if (!mobile) {
      setError('Phone number required');
      return;
    }

    onLogin(mobile);
  };

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col justify-center items-center p-8">
      <div className="w-full max-w-md space-y-8">

        {/* LOGO + TITLE */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-xl">
            <span className="text-3xl font-black text-white italic">NT</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Login with Phone
          </h1>

          <p className="text-slate-400 font-medium">
            Secure trading platform
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-xl text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">
              Mobile Number
            </label>

            <div className="relative">
              <Smartphone
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={20}
              />

              <input
                type="tel"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            Login Securely
          </button>
        </form>

        {/* ADMIN ACCESS */}
        <div className="pt-6 border-t border-white/5 text-center">
          <button
            onClick={onAdminAccess}
            className="flex items-center gap-2 mx-auto text-[11px] text-slate-600 font-black uppercase tracking-widest hover:text-rose-500 transition-colors"
          >
            <ShieldCheck size={14} />
            Administrative Access
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
