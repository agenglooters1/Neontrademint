
import React from 'react';
import { User, Language } from '../types';
import { 
  LogOut, 
  CreditCard, 
  ChevronRight, 
  Settings, 
  HelpCircle,
  MessageSquare,
  Lock,
  Star,
  BarChart3,
  Info,
  Wallet,
  ShieldCheck
} from 'lucide-react';

interface ProfileProps {
  user: User | null;
  language: Language;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, language, onLogout, onNavigate }) => {
  const t = {
    en: { messages: 'User Messages', about: 'About Us', bank: 'Bank Account', settings: 'Settings', signout: 'Sign out', accSettings: 'Account Settings', balance: 'My Balance', guest: 'Guest / Admin' },
    // Fix: Used consistent key 'accSettings' and removed syntax error (unquoted key with space) in Hindi translation
    hi: { messages: 'उपयोगकर्ता संदेश', बारे: 'हमारे बारे में', bank: 'बैंक खाता', settings: 'सेटिंग्स', signout: 'लॉग आउट', accSettings: 'खाता सेटिंग्स', balance: 'मेरा बैलेंस', guest: 'अतिथि / एडमिन' }
  }[language];

  // Safety check for display
  const displayBalance = user ? Math.max(0, user.balance) : 0;
  const username = user ? user.username : t.guest;

  return (
    <div className="p-6 space-y-8 pb-20">
      <div className="flex flex-col items-center justify-center pt-4">
        <div className="relative p-1 rounded-full bg-gradient-to-tr from-cyan-500/50 via-purple-500/50 to-emerald-500/50">
          <div className="w-32 h-32 rounded-full border-4 border-[#030712] overflow-hidden bg-slate-800">
            <img 
              src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user ? user.id : 'Admin'}&backgroundColor=b6e3f4`}
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-pulse scale-105" />
        </div>
        <p className="mt-4 text-xl font-black text-white uppercase tracking-tight">{username}</p>
      </div>

      <div className="glass-dark rounded-3xl p-6 border-white/5 shadow-2xl">
        <div className="grid grid-cols-2 gap-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-tight">₹{displayBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{t.balance}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white">
              <Lock size={20} />
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-tight">{user?.frozenBalance || 0}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Frozen</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
              <Star size={20} />
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-tight">VIP {user?.vipLevel || 1}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Level</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white">
              <BarChart3 size={20} />
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-tight">{user?.creditScore || 100}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Credit Score</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-200 ml-1">{t.accSettings}</h3>
        <div className="glass-dark rounded-3xl border-white/5 overflow-hidden">
          <button onClick={() => onNavigate('notifications')} className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all group border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <MessageSquare size={18} />
              </div>
              <span className="text-sm font-bold text-slate-200">{t.messages}</span>
            </div>
            <ChevronRight size={16} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
          </button>

          <button onClick={() => onNavigate('settings')} className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all group border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Settings size={18} />
              </div>
              <span className="text-sm font-bold text-slate-200">{t.settings}</span>
            </div>
            <ChevronRight size={16} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
          </button>

          <button onClick={() => onNavigate('bank')} className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all group border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                <CreditCard size={18} />
              </div>
              <span className="text-sm font-bold text-slate-200">{t.bank}</span>
            </div>
            <ChevronRight size={16} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
          </button>

          <button onClick={onLogout} className="w-full flex items-center justify-between p-5 hover:bg-rose-500/5 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center">
                <LogOut size={18} />
              </div>
              <span className="text-sm font-bold text-rose-500">{t.signout}</span>
            </div>
            <ChevronRight size={16} className="text-slate-600 group-hover:text-rose-500 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
