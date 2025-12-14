import React, { useState } from 'react';
import { X, Mail, MessageCircle, Facebook, Copy, Check } from 'lucide-react';
import { TRANSLATIONS, Language } from '../utils/translations';
import { Property } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  property: Property;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, lang, property }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;
  
  const t = TRANSLATIONS[lang];
  
  // Dynamic URL generation for deep linking
  // This constructs a link like: https://your-website.com/?propertyId=123
  const shareUrl = `${window.location.origin}${window.location.pathname}?propertyId=${property.id}`;
  const shareText = `Check out ${property.title} on StayEase!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(property.title)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`);
  };

  const handleWhatsApp = () => {
    // Uses WhatsApp Web API with the dynamic link
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`);
  };

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-premium overflow-hidden relative">
        <div className="p-4 border-b flex items-center gap-4 relative">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition absolute left-4">
            <X size={20} />
          </button>
          <h2 className="text-lg font-bold w-full text-center">{t.shareTitle}</h2>
        </div>

        <div className="p-6 grid grid-cols-1 gap-4">
          <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
             <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img src={property.imageUrl} className="object-cover w-full h-full" alt="Thumbnail"/>
             </div>
             <div>
                <div className="font-bold text-gray-900 line-clamp-1">{property.title}</div>
                <div className="text-sm text-gray-500 mt-1">{property.type} • {property.rating} ★</div>
             </div>
          </div>
          
          <div className="h-px bg-gray-100 my-2"></div>

          <button 
            onClick={handleCopyLink}
            className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition w-full text-left group border border-transparent hover:border-gray-200"
          >
            <div className={`p-2 rounded-full ${copied ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-700'}`}>
               {copied ? <Check size={24} /> : <Copy size={24} />}
            </div>
            <span className="font-semibold text-gray-700">{copied ? 'Link Copied!' : t.copyLink}</span>
          </button>
          
          <button 
            onClick={handleEmail}
            className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition w-full text-left group border border-transparent hover:border-gray-200"
          >
            <div className="p-2 rounded-full bg-gray-100 text-gray-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
              <Mail size={24} />
            </div>
            <span className="font-semibold text-gray-700">{t.email}</span>
          </button>

          <button 
            onClick={handleWhatsApp}
            className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition w-full text-left group border border-transparent hover:border-gray-200"
          >
            <div className="p-2 rounded-full bg-green-50 text-green-600 group-hover:scale-110 transition">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </div>
            <span className="font-semibold text-gray-700">{t.whatsapp}</span>
          </button>

           <button 
             onClick={handleFacebook}
             className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition w-full text-left group border border-transparent hover:border-gray-200"
           >
            <div className="p-2 rounded-full bg-blue-50 text-blue-600 group-hover:scale-110 transition">
              <Facebook size={24} />
            </div>
            <span className="font-semibold text-gray-700">{t.facebook}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;