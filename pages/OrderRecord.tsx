
import React, { useState } from 'react';
import { TradeRecord, ActiveTrade, Language } from '../types';
import { ChevronLeft, TrendingUp, TrendingDown, ClipboardList, Timer } from 'lucide-react';

interface OrderRecordProps {
  trades: TradeRecord[];
  activeTrades: ActiveTrade[];
  onBack: () => void;
  language: Language;
}

const OrderRecord: React.FC<OrderRecordProps> = ({ trades, activeTrades, onBack, language }) => {
  const [activeToggle, setActiveToggle] = useState<'position' | 'closeout'>('position');

  const t = {
    en: { title: 'Order Record', position: 'Position orders', closeout: 'Closeout Orders', noMore: 'There is no more', settled: 'Settled', left: 'left' },
    hi: { title: 'ऑर्डर रिकॉर्ड', position: 'मौजूदा ऑर्डर', closeout: 'पूर्ण ऑर्डर', noMore: 'कोई डेटा नहीं है', settled: 'निपटाया गया', left: 'शेष' }
  }[language];

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-slate-100 font-sans">
      {/* Header */}
      <header className="px-4 py-4 flex items-center gap-2 border-b border-white/5 bg-[#030712]">
        <button onClick={onBack} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
          <ChevronLeft size={24} className="text-slate-300" />
        </button>
        <h1 className="text-lg font-bold">{t.title}</h1>
      </header>

      {/* Segmented Toggle */}
      <div className="px-4 py-4">
        <div className="flex bg-[#0b1120] rounded-lg p-1 border border-white/5">
          <button
            onClick={() => setActiveToggle('position')}
            className={`flex-1 py-2 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeToggle === 'position' 
                ? 'bg-[#111827] text-cyan-400 shadow-sm' 
                : 'text-slate-500'
            }`}
          >
            <Timer size={14} className={activeToggle === 'position' ? 'text-cyan-400' : 'text-slate-600'} />
            {t.position}
          </button>
          <button
            onClick={() => setActiveToggle('closeout')}
            className={`flex-1 py-2 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeToggle === 'closeout' 
                ? 'bg-[#111827] text-cyan-400 shadow-sm' 
                : 'text-slate-500'
            }`}
          >
            <ClipboardList size={14} className={activeToggle === 'closeout' ? 'text-cyan-400' : 'text-slate-600'} />
            {t.closeout}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4">
        {activeToggle === 'position' ? (
          activeTrades.length > 0 ? (
            <div className="space-y-3 pb-8">
              {activeTrades.map((trade) => (
                <div key={trade.id} className="p-4 bg-[#0b1120] rounded-2xl border border-white/5 space-y-3 overflow-hidden relative">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                        <Timer size={20} className="animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-100">{trade.coinSymbol}/USDT</span>
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                            trade.type === 'Buy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                          }`}>
                            {language === 'hi' ? (trade.type === 'Buy' ? 'खरीदें' : 'बेचें') : trade.type}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-500 font-mono mt-0.5">Margin: ₹{trade.amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-mono font-black text-cyan-400 tabular-nums">{trade.remainingSeconds}s</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase">{t.left}</p>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-500 transition-all duration-1000 ease-linear shadow-[0_0_8px_#22d3ee]" 
                      style={{ width: `${(trade.remainingSeconds / trade.duration) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 opacity-40">
              <div className="text-center space-y-4 pt-12">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/20 mx-auto" />
                  <p className="text-xs font-medium text-slate-500">{t.noMore}</p>
              </div>
            </div>
          )
        ) : (
          <div className="space-y-3 pb-8">
            {trades.length > 0 ? (
              trades.map((trade) => (
                <div key={trade.id} className="p-4 bg-[#0b1120] rounded-2xl border border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${trade.status === 'Win' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {trade.status === 'Win' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-100">{trade.coinSymbol}/USDT</span>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                          trade.type === 'Buy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {language === 'hi' ? (trade.type === 'Buy' ? 'खरीदें' : 'बेचें') : trade.type}
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-500 font-mono mt-1">
                        {new Date(trade.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono font-black ${trade.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {trade.profit >= 0 ? '+' : ''}₹{trade.profit.toFixed(2)}
                    </p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase">{t.settled}: {trade.duration}s</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center space-y-4 pt-24 opacity-40">
                 <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/20 mx-auto" />
                 <p className="text-xs font-medium text-slate-500">{t.noMore}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderRecord;
