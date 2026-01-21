
import React from 'react';
import { Language } from '../types';
import { ChevronLeft, Globe, Languages, Check } from 'lucide-react';

interface SettingsPageProps {
  language: Language;
  onSetLanguage: (lang: Language) => void;
  onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ language, onSetLanguage, onBack }) => {
  const languages: { id: Language; label: string; desc: string }[] = [
    { id: 'en', label: 'English', desc: 'System language set to English' },
    { id: 'hi', label: 'हिन्दी (Hindi)', desc: 'सिस्टम भाषा हिन्दी पर सेट है' }
  ];

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center gap-4 px-2 py-2">
        <button 
          onClick={onBack} 
          className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-slate-100">{language === 'hi' ? 'सेटिंग्स' : 'Settings'}</h2>
      </header>

      <div className="space-y-4">
        <div className="px-2">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Globe size={12} /> Language Preference
          </h3>
        </div>

        <div className="glass rounded-3xl overflow-hidden border-white/5">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => onSetLanguage(lang.id)}
              className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all border-b border-white/5 last:border-0"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  language === lang.id ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'
                }`}>
                  <Languages size={20} />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-bold ${language === lang.id ? 'text-white' : 'text-slate-400'}`}>
                    {lang.label}
                  </p>
                  <p className="text-[10px] text-slate-500">{lang.desc}</p>
                </div>
              </div>
              {language === lang.id && (
                <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center text-white">
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
