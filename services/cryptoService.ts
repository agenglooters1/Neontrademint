
import { Coin } from '../types';
import { SUPPORTED_COINS } from '../constants';

// Internal cache to keep the demo "live" even if the API fails
let priceCache: Record<string, { price: number; change: number }> = {};

/**
 * Generates a mock price based on the coin's symbol for initial state
 */
const getInitialPrice = (symbol: string): number => {
  const seeds: Record<string, number> = {
    BTC: 92000, ETH: 3100, SOL: 140, XRP: 0.6, DOGE: 0.12,
    ADA: 0.5, AVAX: 35, POL: 0.4, LINK: 18,
    SHIB: 0.00002, TRX: 0.12, LTC: 85, UNI: 7, NEAR: 5,
    XLM: 0.11, ATOM: 9, TON: 5, PEPE: 0.000009, XMR: 170
  };
  return seeds[symbol] || 10;
};

/**
 * Generates a dynamic 24h change percentage with flipping capability
 * Target: 50/50 ratio (Red/Green) with high fluidity for leaders like BTC
 */
const getDynamicChange = (currentChange?: number): number => {
  // If we have a current change, give it a significant chance (40%) to cross the zero line
  // This ensures "BTC can red and can green" frequently.
  const crossThreshold = Math.random() < 0.4;
  
  if (currentChange !== undefined) {
    if (crossThreshold) {
      // Flip the sign and add some range
      return (currentChange > 0 ? -1 : 1) * (Math.random() * 2 + 0.1);
    }
    // Small drift to maintain current trend
    const drift = (Math.random() * 0.8 - 0.4);
    return Math.max(-8, Math.min(8, currentChange + drift));
  }

  // Initial bias: 50% positive, 50% negative for balanced market view
  const isPositive = Math.random() < 0.5;
  if (isPositive) {
    return 0.1 + (Math.random() * 3.9); 
  } else {
    return -0.1 - (Math.random() * 3.9);
  }
};

export async function fetchLivePrices(): Promise<Coin[]> {
  const ids = SUPPORTED_COINS.map(c => c.id).join(',');
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`API Status: ${response.status}`);
    
    const data = await response.json();
    
    return SUPPORTED_COINS.map(coin => {
      const coinData = data[coin.id!];
      const cached = priceCache[coin.id!];
      
      let price = coinData?.usd ?? cached?.price ?? getInitialPrice(coin.symbol!);
      
      // Inject high-frequency jitter for "live" feel
      const jitter = price * (Math.random() * 0.001 - 0.0005);
      price += jitter;

      // Dynamic colors: coins flip red/green frequently to look "real"
      const change = getDynamicChange(cached?.change);
      
      priceCache[coin.id!] = { price, change };

      return {
        ...coin as Coin,
        price,
        change24h: change,
      };
    });
  } catch (error) {
    // Fallback simulation when API is unavailable
    return SUPPORTED_COINS.map(coin => {
      const cached = priceCache[coin.id!];
      let price = cached?.price || getInitialPrice(coin.symbol!);
      
      // High volatility movement for simulation
      const direction = Math.random() > 0.5 ? 1 : -1; 
      const tick = price * (Math.random() * 0.0012);
      price += direction * tick;

      const change = getDynamicChange(cached?.change);

      priceCache[coin.id!] = { price, change };

      return {
        ...coin as Coin,
        price,
        change24h: change,
      };
    });
  }
}
