
import { Coin } from './types';

export const SUPPORTED_COINS: Partial<Coin>[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', icon: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.png' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', icon: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png' },
  { id: 'tron', symbol: 'TRX', name: 'Tron', icon: 'https://cryptologos.cc/logos/tron-trx-logo.png' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', icon: 'https://cryptologos.cc/logos/cardano-ada-logo.png' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', icon: 'https://cryptologos.cc/logos/avalanche-avax-logo.png' },
  { id: 'matic-network', symbol: 'POL', name: 'Polygon', icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', icon: 'https://cryptologos.cc/logos/chainlink-link-logo.png' },
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', icon: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png' },
];

export const COUNTRIES = [
  { name: 'India', code: '+91', flag: '🇮🇳' },
  { name: 'USA', code: '+1', flag: '🇺🇸' },
  { name: 'UK', code: '+44', flag: '🇬🇧' },
];

export const PROFIT_RATES = [
  { label: '60s', rate: 0.5, seconds: 60 },
  { label: '120s', rate: 0.4, seconds: 120 },
  { label: '180s', rate: 0.3, seconds: 180 },
  { label: '5m', rate: 0.2, seconds: 300 },
];

export const USD_TO_INR = 83.50;
