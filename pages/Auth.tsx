
import React, { useState } from 'react';
import { User, Lock, UserPlus, LogIn, KeyRound, ShieldCheck, Eye, EyeOff, Smartphone } from 'lucide-react';

interface AuthProps {
  onLogin: (mobile: string, pass: string) => boolean;
  onRegister: (mobile: string, pass: string, code: string) => { success: boolean, message: string };
  onAdminAccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onRegister, onAdminAccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referral, setReferral] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (!referral) {
        setError('Invitation code is required');
        return;
      }
      const result = onRegister(mobile, password, referral);
      if (!result.success) {
        setError(result.message);
      }
    } else {
      const success = onLogin(mobile, password);
      if (!success) {
        setError('Invalid mobile number or password. Please sign up if you have not registered.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col p-8 justify-center items-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 mb-4 shadow-xl">
             <div className="text-3xl font-black text-white italic">NT</div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            {isRegister ? 'Join NeonTrade' : 'Welcome Back'}
          </h1>
          <p className="text-slate-400 font-medium">Secure trading platform</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mobile Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Mobile Number</label>
            <div className="relative group">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Enter mobile number"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-12 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {isRegister && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-12 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Invitation Code</label>
                <div className="relative group">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Enter Invitation Code"
                    required
                    value={referral}
                    onChange={(e) => setReferral(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transform active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isRegister ? <UserPlus size={20} /> : <LogIn size={20} />}
            {isRegister ? 'Register Account' : 'Login Securely'}
          </button>
        </form>

        <div className="text-center space-y-4">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setShowPassword(false);
              setShowConfirmPassword(false);
            }}
            className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
          >
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Sign up"}
          </button>
          
          <div className="pt-6 border-t border-white/5">
             <button 
               onClick={onAdminAccess}
               className="flex items-center gap-2 mx-auto text-[10px] text-slate-600 font-black uppercase tracking-widest hover:text-rose-500 transition-colors"
             >
                <ShieldCheck size={14} /> Administrative Access
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
