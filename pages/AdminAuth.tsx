
import React, { useState } from 'react';
import { ShieldAlert, Lock, LogIn, ChevronLeft } from 'lucide-react';

interface AdminAuthProps {
  onAdminLogin: (user: string, pass: string) => void;
  onBack: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onAdminLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Admin credentials updated per request
    if (username === 'chinasystem' && password === 'jingping@12koplar#12') {
      onAdminLogin(username, password);
    } else {
      setError('Invalid Administrative Credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col p-8 justify-center items-center">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors text-sm font-bold"
        >
          <ChevronLeft size={16} /> Back to User Login
        </button>

        <div className="text-center space-y-3">
          <div className="inline-block p-4 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 mb-2 shadow-2xl shadow-rose-500/5">
             <ShieldAlert className="text-rose-500" size={40} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">
            Admin Portal
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-xl text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Username</label>
            <div className="relative group">
              <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Enter username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secret Key</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-500 transition-colors" size={20} />
              <input
                type="password"
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-rose-600/20 hover:bg-rose-500 transform active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            Access Terminal
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuth;
