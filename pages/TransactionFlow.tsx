
import React, { useState } from 'react';
import { Transaction, TransactionStatus, Language } from '../types';
import { ChevronLeft, Send, AlertTriangle, CheckCircle } from 'lucide-react';

interface TransactionFlowProps {
  type: 'Recharge' | 'Withdraw';
  onComplete: (amount: number) => void;
  onBack: () => void;
  balance: number;
  language: Language;
}

const TransactionFlow: React.FC<TransactionFlowProps> = ({ type, onComplete, onBack, balance, language }) => {
  const [amount, setAmount] = useState('');
  const isWithdraw = type === 'Withdraw';

  const t = {
    en: {
      funds: 'Funds',
      topup: 'Add capital to your account balance in INR.',
      withdrawDesc: 'Enter the amount you wish to withdraw (INR).',
      amountLabel: 'Amount (INR)',
      available: 'Available',
      guidelines: 'Guidelines',
      confirm: 'Confirm',
      minRecharge: 'Minimum recharge amount is ₹500',
      rechargeVerify: 'Recharge requests are typically verified within 5-15 minutes',
      adminVerify: 'Funds are credited only after manual administrative verification',
      support: 'Contact support if your balance is not updated within 30 minutes',
      proof: 'Screenshots of transaction proof are mandatory for approval',
      minWithdraw: 'Minimum withdrawal amount is ₹500',
      bankCheck: 'Ensure bank details are correct to avoid failure',
      processTime: 'Withdrawal processing time: 2-24 hours',
      fee: 'A processing fee may apply based on your VIP level'
    },
    hi: {
      funds: 'फंड',
      topup: 'अपने खाते के बैलेंस में ₹ (INR) जोड़ें।',
      withdrawDesc: 'वह राशि दर्ज करें जिसे आप निकालना चाहते हैं (₹)।',
      amountLabel: 'राशि (₹)',
      available: 'उपलब्ध',
      guidelines: 'दिशानिर्देश',
      confirm: 'पुष्टि करें',
      minRecharge: 'न्यूनतम रिचार्ज राशि ₹500 है',
      rechargeVerify: 'रिचार्ज अनुरोध आमतौर पर 5-15 मिनट के भीतर सत्यापित किए जाते हैं',
      adminVerify: 'प्रशासनिक सत्यापन के बाद ही फंड क्रेडिट किया जाता है',
      support: 'यदि 30 मिनट के भीतर आपका बैलेंस अपडेट नहीं होता है तो सहायता से संपर्क करें',
      proof: 'अनुमोदन के लिए लेनदेन के प्रमाण के स्क्रीनशॉट अनिवार्य हैं',
      minWithdraw: 'न्यूनतम निकासी राशि ₹500 है',
      bankCheck: 'विफलता से बचने के लिए सुनिश्चित करें कि बैंक विवरण सही हैं',
      processTime: 'निकासी प्रसंस्करण समय: 2-24 घंटे',
      fee: 'आपके VIP स्तर के आधार पर प्रसंस्करण शुल्क लागू हो सकता है'
    }
  }[language];

  const rechargePresets = [500, 1000, 2000, 5000, 10000, 20000, 50000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return alert('Invalid amount');
    if (isWithdraw && num > balance) return alert('Insufficient balance');

    onComplete(num);
    const successMsg = language === 'hi' 
      ? `₹${num.toLocaleString()} का ${type === 'Recharge' ? 'रिचार्ज' : 'निकासी'} अनुरोध समीक्षा के लिए सबमिट किया गया।`
      : `${type} request of ₹${num.toLocaleString()} submitted for review.`;
    alert(successMsg);
    onBack();
  };

  const getInstructions = () => {
    if (isWithdraw) {
      return [t.minWithdraw, t.bankCheck, t.processTime, t.fee];
    }
    return [t.minRecharge, t.rechargeVerify, t.adminVerify, t.support, t.proof];
  };

  const translatedType = language === 'hi' ? (isWithdraw ? 'निकासी' : 'रिचार्ज') : type;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack} 
          className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-all active:scale-90"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">{translatedType} {t.funds}</h2>
      </div>

      <div className="glass rounded-[2rem] p-6 space-y-6 border-white/5">
        <div className="flex flex-col items-center gap-2 text-center">
           <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${isWithdraw ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {isWithdraw ? <Send size={32} /> : <CheckCircle size={32} />}
           </div>
           <p className="text-sm font-medium text-slate-400">
             {isWithdraw ? t.withdrawDesc : t.topup}
           </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-end mb-1">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t.amountLabel}</label>
                 {isWithdraw && <span className="text-[10px] text-cyan-400">{t.available}: ₹{balance.toLocaleString()}</span>}
              </div>
              <div className="relative group">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-4 text-2xl font-mono font-black text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                />
              </div>

              {!isWithdraw && (
                <div className="grid grid-cols-4 gap-2">
                  {rechargePresets.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setAmount(p.toString())}
                      className="py-2.5 rounded-xl bg-slate-900 border border-white/5 text-[10px] font-black text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                    >
                      ₹{p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Transaction Guidelines */}
            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <AlertTriangle size={12} className="text-amber-500" />
                {t.guidelines}
              </h4>
              <div className="space-y-2">
                {getInstructions().map((inst, i) => (
                  <div key={i} className="flex gap-2 text-[10px] font-medium text-slate-400 leading-relaxed">
                    <span className="text-cyan-500">•</span>
                    <span>{inst}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all ${
                isWithdraw ? 'bg-purple-600 shadow-purple-500/20' : 'bg-emerald-600 shadow-emerald-500/20'
              }`}
            >
              {t.confirm} {translatedType}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionFlow;
