
import React, { useState } from 'react';
import { BankAccount } from '../types';
import { ChevronLeft, Save, Building, User, CreditCard, Hash } from 'lucide-react';

interface BankPageProps {
  currentAccount?: BankAccount;
  onSave: (account: BankAccount) => void;
  onBack: () => void;
}

const BankPage: React.FC<BankPageProps> = ({ currentAccount, onSave, onBack }) => {
  const [form, setForm] = useState<BankAccount>(currentAccount || {
    holderName: '',
    bankName: '',
    accountNumber: '',
    ifsc: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    alert('Bank account updated successfully!');
    onBack();
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack} 
          className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-all active:scale-90"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">Bank Details</h2>
      </div>

      <div className="glass rounded-3xl p-6 border-cyan-500/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <CreditCard size={80} />
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
              <User size={12} /> Account Holder
            </label>
            <input
              type="text"
              required
              value={form.holderName}
              onChange={e => setForm({...form, holderName: e.target.value})}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
              <Building size={12} /> Bank Name
            </label>
            <input
              type="text"
              required
              value={form.bankName}
              onChange={e => setForm({...form, bankName: e.target.value})}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              placeholder="Neon Central Bank"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
              <Hash size={12} /> Account Number
            </label>
            <input
              type="text"
              required
              value={form.accountNumber}
              onChange={e => setForm({...form, accountNumber: e.target.value})}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3.5 text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              placeholder="0000 0000 0000"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">IFSC CODE</label>
            <input
              type="text"
              required
              value={form.ifsc}
              onChange={e => setForm({...form, ifsc: e.target.value})}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3.5 text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              placeholder="NEON0123456"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Update Banking Info
          </button>
        </form>
      </div>
    </div>
  );
};

export default BankPage;
