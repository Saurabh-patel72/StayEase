import React, { useState } from 'react';
import { X, Mail, Facebook, Apple, Loader2 } from 'lucide-react';
import { TRANSLATIONS, Language } from '../utils/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSuccess?: () => void; // Callback for when login is successful
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, lang, onSuccess }) => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const t = TRANSLATIONS[lang];

  if (!isOpen) return null;

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API Login
    setTimeout(() => {
      setIsLoading(false);
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-premium overflow-hidden relative border border-white/20">
        {/* Header */}
        <div className="p-4 border-b flex items-center relative bg-white">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition absolute left-4"
          >
            <X size={18} />
          </button>
          <div className="w-full text-center font-bold text-gray-800">{t.login} / {t.signup}</div>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">{t.welcome}</h2>

          <form onSubmit={handleContinue}>
            {/* Phone Input Group */}
            <div className="border border-gray-300 rounded-xl overflow-hidden mb-4 focus-within:ring-2 focus-within:ring-black focus-within:border-black transition shadow-sm">
              <div className="border-b border-gray-300 p-3 bg-gray-50/50">
                <label className="text-xs text-gray-500 block font-semibold uppercase tracking-wider">Country/Region</label>
                <select className="w-full outline-none bg-transparent font-medium text-gray-700 cursor-pointer">
                  <option value="+1">United States (+1)</option>
                  <option value="+91">India (+91)</option>
                  <option value="+44">United Kingdom (+44)</option>
                  <option value="+33">France (+33)</option>
                  <option value="+81">Japan (+81)</option>
                </select>
              </div>
              <div className="p-3 bg-white">
                <input 
                  type="tel" 
                  placeholder={t.phonePlaceholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full outline-none font-medium placeholder:text-gray-400 text-lg"
                  required
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
               We'll call or text you to confirm your number. Standard message and data rates apply.
            </p>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-rose-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : t.continue}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="h-[1px] bg-gray-200 flex-1"></div>
            <span className="text-xs text-gray-400 font-medium">{t.or}</span>
            <div className="h-[1px] bg-gray-200 flex-1"></div>
          </div>

          <div className="flex flex-col gap-3">
             <button className="flex items-center justify-between px-4 py-3 border border-gray-800 rounded-xl hover:bg-gray-50 transition relative font-semibold text-sm">
                <div className="absolute left-4"><Mail size={20} /></div>
                <div className="w-full text-center">{t.continueWithEmail}</div>
             </button>
             <button className="flex items-center justify-between px-4 py-3 border border-gray-800 rounded-xl hover:bg-gray-50 transition relative font-semibold text-sm">
                <div className="absolute left-4"><Facebook size={20} className="text-blue-600" /></div>
                <div className="w-full text-center">{t.continueWithFacebook}</div>
             </button>
             <button className="flex items-center justify-between px-4 py-3 border border-gray-800 rounded-xl hover:bg-gray-50 transition relative font-semibold text-sm">
                <div className="absolute left-4"><Apple size={20} /></div>
                <div className="w-full text-center">{t.continueWithApple}</div>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;