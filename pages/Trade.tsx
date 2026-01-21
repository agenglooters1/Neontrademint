
import React, { useState, useEffect, useRef } from 'react';
import { Coin, TradeRecord, ActiveTrade, User, Language } from '../types';
import { PROFIT_RATES } from '../constants';
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  Cell
} from 'recharts';
import { 
  ChevronLeft, 
  ChevronDown, 
  ClipboardList, 
  ArrowUp, 
  ArrowDown, 
  Trophy,
  AlertCircle,
  X,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Timer,
  Wallet
} from 'lucide-react';

interface TradeProps {
  coin: Coin;
  user: User | null;
  activeTrades: ActiveTrade[];
  onStartTrade: (trade: Omit<ActiveTrade, 'id' | 'remainingSeconds' | 'timestamp'>) => void;
  onBack: () => void;
  onShowHistory: () => void;
  language: Language;
  trades: TradeRecord[];
}

const timeframes = ['1M', '5M', '30M', '1H', '4H', '1D'];

const CandlestickShape = (props: any) => {
  const { x, y, width, height, fill, payload } = props;
  if (!payload) return null;
  const { open, close, high, low } = payload;

  const centerX = x + width / 2;
  const priceMove = Math.abs(open - close) || 0.001;
  const upperWickHeight = (high - Math.max(open, close)) / priceMove * height;
  const lowerWickHeight = (Math.min(open, close) - low) / priceMove * height;

  return (
    <g>
      <line
        x1={centerX}
        y1={y - upperWickHeight}
        x2={centerX}
        y2={y + height + lowerWickHeight}
        stroke={fill}
        strokeWidth={1}
      />
      <rect
        x={x}
        y={y}
        width={width}
        height={Math.max(height, 1)}
        fill={fill}
      />
    </g>
  );
};

