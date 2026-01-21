
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  icon: string;
}

export interface User {
  id: string;
  mobile: string;
  username: string;
  password?: string;
  balance: number;
  frozenBalance: number;
  creditScore: number;
  vipLevel: number;
  referralCode?: string;
  bankAccount?: BankAccount;
}

export interface BankAccount {
  holderName: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
}

export enum TransactionStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'Recharge' | 'Withdraw';
  amount: number;
  status: TransactionStatus;
  timestamp: number;
}

export interface TradeRecord {
  id: string;
  coinId: string;
  coinSymbol: string;
  amount: number;
  duration: number;
  profit: number;
  type: 'Buy' | 'Sell';
  timestamp: number;
  status: 'Win' | 'Loss';
}

export interface ActiveTrade {
  id: string;
  coinId: string;
  coinSymbol: string;
  amount: number;
  duration: number;
  remainingSeconds: number;
  type: 'Buy' | 'Sell';
  timestamp: number;
  profitRate: number;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  isRead: boolean;
}

export type Language = 'en' | 'hi';

export interface AppState {
  user: User | null;
  registeredUsers: User[];
  invitationCodes: string[];
  trades: TradeRecord[];
  activeTrades: ActiveTrade[];
  transactions: Transaction[];
  notifications: Notification[];
  language: Language;
}
