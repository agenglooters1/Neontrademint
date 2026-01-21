
import React, { useState, useEffect } from 'react';
import { fetchLivePrices } from '../services/cryptoService';
import { Coin, Language, User as UserType } from '../types';
import { TrendingUp, TrendingDown, RefreshCcw, Search, Wallet, Landmark, Repeat, Star, ShieldCheck } from 'lucide-react';

interface HomeProps {
  onCoinSelect: (coin: Coin) => void;
  onQuickAction: (action: string) => void;
  setTickerData: (data: Coin[]) => void;
  language: Language;
  user: UserType | null;
}

const Home: React.FC<HomeProps> = ({ onCoinSelect, onQuickAction, setTickerData, language, user }) => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  const t = {
    en: {
      overview: 'Market Overview',
      actions: 'Quick Actions',
      recharge: 'Recharge',
      withdraw: 'Withdraw',
      convert: 'Convert',
      hall: 'Trading Hall',
      sync: 'Synchronizing Data...',
      name: 'Name/Turnover',
      lastPrice: 'Last price',
      change: 'Change',
      balance: 'Available Balance',
      credit: 'Credit Score'
    },
    hi: {
      overview: 'बाजार अवलोकन',
      actions: 'त्वरित क्रियाएं',
      recharge: 'रिचार्ज',
      withdraw: 'निकासी',
      convert: 'बदलें',
      hall: 'ट्रेडिंग हॉल',
      sync: 'डेटा सिंक्रोनाइज़ हो रहा है...',
      name: 'नाम/टर्नओवर',
      lastPrice: 'अंतिम मूल्य',
      change: 'परिवर्तन',
      balance: 'उपलब्ध बैलेंस',
      credit: 'क्रेडिट स्कोर'
    }
  }[language];

  const loadPrices = async () => {
    const data = await fetchLivePrices();
    setCoins(data);
    setTickerData(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPrices();
    const interval = setInterval(loadPrices, 10000);
    return () => clearInterval(interval);
  }, []);

  const topCards = coins.slice(0, 3);

  return (
    <div className="pb-8">
      {/* Market Overview Section */}
      <section className="px-6 py-6 space-y-4">
        <h2 className="text-lg font-black text-slate-200 uppercase tracking-tight">{t.overview}</h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {topCards.length > 0 ? topCards.map(coin => (
            <button
              key={coin.id}
              onClick={() => onCoinSelect(coin)}
              className="min-w-[140px] flex-1 glass border border-white/5 p-4 rounded-3xl text-left transition-all active:scale-95 hover:bg-white/5 shadow-lg"
            >
              <p className="text-xs font-bold text-slate-400">{coin.symbol}/USDT</p>
              <p className={`text-xl font-mono font-black my-1 ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {coin.price.toFixed(coin.price < 1 ? 4 : 2)}
              </p>
              <div className={`flex items-center gap-1 text-[10px] font-black ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {coin.change24h >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {coin.change24h.toFixed(2)}%
              </div>
            </button>
          )) : (
            [1, 2, 3].map(i => <div key={i} className="min-w-[140px] h-28 bg-slate-900/50 animate-pulse rounded-3xl" />)
          )}
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="px-6 py-2 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <button 
            onClick={() => onQuickAction('recharge')}
            className="glass border border-white/5 rounded-3xl py-6 flex flex-col items-center gap-3 transition-all active:scale-95 group hover:bg-white/[0.06]"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wallet size={24} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.recharge}</span>
          </button>
          <button 
            onClick={() => onQuickAction('withdraw')}
            className="glass border border-white/5 rounded-3xl py-6 flex flex-col items-center gap-3 transition-all active:scale-95 group hover:bg-white/[0.06]"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Landmark size={24} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.withdraw}</span>
          </button>
          <button 
            onClick={() => onQuickAction('convert')}
            className="glass border border-white/5 rounded-3xl py-6 flex flex-col items-center gap-3 transition-all active:scale-95 group hover:bg-white/[0.06]"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Repeat size={24} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.convert}</span>
          </button>
        </div>
      </section>

      {/* Trading Hall Section */}
      <section className="px-6 pt-10 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-black text-slate-200 uppercase tracking-tight">{t.hall}</h2>
          
          {/* Centered Blinking LIVE indicator */}
          <div className="flex items-center justify-center gap-2 text-[10px] font-black text-rose-400 bg-rose-400/10 px-4 py-1.5 rounded-full border border-rose-400/20 shadow-[0_0_12px_rgba(244,63,94,0.15)]">
            <div className="w-2 h-2 rounded-full bg-rose-500 pulse-center shadow-[0_0_8px_#f43f5e] flex items-center justify-center">
               <div className="w-0.5 h-0.5 bg-white/60 rounded-full" />
            </div>
            <span className="tracking-[0.1em]">LIVE</span>
          </div>
        </div>

        <div className="glass-dark border border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl">
          <div className="grid grid-cols-[1fr_1fr_80px] px-6 py-4 border-b border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] bg-white/[0.02]">
            <span>{t.name}</span>
            <span className="text-right">{t.lastPrice}</span>
            <span className="text-right">{t.change}</span>
          </div>

          <div className="divide-y divide-white/5">
            {loading ? (
              <div className="p-10 text-center text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">{t.sync}</div>
            ) : (
              coins.map(coin => (
                <button
                  key={coin.id}
                  onClick={() => onCoinSelect(coin)}
                  className="w-full grid grid-cols-[1fr_1fr_80px] px-6 py-5 items-center hover:bg-white/5 transition-colors text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-800/50 rounded-2xl p-2 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                      <img src={coin.icon} className="w-full h-full object-contain" alt="" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-100 group-hover:text-cyan-400 transition-colors">{coin.symbol}/USDT</p>
                      <p className="text-[10px] text-slate-500 font-bold">${((coin.price * 1.5) / 1000).toFixed(2)}M</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-base font-mono font-black ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {coin.price.toFixed(coin.price < 1 ? 4 : 2)}
                    </p>
                    <p className="text-[9px] text-slate-500 font-bold tracking-tighter">${coin.price < 1000 ? coin.price.toFixed(2) : (coin.price/1000).toFixed(2) + 'K'}</p>
                  </div>

                  <div className="flex justify-end">
                    <div className={`px-2 py-2 rounded-xl text-[10px] font-black min-w-[60px] text-center border ${
                      coin.change24h >= 0 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                    }`}>
                      {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
