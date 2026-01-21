
import React from 'react';
import { Notification, Language } from '../types';
import { ChevronLeft, Bell, Calendar } from 'lucide-react';

interface NotificationPageProps {
  notifications: Notification[];
  language: Language;
  onBack: () => void;
}

const NotificationPage: React.FC<NotificationPageProps> = ({ notifications, language, onBack }) => {
  const t = {
    en: { title: 'User Messages', empty: 'No messages yet' },
    hi: { title: 'उपयोगकर्ता संदेश', empty: 'अभी तक कोई संदेश नहीं' }
  }[language];

  return (
    <div className="p-4 space-y-4">
      <header className="flex items-center gap-4 px-2 py-2">
        <button 
          onClick={onBack} 
          className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-slate-100">{t.title}</h2>
      </header>

      <div className="space-y-3 pb-20">
        {notifications.length > 0 ? (
          notifications.map(n => (
            <div key={n.id} className="p-5 glass rounded-2xl border-white/5 space-y-2 animate-fade-in">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                  <h4 className="font-bold text-slate-100">{n.title}</h4>
                </div>
                <span className="text-[9px] text-slate-500 flex items-center gap-1 font-mono">
                  <Calendar size={10} />
                  {new Date(n.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{n.content}</p>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
            <Bell size={48} className="opacity-20" />
            <p className="text-sm font-medium">{t.empty}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
