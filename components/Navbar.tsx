import React, { useState, useRef, useEffect } from 'react';
import { Search, Globe, Menu, UserCircle, MapPin } from 'lucide-react';
import { TRANSLATIONS, Language } from '../utils/translations';

interface NavbarProps {
  onLogoClick: () => void;
  onOpenSearch: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onHelpClick: () => void;
  onLanguageClick: () => void;
  lang: Language;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onLogoClick, 
  onOpenSearch, 
  onLoginClick, 
  onSignupClick, 
  onHelpClick,
  onLanguageClick,
  lang
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 w-full bg-white z-50 border-b border-gray-200 h-20">
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 h-full">
        <div className="flex flex-row items-center justify-between gap-3 md:gap-0 h-full">
          {/* Logo */}
          <div 
            className="cursor-pointer flex items-center gap-2" 
            onClick={onLogoClick}
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <MapPin className="text-white w-5 h-5" />
            </div>
            <span className="text-primary font-bold text-xl hidden md:block tracking-tighter">
              StayEase
            </span>
          </div>

          {/* Search Bar - Triggers Search Modal */}
          <div 
            onClick={onOpenSearch}
            className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <div className="flex flex-row items-center justify-between">
              <div className="text-sm font-semibold px-6 hover:bg-gray-100 rounded-full h-full flex items-center">
                {t.anywhere}
              </div>
              <div className="hidden sm:flex text-sm font-semibold px-6 border-x-[1px] flex-1 text-center hover:bg-gray-100 h-full items-center">
                {t.anyWeek}
              </div>
              <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3 hover:bg-gray-100 rounded-full">
                <div className="hidden sm:block">{t.addGuests}</div>
                <div className="p-2 bg-primary rounded-full text-white">
                  <Search size={15} />
                </div>
              </div>
            </div>
          </div>

          {/* User Menu */}
          <div className="relative flex flex-row items-center gap-4 text-gray-500">
            <div className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-gray-100 transition cursor-pointer">
              {t.yourHome}
            </div>
            <div 
              onClick={onLanguageClick}
              className="hidden md:block hover:bg-gray-100 rounded-full p-3 cursor-pointer transition"
            >
              <Globe size={18} />
            </div>
            
            {/* Dropdown Trigger */}
            <div 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition bg-white"
            >
              <Menu size={18} />
              <div className="hidden md:block">
                <UserCircle size={28} className="text-gray-500" />
              </div>
            </div>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div ref={menuRef} className="absolute rounded-xl shadow-md w-[200px] bg-white overflow-hidden right-0 top-12 text-sm border border-neutral-100 z-50 animate-in fade-in zoom-in duration-100 origin-top-right">
                <div className="flex flex-col cursor-pointer">
                  <div 
                    onClick={() => { onSignupClick(); setIsMenuOpen(false); }}
                    className="px-4 py-3 hover:bg-neutral-100 font-semibold text-black transition"
                  >
                    {t.signup}
                  </div>
                  <div 
                    onClick={() => { onLoginClick(); setIsMenuOpen(false); }}
                    className="px-4 py-3 hover:bg-neutral-100 text-black transition"
                  >
                    {t.login}
                  </div>
                  <hr />
                  <div className="px-4 py-3 hover:bg-neutral-100 transition">{t.yourHome}</div>
                  <div 
                    onClick={() => { onHelpClick(); setIsMenuOpen(false); }}
                    className="px-4 py-3 hover:bg-neutral-100 transition"
                  >
                    {t.helpCenter}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;