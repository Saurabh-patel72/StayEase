import React from 'react';
import { X, Check } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

const languages: { code: Language; label: string; region: string }[] = [
  { code: 'en', label: 'English', region: 'United States' },
  { code: 'hi', label: 'Hindi', region: 'India' },
  { code: 'es', label: 'Español', region: 'España' },
  { code: 'fr', label: 'Français', region: 'France' },
  { code: 'ja', label: '日本語', region: '日本' },
];

const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose, currentLanguage, onSelectLanguage }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[85vh]">
        <div className="p-4 border-b flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
          <h2 className="text-lg font-bold">{TRANSLATIONS[currentLanguage].selectRegion}</h2>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Suggested languages</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`text-left p-3 rounded-lg hover:bg-gray-100 transition flex justify-between items-center ${currentLanguage === lang.code ? 'bg-gray-100 ring-1 ring-black' : ''}`}
              >
                <div>
                  <div className="font-medium">{lang.label}</div>
                  <div className="text-sm text-gray-500">{lang.region}</div>
                </div>
                {currentLanguage === lang.code && <Check size={18} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;