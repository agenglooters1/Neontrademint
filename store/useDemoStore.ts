
import { useState, useEffect } from 'react';
import { User, TradeRecord, ActiveTrade, Transaction, TransactionStatus, AppState, Notification, Language } from '../types';

const STORAGE_KEY = 'neon_trade_live_state';
const USER_KEY = 'user';
const LOGGED_IN_KEY = 'loggedIn';

const initialState: AppState = {
  user: null,
  registeredUsers: [],
  invitationCodes: ['NEON2025', 'START77', 'VIP999'],
  trades: [],
  activeTrades: [],
  transactions: [],
  notifications: [
    {
      id: 'welcome',
      title: 'Welcome to NeonTrade',
      content: 'Welcome to the platform! To recharge your account and start trading, please contact your designated account manager.',
      timestamp: Date.now(),
      isRead: false
    }
  ],
  language: 'en'
};

export function useDemoStore() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const appState = saved ? JSON.parse(saved) : initialState;
    
    // Auth Persistence Logic
    const isLoggedIn = localStorage.getItem(LOGGED_IN_KEY) === 'true';
    const savedUserJson = localStorage.getItem(USER_KEY);
    
    if (isLoggedIn && savedUserJson) {
      const parsedUser = JSON.parse(savedUserJson);
      return { ...appState, user: parsedUser };
    }
    
    return { ...appState, user: null };
  });

  useEffect(() => {
    // Persist global state
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    
    // Sync the specific 'user' key if logged in
    if (state.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(state.user));
    }
  }, [state]);

  // Global Timer for Active Trades
  useEffect(() => {
    const timer = setInterval(() => {
      setState(prev => {
        if (prev.activeTrades.length === 0) return prev;

        const updatedActive = prev.activeTrades.map(t => ({
          ...t,
          remainingSeconds: Math.max(0, t.remainingSeconds - 1)
        }));

        const completed = updatedActive.filter(t => t.remainingSeconds === 0);
        const remaining = updatedActive.filter(t => t.remainingSeconds > 0);

        if (completed.length === 0) {
          return { ...prev, activeTrades: updatedActive };
        }

        let balanceAdjustment = 0;
        const newHistory: TradeRecord[] = [...prev.trades];

        completed.forEach(trade => {
          const win = trade.coinSymbol === 'BTC' && trade.type === 'Buy';
          let netProfit = win ? trade.amount * trade.profitRate : -trade.amount;
          let returnedToBalance = win ? trade.amount + netProfit : 0;
          
          balanceAdjustment += returnedToBalance;

          newHistory.unshift({
            id: trade.id,
            coinId: trade.coinId,
            coinSymbol: trade.coinSymbol,
            amount: trade.amount,
            duration: trade.duration,
            profit: netProfit,
            type: trade.type,
            timestamp: Date.now(),
            status: win ? 'Win' : 'Loss'
          });
        });

        const updatedBalance = Math.max(0, (prev.user?.balance || 0) + balanceAdjustment);
        const currentUser = prev.user ? { ...prev.user, balance: updatedBalance } : null;
        const updatedRegisteredUsers = prev.registeredUsers.map(u => 
          u.id === prev.user?.id ? { ...u, balance: updatedBalance } : u
        );

        return {
          ...prev,
          activeTrades: remaining,
          trades: newHistory,
          user: currentUser,
          registeredUsers: updatedRegisteredUsers
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const login = (mobile: string, password: string): boolean => {
    const cleanMobile = mobile.trim();
    const cleanPass = password.trim();
    
    const user = state.registeredUsers.find(u => String(u.mobile) === String(cleanMobile) && u.password === cleanPass);

    if (user) {
      localStorage.setItem(LOGGED_IN_KEY, 'true');
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      setState(prev => ({ ...prev, user }));
      return true;
    }

    return false;
  };

  const register = (mobile: string, password: string, invitationCode: string): { success: boolean, message: string } => {
    const cleanMobile = mobile.trim();
    const cleanPass = password.trim();

    // Check if invitation code is valid
    if (!state.invitationCodes.includes(invitationCode)) {
      return { success: false, message: 'Invalid invitation code' };
    }

    // Check if user already exists with this mobile number
    const existingUser = state.registeredUsers.find(u => String(u.mobile) === String(cleanMobile));
    if (existingUser) {
      return { success: false, message: 'This mobile number is already registered' };
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      mobile: cleanMobile,
      username: cleanMobile,
      password: cleanPass,
      balance: 0.0,
      frozenBalance: 0,
      creditScore: 100,
      vipLevel: 1,
      referralCode: invitationCode
    };

    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    localStorage.setItem(LOGGED_IN_KEY, 'true');

    setState(prev => ({
      ...prev,
      registeredUsers: [...prev.registeredUsers, newUser],
      user: newUser
    }));

    return { success: true, message: 'Registration successful' };
  };

  const logout = () => {
    localStorage.setItem(LOGGED_IN_KEY, 'false');
    setState(prev => ({ ...prev, user: null }));
  };

  const setLanguage = (language: Language) => {
    setState(prev => ({ ...prev, language }));
  };

  const startTrade = (trade: Omit<ActiveTrade, 'id' | 'remainingSeconds' | 'timestamp'>) => {
    const newTrade: ActiveTrade = {
      ...trade,
      id: Math.random().toString(36).substr(2, 9),
      remainingSeconds: trade.duration,
      timestamp: Date.now()
    };

    setState(prev => {
      const updatedBalance = Math.max(0, (prev.user?.balance || 0) - trade.amount);
      return {
        ...prev,
        activeTrades: [newTrade, ...prev.activeTrades],
        user: prev.user ? { ...prev.user, balance: updatedBalance } : null,
        registeredUsers: prev.registeredUsers.map(u => 
          u.id === prev.user?.id ? { ...u, balance: updatedBalance } : u
        )
      };
    });
  };

  const addNotification = (title: string, content: string) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content,
      timestamp: Date.now(),
      isRead: false
    };
    setState(prev => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications]
    }));
  };

  const generateInvitationCode = () => {
    const code = 'NT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setState(prev => ({
      ...prev,
      invitationCodes: [...prev.invitationCodes, code]
    }));
    return code;
  };

  const removeInvitationCode = (code: string) => {
    setState(prev => ({
      ...prev,
      invitationCodes: prev.invitationCodes.filter(c => c !== code)
    }));
  };

  const manualBalanceAdjustment = (userId: string, amount: number) => {
    setState(prev => {
      let adjustedUser: User | null = null;
      const updatedRegisteredUsers = prev.registeredUsers.map(u => {
        if (u.id === userId) {
          adjustedUser = { ...u, balance: Math.max(0, u.balance + amount) };
          return adjustedUser;
        }
        return u;
      });

      // Synchronize the 'user' localStorage key immediately for the simulation
      const savedUserJson = localStorage.getItem(USER_KEY);
      if (savedUserJson && adjustedUser) {
        const savedUser = JSON.parse(savedUserJson);
        if (savedUser.id === userId) {
          localStorage.setItem(USER_KEY, JSON.stringify(adjustedUser));
        }
      }

      const transactions = [...prev.transactions];
      if (amount !== 0) {
        transactions.unshift({
          id: 'admin-' + Math.random().toString(36).substr(2, 9),
          userId: userId,
          type: amount > 0 ? 'Recharge' : 'Withdraw',
          amount: Math.abs(amount),
          status: TransactionStatus.APPROVED,
          timestamp: Date.now(),
        });
      }

      const currentUser = prev.user && prev.user.id === userId 
        ? adjustedUser
        : prev.user;

      return {
        ...prev,
        registeredUsers: updatedRegisteredUsers,
        user: currentUser,
        transactions
      };
    });
  };

  const addTransaction = (transaction: Transaction) => {
    setState(prev => ({
      ...prev,
      transactions: [transaction, ...prev.transactions]
    }));
  };

  const updateTransactionStatus = (id: string, status: TransactionStatus) => {
    setState(prev => {
      const targetTx = prev.transactions.find(tx => tx.id === id);
      if (!targetTx || targetTx.status !== TransactionStatus.PENDING) return prev;
      
      const updatedTxs = prev.transactions.map(tx => tx.id === id ? { ...tx, status } : tx);
      const isApproval = status === TransactionStatus.APPROVED;
      
      let adjustedUser: User | null = null;
      const updatedRegisteredUsers = prev.registeredUsers.map(u => {
        if (u.id === targetTx.userId && isApproval) {
          const delta = targetTx.type === 'Recharge' ? targetTx.amount : -targetTx.amount;
          adjustedUser = { ...u, balance: Math.max(0, u.balance + delta) };
          return adjustedUser;
        }
        return u;
      });

      // Sync to 'user' key if the target user is the one stored there
      if (isApproval && adjustedUser) {
        const savedUserJson = localStorage.getItem(USER_KEY);
        if (savedUserJson) {
          const savedUser = JSON.parse(savedUserJson);
          if (savedUser.id === targetTx.userId) {
            localStorage.setItem(USER_KEY, JSON.stringify(adjustedUser));
          }
        }
      }

      const updatedUser = prev.user && prev.user.id === targetTx.userId && isApproval
        ? adjustedUser
        : prev.user;

      return {
        ...prev,
        transactions: updatedTxs,
        registeredUsers: updatedRegisteredUsers,
        user: updatedUser
      };
    });
  };

  const updateBankAccount = (account: User['bankAccount']) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, bankAccount: account } : null,
      registeredUsers: prev.registeredUsers.map(u => u.id === prev.user?.id ? { ...u, bankAccount: account } : u)
    }));
  };

  return {
    ...state,
    login,
    register,
    logout,
    setLanguage,
    startTrade,
    addNotification,
    generateInvitationCode,
    removeInvitationCode,
    manualBalanceAdjustment,
    addTransaction,
    updateTransactionStatus,
    updateBankAccount,
    allUsers: state.registeredUsers
  };
}
