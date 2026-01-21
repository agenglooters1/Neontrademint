
import React, { useState } from 'react';
import { Transaction, TransactionStatus, User } from '../types';
import { ShieldAlert, Check, X, ChevronLeft, Users, RefreshCw, Wallet, Plus, Minus, MessageSquarePlus, Send, Ticket, Trash2, Key } from 'lucide-react';

interface AdminProps {
  users: User[];
  transactions: Transaction[];
  invitationCodes: string[];
  onUpdateStatus: (id: string, status: TransactionStatus) => void;
  onAdjustBalance: (userId: string, amount: number) => void;
  onSendNotification: (title: string, content: string) => void;
  onGenerateCode: () => string;
  onRemoveCode: (code: string) => void;
  onBack: () => void;
}

const Admin: React.FC<AdminProps> = ({ users, transactions, invitationCodes, onUpdateStatus, onAdjustBalance, onSendNotification, onGenerateCode, onRemoveCode, onBack }) => {
  const pendingTxs = transactions.filter(t => t.status === TransactionStatus.PENDING);
  const [selectedUserForAdjustment, setSelectedUserForAdjustment] = useState<string | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState<string>('');
  
  const [notifTitle, setNotifTitle] = useState('Welcome');
  const [notifContent, setNotifContent] = useState('');

  const handleAdjust = (type: 'add' | 'deduct') => {
    if (!selectedUserForAdjustment) return;
    const amount = parseFloat(adjustmentAmount);
    if (isNaN(amount) || amount <= 0) return alert('Enter a valid positive amount');
    const finalAmount = type === 'add' ? amount : -amount;
    onAdjustBalance(selectedUserForAdjustment, finalAmount);
    setAdjustmentAmount('');
    setSelectedUserForAdjustment(null);
  };

  const handleSendNotif = () => {
    if (!notifTitle || !notifContent) return alert('Fill all notification fields');
    onSendNotification(notifTitle, notifContent);
    setNotifTitle('Welcome');
    setNotifContent('');
    alert('Message broadcasted successfully!');
  };

  return (
    <div className="p-4 space-y-6 bg-[#030712] min-h-screen">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-all">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldAlert className="text-rose-400" size={20} /> Admin Panel
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">System Control Unit</p>
        </div>
      </div>

      {/* Invitation Codes Section */}
      <div className="glass p-6 rounded-3xl border-cyan-500/20 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black uppercase text-cyan-400 flex items-center gap-2">
            <Ticket size={16} /> Invitation Codes
          </h3>
          <button 
            onClick={() => onGenerateCode()}
            className="text-[10px] font-black uppercase px-3 py-1 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 active:scale-95 transition-all"
          >
            Generate New
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {invitationCodes.map(code => (
            <div key={code} className="flex items-center gap-2 bg-slate-900 border border-white/5 px-3 py-2 rounded-xl">
              <span className="text-xs font-mono font-bold text-slate-300">{code}</span>
              <button onClick={() => onRemoveCode(code)} className="text-rose-500 hover:text-rose-400 p-1">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Message Section */}
      <div className="glass p-6 rounded-3xl border-purple-500/20 space-y-4">
        <h3 className="text-sm font-black uppercase text-purple-400 flex items-center gap-2">
          <MessageSquarePlus size={16} /> Broadcast Message
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Notification Title"
            value={notifTitle}
            onChange={(e) => setNotifTitle(e.target.value)}
            className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500/30"
          />
          <textarea
            placeholder="Message Content"
            value={notifContent}
            onChange={(e) => setNotifContent(e.target.value)}
            className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500/30 h-20"
          />
          <button 
            onClick={handleSendNotif}
            className="w-full py-3 bg-purple-600 rounded-xl font-bold flex items-center justify-center gap-2 text-white shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
          >
            <Send size={16} /> Send Message
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase">Total Users</p>
          <p className="text-2xl font-bold flex items-center gap-2"><Users size={16} /> {users.length}</p>
        </div>
        <div className="glass p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase">Pending Requests</p>
          <p className="text-2xl font-bold flex items-center gap-2 text-amber-400"><RefreshCw size={16} /> {pendingTxs.length}</p>
        </div>
      </div>

      {selectedUserForAdjustment && (
        <div className="glass p-6 rounded-3xl border-cyan-500/30 animate-fade-in space-y-4 shadow-xl shadow-cyan-500/10">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black uppercase text-cyan-400 flex items-center gap-2">
              <Wallet size={16} /> Adjust User Balance
            </h3>
            <button onClick={() => setSelectedUserForAdjustment(null)} className="text-slate-500">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">₹</div>
              <input
                type="number"
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-10 pr-4 py-4 text-xl font-mono text-white"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleAdjust('add')} className="flex-1 bg-emerald-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                <Plus size={18} /> Add
              </button>
              <button onClick={() => handleAdjust('deduct')} className="flex-1 bg-rose-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20">
                <Minus size={18} /> Deduct
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Review Requests</h3>
        {pendingTxs.map(tx => (
          <div key={tx.id} className="glass rounded-2xl p-4 border-l-4 border-amber-500/50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-bold text-slate-200">{tx.type} Request</p>
                <p className="text-[10px] text-slate-500 font-mono">{new Date(tx.timestamp).toLocaleString()}</p>
              </div>
              <p className="text-xl font-mono font-bold text-cyan-400">₹{tx.amount.toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onUpdateStatus(tx.id, TransactionStatus.APPROVED)} className="flex-1 bg-emerald-500/20 text-emerald-400 font-bold py-2 rounded-xl border border-emerald-500/20">
                <Check size={16} /> Approve
              </button>
              <button onClick={() => onUpdateStatus(tx.id, TransactionStatus.REJECTED)} className="flex-1 bg-rose-500/20 text-rose-400 font-bold py-2 rounded-xl border border-rose-500/20">
                <X size={16} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Platform Users</h3>
        <div className="space-y-2">
          {users.map(u => (
            <div key={u.id} className="p-4 glass rounded-2xl flex flex-col gap-3 group transition-all hover:border-cyan-500/30">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-xs font-bold text-cyan-400">
                    {u.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">{u.username}</p>
                    <p className="text-[10px] text-slate-500 font-bold">VIP {u.vipLevel}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold text-emerald-400">₹{u.balance.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <div className="flex items-center gap-2 text-slate-500">
                  <Key size={12} className="text-amber-500" />
                  <span className="text-[10px] font-mono select-all">PWD: {u.password}</span>
                </div>
                <button onClick={() => setSelectedUserForAdjustment(u.id)} className="text-[9px] font-black uppercase text-cyan-500 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">
                  Adjust
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