const Trade: React.FC<TradeProps> = ({ coin, user, activeTrades, onStartTrade, onBack, onShowHistory, language, trades }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('5M');
  const [chartData, setChartData] = useState<any[]>([]);
  const [tradeHistory, setTradeHistory] = useState<any[]>([]);
  
  const [showOrderPanel, setShowOrderPanel] = useState(false);
  const [orderType, setOrderType] = useState<'Buy' | 'Sell'>('Buy');
  const [amountInINR, setAmountInINR] = useState<string>('1000');
  const [selectedInterval, setSelectedInterval] = useState(PROFIT_RATES[0]);
  
  const [tradeResult, setTradeResult] = useState<TradeRecord | null>(null);

  const displayBalance = user ? Math.max(0, user.balance) : 0;
  const currentActiveTrade = activeTrades.find(t => t.coinId === coin.id);
  const countdown = currentActiveTrade?.remainingSeconds || 0;
  const trading = !!currentActiveTrade;

  const t = {
    en: {
      engine: 'Execution Engine',
      order: 'Order Configuration',
      expiration: 'Expiration Cycle',
      margin: 'Margin',
      balance: 'Available',
      confirm: 'Confirm Transaction',
      executing: 'Executing Contract',
      left: 'SEC LEFT',
      win: 'Profit Settled',
      loss: 'Trade Closed',
      settled: 'Outcome Settled',
      buy: 'BUY',
      sell: 'SELL',
      time: 'TIME',
      action: 'ACTION',
      price: 'PRICE',
      lots: 'LOTS',
      outcome: 'Result Details',
      invested: 'Investment Amount',
      payout: 'Settle Amount',
      yield: 'Profit %',
      close: 'Continue',
      back: 'Back',
      loginRequired: 'Login required to trade',
      insufficient: 'Insufficient Balance. Please Recharge.'
    },
    hi: {
      engine: 'एग्जीक्यूशन इंजन',
      order: 'ऑर्डर कॉन्फ़िगरेशन',
      expiration: 'समाप्ति चक्र',
      margin: 'मार्जिन',
      balance: 'उपलब्ध',
      confirm: 'लेनदेन की पुष्टि करें',
      executing: 'निष्पादन हो रहा है',
      left: 'सेकंड शेष',
      win: 'लाभ तय',
      loss: 'ट्रेड बंद',
      settled: 'परिणाम तय',
      buy: 'खरीदें',
      sell: 'बेचें',
      time: 'समय',
      action: 'कार्रवाई',
      price: 'कीमत',
      lots: 'लॉट्स',
      outcome: 'परिणाम विवरण',
      invested: 'निवेश राशि',
      payout: 'निपटान राशि',
      yield: 'लाभ %',
      close: 'जारी रखें',
      back: 'पीछे',
      loginRequired: 'ट्रेड करने के लिए लॉगिन आवश्यक है',
      insufficient: 'अपर्याप्त बैलेंस। कृपया रिचार्ज करें।'
    }
  }[language];
  
  const chartIndexRef = useRef(60);
  const radius = 100;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (!trading && tradeResult === null) {
      const lastTrade = trades[0];
      if (lastTrade && lastTrade.coinId === coin.id && (Date.now() - lastTrade.timestamp < 3000)) {
        setTradeResult(lastTrade);
      }
    }
  }, [trading, trades, coin.id]);

  useEffect(() => {
    const basePrice = coin?.price || 93000;
    const initialPoints = 60; 

    const generateInitialData = () => {
      let prevClose = basePrice;
      return Array.from({ length: initialPoints }).map((_, i) => {
        const open = prevClose;
        const volatility = basePrice * 0.003;
        const close = open + (Math.random() - 0.5) * volatility;
        const high = Math.max(open, close) + Math.random() * (volatility * 0.4);
        const low = Math.min(open, close) - Math.random() * (volatility * 0.4);
        prevClose = close;
        
        return {
          time: i,
          open,
          close,
          high,
          low,
          bodyRange: [Math.min(open, close), Math.max(open, close)],
          color: close >= open ? '#10b981' : '#f43f5e',
          ma7: basePrice * (1 + (Math.sin(i / 8) * 0.004)),
          ma25: basePrice * (1 + (Math.cos(i / 15) * 0.003)),
        };
      });
    };

    setChartData(generateInitialData());

    const interval = setInterval(() => {
      setChartData(prev => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const open = last.close;
        const volatility = basePrice * 0.0012;
        const close = open + (Math.random() - 0.5) * volatility;
        const high = Math.max(open, close) + Math.random() * (volatility * 0.3);
        const low = Math.min(open, close) - Math.random() * (volatility * 0.3);
        
        chartIndexRef.current += 1;
        const newPoint = {
          time: chartIndexRef.current,
          open,
          close,
          high,
          low,
          bodyRange: [Math.min(open, close), Math.max(open, close)],
          color: close >= open ? '#10b981' : '#f43f5e',
          ma7: close * (1 + (Math.random() * 0.001 - 0.0005)),
          ma25: close * (1 + (Math.random() * 0.002 - 0.001)),
        };
        return [...prev.slice(1), newPoint];
      });
    }, 2000);

    const historyInterval = setInterval(() => {
      setTradeHistory(prev => [
        {
          time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
          direction: Math.random() > 0.4 ? 'Buy' : 'Sell',
          price: (coin.price + (Math.random() - 0.5) * 5).toFixed(2),
          quantity: (Math.random() * 0.05 + 0.0001).toFixed(4)
        },
        ...prev.slice(0, 14)
      ]);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearInterval(historyInterval);
    };
  }, [coin.id, coin.price]);

  const handleOpenOrder = (type: 'Buy' | 'Sell') => {
    if (!user) return alert(t.loginRequired);
    if (trading) return;
    setOrderType(type);
    setShowOrderPanel(true);
  };

  const executeTrade = () => {
    if (!user) return alert(t.loginRequired);
    const numAmountINR = parseFloat(amountInINR);
    if (isNaN(numAmountINR) || numAmountINR <= 0) return alert('Invalid amount');
    if (numAmountINR > user.balance) return alert(t.insufficient);

    setShowOrderPanel(false);
    onStartTrade({
      coinId: coin.id,
      coinSymbol: coin.symbol,
      amount: numAmountINR,
      duration: selectedInterval.seconds,
      type: orderType,
      profitRate: selectedInterval.rate
    });
  };

  const currentCandle = chartData[chartData.length - 1];

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-slate-100 font-sans relative pb-32">
      <header className="px-4 py-3 flex justify-between items-center bg-[#030712] border-b border-white/5 z-[40] sticky top-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-all active:scale-90"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-1">
            <span className="text-lg font-black uppercase tracking-tight">{coin.symbol}/USDT</span>
            <ChevronDown size={16} className="text-slate-500" />
          </div>
        </div>
        <button 
          onClick={onShowHistory}
          className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-all active:scale-90"
        >
          <ClipboardList size={20} />
        </button>
      </header>

      <div className="px-4 py-3 flex justify-between items-start bg-[#030712]">
        <div className="space-y-0.5">
          <h1 className="text-3xl font-mono font-black text-emerald-400 tracking-tighter">
            {coin.price.toFixed(coin.price < 1 ? 4 : 2)}
          </h1>
          <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
            {coin.change24h >= 0 ? <ArrowUp size={10} fill="currentColor" /> : <ArrowDown size={10} fill="currentColor" />}
            <span>{coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-x-5 gap-y-0.5 text-[9px] font-bold">
          <div className="flex justify-between gap-3 text-emerald-400/80">
            <span className="text-slate-500">H</span>
            <span className="font-mono">{(coin.price * 1.008).toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-3 text-rose-400/80">
            <span className="text-slate-500">L</span>
            <span className="font-mono">{(coin.price * 0.992).toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">V</span>
            <span className="text-slate-300">3.4M</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">T</span>
            <span className="text-slate-300">12.5M</span>
          </div>
        </div>
      </div>

      <div className="flex border-b border-white/5 bg-[#030712] overflow-x-auto no-scrollbar">
        {timeframes.map(tf => (
          <button
            key={tf}
            onClick={() => setSelectedTimeframe(tf)}
            className={`flex-1 py-3 text-[10px] font-black transition-all relative whitespace-nowrap text-center ${
              selectedTimeframe === tf ? 'text-cyan-400' : 'text-slate-500'
            }`}
          >
            {tf}
            {selectedTimeframe === tf && (
              <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            )}
          </button>
        ))}
      </div>

      <div className="h-[320px] w-full bg-[#030712] relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 15, right: 0, bottom: 0, left: 0 }} barGap={0} barCategoryGap="1%">
            <XAxis dataKey="time" hide padding={{ left: 0, right: 0 }} />
            <YAxis yAxisId="price" domain={[(dataMin: number) => dataMin * 0.9995, (dataMax: number) => dataMax * 1.0005]} hide allowDataOverflow={false}/>
            <Tooltip content={() => null} />
            <Bar yAxisId="price" dataKey="bodyRange" isAnimationActive={false} shape={<CandlestickShape />}>
              {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
            </Bar>
            <Line yAxisId="price" type="monotone" dataKey="ma7" stroke="#f59e0b" strokeWidth={1} dot={false} isAnimationActive={false} />
            <Line yAxisId="price" type="monotone" dataKey="ma25" stroke="#3b82f6" strokeWidth={1} dot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="absolute top-2 left-3 flex flex-wrap gap-x-3 gap-y-0.5 text-[9px] font-mono font-bold bg-[#030712]/40 p-1 rounded backdrop-blur-sm">
          <span className="text-slate-600">O <span className="text-slate-300">{currentCandle?.open.toFixed(2)}</span></span>
          <span className="text-slate-600">H <span className="text-emerald-500">{currentCandle?.high.toFixed(2)}</span></span>
          <span className="text-slate-600">L <span className="text-rose-500">{currentCandle?.low.toFixed(2)}</span></span>
          <span className="text-slate-600">C <span className="text-slate-300">{currentCandle?.close.toFixed(2)}</span></span>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center z-10">
            <div className="w-8 h-[0.5px] border-t border-dashed border-emerald-500/30" />
            <div className="bg-emerald-500 px-1.5 py-0.5 rounded-l text-[9px] font-mono font-black text-white shadow-lg">{coin.price.toFixed(2)}</div>
        </div>
      </div>

      <div className="flex-1 bg-[#0b1120]/30 border-t border-white/5 flex flex-col overflow-hidden">
        <div className="grid grid-cols-4 px-5 py-3 border-b border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest bg-[#030712]/50">
          <span>{t.time}</span>
          <span className="text-center">{t.action}</span>
          <span className="text-right">{t.price}</span>
          <span className="text-right">{t.lots}</span>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar max-h-60">
          {tradeHistory.map((h, i) => (
            <div key={i} className="grid grid-cols-4 px-5 py-2 text-[10px] font-mono font-bold border-b border-white/[0.02] items-center">
              <span className="text-slate-500">{h.time}</span>
              <span className={`text-center font-black ${h.direction === 'Buy' ? 'text-emerald-400' : 'text-rose-400'}`}>{language === 'hi' ? (h.direction === 'Buy' ? t.buy : t.sell) : h.direction}</span>
              <span className="text-right text-slate-100">{h.price}</span>
              <span className="text-right text-slate-300">{h.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-[96px] left-0 right-0 px-6 py-4 bg-[#030712]/95 backdrop-blur-md flex gap-4 z-[60] border-t border-white/5">
        <button 
          onClick={() => handleOpenOrder('Buy')} 
          disabled={trading}
          className={`flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-base py-5 rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 ${trading ? 'opacity-50 grayscale' : ''}`}
        >
          <ArrowUp size={18} strokeWidth={3} /> {t.buy}
        </button>
        <button 
          onClick={() => handleOpenOrder('Sell')} 
          disabled={trading}
          className={`flex-1 bg-rose-500 hover:bg-rose-400 text-white font-black text-base py-5 rounded-2xl shadow-xl shadow-rose-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 ${trading ? 'opacity-50 grayscale' : ''}`}
        >
          <ArrowDown size={18} strokeWidth={3} /> {t.sell}
        </button>
      </div>

      {showOrderPanel && (
        <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-2xl flex items-end animate-fade-in">
          <div className="w-full bg-[#0b1120] rounded-t-[3.5rem] p-8 space-y-8 border-t border-white/10 animate-scale-in pb-16">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${orderType === 'Buy' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                {t.order}
              </h3>
              <button onClick={() => setShowOrderPanel(false)} className="bg-white/5 p-2 rounded-full text-slate-400 font-bold hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{t.expiration}</label>
                <div className="grid grid-cols-4 gap-3">
                  {PROFIT_RATES.map((rate) => (
                    <button key={rate.label} onClick={() => setSelectedInterval(rate)} className={`flex flex-col items-center py-4 rounded-2xl border transition-all ${selectedInterval.label === rate.label ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-slate-900 border-white/5 text-slate-600'}`}>
                      <span className="text-sm font-black tracking-tighter">{rate.label}</span>
                      <span className="text-[9px] font-bold opacity-50">+{rate.rate * 100}%</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{t.margin}</label>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Wallet size={10} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">{t.balance}: ₹{displayBalance.toLocaleString()}</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 font-black text-lg">₹</div>
                  <input type="number" value={amountInINR} onChange={(e) => setAmountInINR(e.target.value)} className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-4 py-5 text-2xl font-mono font-black text-white focus:outline-none focus:border-cyan-500/30" placeholder="0" />
                  <button onClick={() => setAmountInINR(Math.floor(displayBalance).toString())} className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-cyan-500 bg-cyan-500/10 px-3 py-1.5 rounded-lg">MAX</button>
                </div>
              </div>
            </div>
            
            <button 
              onClick={executeTrade} 
              className={`w-full py-6 rounded-3xl font-black text-base uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all ${orderType === 'Buy' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-500 shadow-rose-500/20'}`}
            >
              {t.confirm}
            </button>
          </div>
        </div>
      )}

      {trading && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-2xl flex flex-col animate-fade-in">
          <header className="px-4 py-4 flex justify-between items-center z-[201]">
            <button 
              onClick={onBack}
              className="px-5 py-3 glass rounded-2xl text-slate-100 font-black text-xs uppercase tracking-widest flex items-center gap-2 active:scale-90 transition-all border border-white/10"
            >
              <ChevronLeft size={18} /> {t.back}
            </button>
          </header>
          
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="relative flex items-center justify-center mb-16">
              <svg 
                className="w-72 h-72 transform -rotate-90 filter drop-shadow-[0_0_35px_rgba(34,211,238,0.4)]"
                viewBox="0 0 224 224"
              >
                <circle 
                  cx="112" cy="112" r={radius} 
                  stroke="rgba(255,255,255,0.08)" 
                  strokeWidth="6" 
                  fill="transparent" 
                />
                <circle 
                  cx="112" cy="112" r={radius} 
                  stroke="url(#countdownGradient)" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={circumference * (1 - countdown / (currentActiveTrade?.duration || 1))} 
                  className="transition-all duration-1000 ease-linear"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="countdownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute text-center">
                <span className="block text-8xl font-mono font-black text-white tabular-nums tracking-tighter">
                  {countdown}
                </span>
                <span className="text-[12px] font-black text-cyan-400 uppercase tracking-[0.5em] mt-3 block opacity-80">{t.left}</span>
              </div>
            </div>
            
            <div className="glass-dark p-10 rounded-[4rem] border border-white/10 space-y-5 text-center w-full max-w-sm animate-scale-in shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 animate-pulse" />
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_15px_#22d3ee]" />
                <p className="text-[12px] font-black text-slate-300 uppercase tracking-[0.2em]">{t.executing}</p>
              </div>
              <p className="text-3xl font-black text-white tracking-tighter">{language === 'hi' ? (orderType === 'Buy' ? t.buy : t.sell) : orderType} {coin.symbol}/USDT</p>
              <div className="flex justify-center items-center gap-8 py-5 px-6 bg-white/5 rounded-[2rem] border border-white/5">
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{language === 'hi' ? 'मार्जिन' : 'Margin'}</p>
                  <p className="text-xl font-black text-emerald-400">₹{currentActiveTrade?.amount.toLocaleString()}</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{language === 'hi' ? 'समाप्ति' : 'Expires'}</p>
                  <p className="text-xl font-black text-cyan-400">{currentActiveTrade?.duration}s</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tradeResult && (
        <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-8 animate-fade-in">
          <div className={`w-full max-w-sm glass-dark rounded-[4rem] p-10 border-t-8 overflow-hidden relative shadow-[0_45px_100px_-15px_rgba(0,0,0,0.6)] ${
            tradeResult.status === 'Win' ? 'border-emerald-500' : 'border-rose-500'
          } animate-scale-in`}>
            
            <div className="absolute -top-20 -right-20 opacity-5 rotate-12">
               {tradeResult.status === 'Win' ? <Trophy size={200} /> : <AlertCircle size={200} />}
            </div>

            <div className="flex flex-col items-center text-center space-y-8 relative z-10">
              <div className={`p-8 rounded-[3rem] shadow-2xl ${
                tradeResult.status === 'Win' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {tradeResult.status === 'Win' ? <TrendingUp size={64} strokeWidth={2.5} /> : <TrendingDown size={64} strokeWidth={2.5} />}
              </div>

              <div className="space-y-3">
                <h2 className={`text-4xl font-black tracking-tighter ${tradeResult.status === 'Win' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {tradeResult.status === 'Win' ? t.win : t.loss}
                </h2>
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">{t.outcome}</p>
              </div>

              <div className="w-full space-y-8">
                <div className="space-y-2">
                  <div className={`text-6xl font-mono font-black tracking-tighter ${
                    tradeResult.status === 'Win' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {tradeResult.status === 'Win' ? '+' : ''}₹{tradeResult.profit.toFixed(0)}
                  </div>
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{t.yield}: {tradeResult.status === 'Win' ? `+${(tradeResult.profit / tradeResult.amount * 100).toFixed(0)}%` : '-100%'}</p>
                </div>

                <div className="grid grid-cols-2 gap-y-6 gap-x-10 px-4 py-8 border-y border-white/5">
                  <div className="text-left space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{t.invested}</p>
                    <p className="text-xl font-bold text-slate-100">₹{tradeResult.amount}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{t.payout}</p>
                    <p className="text-xl font-black text-white">₹{(tradeResult.amount + tradeResult.profit).toFixed(0)}</p>
                  </div>
                  <div className="text-left space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Symbol</p>
                    <p className="text-sm font-black text-slate-300">{coin.symbol}/USDT</p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Duration</p>
                    <p className="text-sm font-black text-slate-300">{tradeResult.duration}s</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setTradeResult(null)}
                className={`w-full py-6 rounded-[2.5rem] font-black text-base uppercase tracking-widest transition-all active:scale-95 shadow-2xl ${
                  tradeResult.status === 'Win' ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-slate-800'
                }`}
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trade;
