
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionStatus, Language } from '../types';
import { Clock, ArrowDownLeft, ArrowUpRight, Filter, ChevronLeft, X, Check, Calendar, ArrowUpDown } from 'lucide-react';

interface RecordsProps {
  transactions: Transaction[];
  onBack: () => void;
  language: Language;
}

type SortOrder = 'newest' | 'oldest';

const Records: React.FC<RecordsProps> = ({ transactions, onBack, language }) => {
  const [activeTab, setActiveTab] = useState<'recharge' | 'withdraw'>('recharge');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const t = {
    en: { 
      title: 'Financial Records', 
      recharges: 'Recharges', 
      withdrawals: 'Withdrawals', 
      history: 'Transaction History', 
      empty: 'No records found yet',
      filterTitle: 'Filter & Sort',
      statusLabel: 'Status',
      sortLabel: 'Sort By Date',
      apply: 'Apply Filters',
      reset: 'Reset',
      all: 'All Statuses',
      newest: 'Newest First',
      oldest: 'Oldest First'
    },
    hi: { 
      title: 'वित्तीय रिकॉर्ड', 
      recharges: 'रिचार्ज', 
      withdrawals: 'निकासी', 
      history: 'लेनदेन का इतिहास', 
      empty: 'अभी तक कोई रिकॉर्ड नहीं मिला',
      filterTitle: 'फ़िल्टर और सॉर्ट',
      statusLabel: 'स्थिति',
      sortLabel: 'तारीख के अनुसार क्रमबद्ध करें',
      apply: 'फ़िल्टर लागू करें',
      reset: 'रीसेट करें',
      all: 'सभी स्थितियाँ',
      newest: 'सबसे नया पहले',
      oldest: 'सबसे पुराना पहले'
    }
  }[language];

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(tx => {
        const typeMatch = activeTab === 'recharge' ? tx.type === 'Recharge' : tx.type === 'Withdraw';
        const statusMatch = statusFilter === 'All' || tx.status === statusFilter;
        return typeMatch && statusMatch;
      })
      .sort((a, b) => {
        return sortOrder === 'newest' 
          ? b.timestamp - a.timestamp 
          : a.timestamp - b.timestamp;
      });
  }, [transactions, activeTab, statusFilter, sortOrder]);

  const resetFilters = () => {
    setStatusFilter('All');
    setSortOrder('newest');
  };

  return (
    <div className="p-4 space-y-4 relative min-h-screen">
      <header className="flex items-center gap-4 px-2 py-2">
        <button 
          onClick={onBack} 
          className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-all active:scale-90"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-slate-100">{t.title}</h2>
      </header>

      <div className="flex p-1.5 glass rounded-2xl gap-1">
        {[
          { id: 'recharge', label: t.recharges },
          { id: 'withdraw', label: t.withdrawals },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center px-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.history}</p>
        <button 
          onClick={() => setShowFilters(true)}
          className={`p-2 glass rounded-lg transition-all ${statusFilter !== 'All' || sortOrder !== 'newest' ? 'text-cyan-400 border-cyan-500/30' : 'text-slate-400'}`}
        >
          <Filter size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(tx => (
            <TransactionItem key={tx.id} tx={tx} language={language} />
          ))
        ) : (
          <EmptyState text={t.empty} />
        )}
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end animate-fade-in">
          <div className="w-full bg-[#0b1120] rounded-t-[2.5rem] p-6 space-y-8 border-t border-white/10 animate-scale-in pb-12 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <Filter size={18} className="text-cyan-400" />
                {t.filterTitle}
              </h3>
              <button onClick={() => setShowFilters(false)} className="p-2 glass rounded-full text-slate-500 hover:text-white transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Status Filter */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                   <Check size={12} /> {t.statusLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['All', TransactionStatus.PENDING, TransactionStatus.APPROVED, TransactionStatus.REJECTED].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status as any)}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                        statusFilter === status 
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
                        : 'bg-slate-900 border-white/5 text-slate-500'
                      }`}
                    >
                      {status === 'All' ? t.all : (language === 'hi' ? { [TransactionStatus.PENDING]: 'लंबित', [TransactionStatus.APPROVED]: 'स्वीकृत', [TransactionStatus.REJECTED]: 'अस्वीकृत' }[status as TransactionStatus] : status)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Filter */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                   <ArrowUpDown size={12} /> {t.sortLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['newest', 'oldest'] as SortOrder[]).map((order) => (
                    <button
                      key={order}
                      onClick={() => setSortOrder(order)}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                        sortOrder === order 
                        ? 'bg-purple-500/10 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                        : 'bg-slate-900 border-white/5 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Calendar size={12} />
                        {order === 'newest' ? t.newest : t.oldest}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                onClick={resetFilters}
                className="flex-1 py-4 rounded-2xl bg-slate-900 border border-white/5 text-slate-400 font-black text-xs uppercase tracking-widest"
              >
                {t.reset}
              </button>
              <button 
                onClick={() => setShowFilters(false)}
                className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/20"
              >
                {t.apply}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TransactionItem: React.FC<{ tx: Transaction; language: Language }> = ({ tx, language }) => {
  const isRecharge = tx.type === 'Recharge';
  const statusColors: Record<string, string> = {
    [TransactionStatus.PENDING]: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    [TransactionStatus.APPROVED]: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    [TransactionStatus.REJECTED]: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  };

  const typeLabel = language === 'hi' 
    ? (isRecharge ? 'रिचार्ज' : 'निकासी')
    : tx.type;

  const statusLabel = language === 'hi'
    ? { [TransactionStatus.PENDING]: 'लंबित', [TransactionStatus.APPROVED]: 'स्वीकृत', [TransactionStatus.REJECTED]: 'अस्वीकृत' }[tx.status]
    : tx.status;

  return (
    <div className="p-4 glass rounded-2xl flex justify-between items-center animate-fade-in group hover:border-white/10 transition-all">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${isRecharge ? 'bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'bg-purple-500/10 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.1)]'}`}>
          {isRecharge ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
        </div>
        <div>
          <p className="font-bold text-slate-200 text-sm">{typeLabel}</p>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{new Date(tx.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
        </div>
      </div>
      <div className="text-right space-y-1">
        <p className="font-mono font-black text-sm">₹{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <div className="flex justify-end">
          <span className={`text-[9px] px-2 py-0.5 rounded-full border font-black uppercase tracking-tighter ${statusColors[tx.status] || ''}`}>
            {statusLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ text }: { text: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4 opacity-40">
    <div className="relative">
      <Clock size={56} strokeWidth={1.5} />
      <div className="absolute -bottom-1 -right-1 bg-slate-950 rounded-full p-0.5">
         <div className="w-4 h-4 rounded-full border border-slate-500 flex items-center justify-center text-[8px] font-black">?</div>
      </div>
    </div>
    <p className="text-xs font-bold uppercase tracking-widest">{text}</p>
  </div>
);

export default Records;
