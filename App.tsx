
import React, { useState } from 'react';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import AdminAuth from './pages/AdminAuth';
import Home from './pages/Home';
import Trade from './pages/Trade';
import Records from './pages/Records';
import Profile from './pages/Profile';
import BankPage from './pages/BankPage';
import TransactionFlow from './pages/TransactionFlow';
import OrderRecord from './pages/OrderRecord';
import Admin from './pages/Admin';
import NotificationPage from './pages/NotificationPage';
import SettingsPage from './pages/SettingsPage';
import { useDemoStore } from './store/useDemoStore';
import { Coin, Transaction, TransactionStatus } from './types';

const ADMIN_CREDS = { user: 'chinasystem', pass: 'jingping@12koplar#12' };

const App: React.FC = () => {
  const store = useDemoStore();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [subPage, setSubPage] = useState<string | null>(null);
  const [isAdminPortal, setIsAdminPortal] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [tickerData, setTickerData] = useState<Coin[]>([]);

  const handleAdminLogin = (user: string, pass: string) => {
    if (user === ADMIN_CREDS.user && pass === ADMIN_CREDS.pass) {
      setIsAdminLoggedIn(true);
      setSubPage('admin');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setIsAdminPortal(false);
    setSubPage(null);
  };

  if (isAdminPortal && !isAdminLoggedIn) {
    return <AdminAuth onAdminLogin={handleAdminLogin} onBack={() => setIsAdminPortal(false)} />;
  }

  if (!store.user && !isAdminLoggedIn) {
    return (
      <Auth 
        onLogin={store.login} 
        onRegister={store.register} 
        onAdminAccess={() => setIsAdminPortal(true)} 
      />
    );
  }

  const handleCoinSelect = (coin: Coin) => {
    setSelectedCoin(coin);
    setActiveTab('trade');
    setSubPage(null);
  };

  const handleQuickAction = (action: string) => {
    if (action === 'recharge' || action === 'withdraw') {
      setSubPage(action);
    } else if (action === 'convert') {
      const message = store.language === 'hi' ? 'कन्वर्ट सुविधा: जल्द आ रहा है!' : 'Currency Convert Feature: Coming Soon!';
      alert(message);
    } else {
      setActiveTab('trade');
      setSubPage(null);
    }
  };

  const handleRecharge = (amount: number) => {
    if (!store.user) return;
    const tx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: store.user.id,
      type: 'Recharge',
      amount,
      status: TransactionStatus.PENDING,
      timestamp: Date.now(),
    };
    store.addTransaction(tx);
  };

  const handleWithdraw = (amount: number) => {
    if (!store.user) return;
    const tx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: store.user.id,
      type: 'Withdraw',
      amount,
      status: TransactionStatus.PENDING,
      timestamp: Date.now(),
    };
    store.addTransaction(tx);
  };

  const renderContent = () => {
    if (subPage === 'bank') return <BankPage currentAccount={store.user?.bankAccount} onSave={store.updateBankAccount} onBack={() => setSubPage(null)} />;
    if (subPage === 'recharge') return <TransactionFlow type="Recharge" onComplete={handleRecharge} onBack={() => setSubPage(null)} balance={store.user?.balance || 0} language={store.language} />;
    if (subPage === 'withdraw') return <TransactionFlow type="Withdraw" onComplete={handleWithdraw} onBack={() => setSubPage(null)} balance={store.user?.balance || 0} language={store.language} />;
    if (subPage === 'notifications') return <NotificationPage notifications={store.notifications} language={store.language} onBack={() => setSubPage(null)} />;
    if (subPage === 'settings') return <SettingsPage language={store.language} onSetLanguage={store.setLanguage} onBack={() => setSubPage(null)} />;
    if (subPage === 'admin') return (
      <Admin 
        users={store.allUsers} 
        transactions={store.transactions} 
        invitationCodes={store.invitationCodes}
        onUpdateStatus={store.updateTransactionStatus} 
        onAdjustBalance={store.manualBalanceAdjustment}
        onSendNotification={store.addNotification}
        onGenerateCode={store.generateInvitationCode}
        onRemoveCode={store.removeInvitationCode}
        onBack={handleAdminLogout} 
      />
    );

    switch (activeTab) {
      case 'home':
        return <Home onCoinSelect={handleCoinSelect} onQuickAction={handleQuickAction} setTickerData={setTickerData} language={store.language} user={store.user} />;
      case 'trade':
        return selectedCoin 
          ? <Trade 
              coin={selectedCoin} 
              user={store.user} 
              activeTrades={store.activeTrades}
              onStartTrade={store.startTrade}
              onBack={() => setSelectedCoin(null)} 
              onShowHistory={() => setSelectedCoin(null)}
              language={store.language}
              trades={store.trades}
            /> 
          : <OrderRecord trades={store.trades} activeTrades={store.activeTrades} onBack={() => setActiveTab('home')} language={store.language} />;
      case 'records':
        return <Records transactions={store.transactions} onBack={() => setActiveTab('home')} language={store.language} />;
      case 'profile':
        return <Profile user={store.user} language={store.language} onLogout={store.logout} onNavigate={setSubPage} />;
      default:
        return <Home onCoinSelect={handleCoinSelect} onQuickAction={handleQuickAction} setTickerData={setTickerData} language={store.language} user={store.user} />;
    }
  };

  const getTitle = () => {
    const lang = store.language;
    if (subPage) {
        if (lang === 'hi') {
            const hiTitles: Record<string, string> = { bank: 'बैंक विवरण', recharge: 'रिचार्ज', withdraw: 'निकासी', notifications: 'संदेश', settings: 'सेटिंग्स', admin: 'प्रशासन' };
            return hiTitles[subPage] || 'नियॉनट्रेड';
        }
        return subPage.charAt(0).toUpperCase() + subPage.slice(1);
    }
    const titles: Record<string, Record<string, string>> = {
      en: { home: 'NeonTrade Markets', trade: selectedCoin ? 'Execution Engine' : 'Order Record', records: 'Financial Records', profile: 'Account Center' },
      hi: { home: 'नियॉनट्रेड बाजार', trade: selectedCoin ? 'एग्जीक्यूशन इंजन' : 'ऑर्डर रिकॉर्ड', records: 'वित्तीय रिकॉर्ड', profile: 'खाता केंद्र' }
    };
    return titles[lang][activeTab] || 'NeonTrade';
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={(tab) => {
        setActiveTab(tab);
        setSubPage(null);
        if (tab !== 'trade') setSelectedCoin(null);
      }}
      title={getTitle()}
      tickerData={tickerData}
      isHome={activeTab === 'home' && !subPage}
      language={store.language}
      user={store.user}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
