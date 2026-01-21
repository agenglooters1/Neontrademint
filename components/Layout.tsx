import React, { useState, useEffect, useRef } from 'react';
import { Home, LineChart, ClipboardList, User, Headphones, Wallet } from 'lucide-react';
import { Language, User as UserType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  title: string;
  tickerData?: any[];
  isHome?: boolean;
  language: Language;
  user?: UserType | null;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 80; 

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || 0);
        this.y = Math.random() * (canvas?.height || 0);
        this.size = Math.random() * 1.6 + 0.4;
        this.speedX = Math.random() * 0.25 - 0.125;
        this.speedY = Math.random() * 0.25 - 0.125;
        this.opacity = Math.random() * 0.35 + 0.05;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (canvas) {
          if (this.x > canvas.width) this.x = 0;
          else if (this.x < 0) this.x = canvas.width;
          if (this.y > canvas.height) this.y = 0;
          else if (this.y < 0) this.y = canvas.height;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(34, 211, 238, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const maxDistanceSq = 120 * 120; // Using squared distance for performance
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.03)';
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistanceSq) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => init();
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
      style={{ filter: 'blur(0.2px)' }}
    />
  );
};

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, title, tickerData = [], isHome = false, language, user }) => {
  const [rippleTab, setRippleTab] = useState<string | null>(null);

  const t = {
    en: { home: 'Home', trade: 'Trade', records: 'Records', profile: 'Me' },
    hi: { home: 'होम', trade: 'ट्रेड', records: 'रिकॉर्ड', profile: 'मेरी प्रोफाइल' }
  }[language];

  const tabs = [
    { id: 'home', icon: Home, label: t.home },
    { id: 'trade', icon: LineChart, label: t.trade },
    { id: 'records', icon: ClipboardList, label: t.records },
    { id: 'profile', icon: User, label: t.profile },
  ];

  const handleTabClick = (id: string) => {
    if (activeTab === id) return;
    setRippleTab(null);
    setTimeout(() => setRippleTab(id), 10);
    setActiveTab(id);
    setTimeout(() => setRippleTab(null), 500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-slate-100 pb-24 font-sans relative">
      {/* Background stays at z-0 */}
      <ParticleBackground />

      {/* Ticker at z-10 (standard flow) */}
      {isHome && (
        <div className="bg-[#0b1120] border-b border-white/5 py-1 overflow-hidden whitespace-nowrap z-10 relative">
          <div className="flex animate-[scroll_35s_linear_infinite] gap-8 px-4">
            {tickerData.length > 0 ? tickerData.map((coin, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] font-bold">
                <img src={coin.icon} className="w-3 h-3 grayscale opacity-70" alt="" />
                <span className="text-slate-400 uppercase">{coin.symbol}:{coin.price.toFixed(4)}</span>
                <span className={`px-1 rounded ${coin.change24h >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                </span>
              </div>
            )) : (
              <span className="text-[10px] text-slate-500">Connecting to global markets...</span>
            )}
            {tickerData.map((coin, i) => (
              <div key={`dup-${i}`} className="flex items-center gap-2 text-[10px] font-bold">
                <img src={coin.icon} className="w-3 h-3 grayscale opacity-70" alt="" />
                <span className="text-slate-400 uppercase">{coin.symbol}:{coin.price.toFixed(4)}</span>
                <span className={`px-1 rounded ${coin.change24h >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header at z-50 to stay on top of everything including Ticker */}
      <header className="px-6 py-4 flex justify-between items-center bg-[#030712]/70 border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black italic bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent tracking-tighter">NeonTrade</span>
        </div>
        
        {user && isHome ? (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <Wallet size={14} className="text-emerald-400" />
            <span className="text-sm font-black text-emerald-400 font-mono">₹{user.balance.toLocaleString()}</span>
          </div>
        ) : (
          <button className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 active:scale-95 transition-transform">
            <Headphones size={20} />
          </button>
        )}
      </header>

      {/* Content wrapper at z-20 */}
      <main key={activeTab} className="flex-1 overflow-x-hidden page-enter relative z-20">
        {children}
      </main>

      {/* Navigation at z-[100] (Topmost) */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-[#0b1120]/90 backdrop-blur-2xl border-t border-white/5 px-4 pt-3 pb-6">
        <div className="flex justify-around items-center max-w-lg mx-auto">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              className={`relative flex flex-col items-center justify-center min-w-[64px] p-2 rounded-2xl transition-all duration-200 outline-none ${
                activeTab === id ? 'text-white' : 'text-slate-500'
              } active:scale-90`}
            >
              {rippleTab === id && <div className="nav-ripple" />}
              
              <div className={`relative z-10 transition-transform duration-300 ${activeTab === id ? 'scale-110 -translate-y-0.5' : 'scale-100'}`}>
                <Icon size={24} strokeWidth={activeTab === id ? 2.5 : 2} />
              </div>
              <span className={`relative z-10 text-[9px] font-bold mt-1.5 transition-all duration-300 tracking-wide ${activeTab === id ? 'opacity-100' : 'opacity-60'}`}>
                {label}
              </span>
              {activeTab === id && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 active-indicator shadow-[0_0_12px_#22d3ee]" />
              )}
            </button>
          ))}
        </div>
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
};

export default Layout;
