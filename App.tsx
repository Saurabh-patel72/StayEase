import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import CategoryFilter from './components/CategoryFilter';
import ListingCard from './components/ListingCard';
import PropertyDetails from './components/PropertyDetails';
import SearchModal from './components/SearchModal';
import AuthModal from './components/AuthModal';
import HelpModal from './components/HelpModal';
import LanguageModal from './components/LanguageModal';
import { MOCK_PROPERTIES } from './mockData';
import { ViewState, Property } from './types';
import { Sparkles, XCircle, Search, Heart } from 'lucide-react';
import { Language, TRANSLATIONS } from './utils/translations';

const App: React.FC = () => {
  // Navigation State
  const [view, setView] = useState<ViewState>('HOME');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  
  // Modal State
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [aiSearchResults, setAiSearchResults] = useState<string[] | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [classicSearchFilters, setClassicSearchFilters] = useState<{location: string, guests: number} | null>(null);

  // Deep Linking Logic: Check URL on load and handle browser back/forward
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const propertyId = params.get('propertyId');
      
      if (propertyId) {
        setSelectedPropertyId(propertyId);
        setView('DETAILS');
      } else {
        setSelectedPropertyId(null);
        setView('HOME');
      }
    };

    // Check on initial load
    handleUrlChange();

    // Listen for browser navigation (back/forward)
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Derived Properties List
  // Returns:
  // 1. A flat list if filters are active (Search, Category, AI)
  // 2. A grouped object { StateName: Property[] } if no filters are active (Default Home)
  const displayData = useMemo(() => {
    let filtered = MOCK_PROPERTIES;
    const isFiltered = !!(aiSearchResults || classicSearchFilters || selectedCategory);

    // 1. AI Search Priority
    if (aiSearchResults) {
      filtered = filtered.filter(p => aiSearchResults.includes(p.id));
    }
    // 2. Classic Search Filters
    else if (classicSearchFilters) {
      filtered = filtered.filter(p => {
        const matchesLocation = p.location.toLowerCase().includes(classicSearchFilters.location.toLowerCase()) || 
                                p.title.toLowerCase().includes(classicSearchFilters.location.toLowerCase());
        const matchesGuests = p.capacity.guests >= classicSearchFilters.guests;
        return matchesLocation && matchesGuests;
      });
    }
    // 3. Category Filter
    else if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // If filtered, return array. If not filtered, return grouped object.
    if (isFiltered) {
      return { type: 'flat', data: filtered };
    } else {
      // Group by State
      const grouped: Record<string, Property[]> = {};
      filtered.forEach(p => {
        // Extract State from "City, State"
        const parts = p.location.split(', ');
        const state = parts.length > 1 ? parts[parts.length - 1] : 'Other';
        
        if (!grouped[state]) {
          grouped[state] = [];
        }
        grouped[state].push(p);
      });
      return { type: 'grouped', data: grouped };
    }
  }, [aiSearchResults, selectedCategory, classicSearchFilters]);

  // Handlers
  const handlePropertyClick = (id: string) => {
    setSelectedPropertyId(id);
    setView('DETAILS');
    window.scrollTo(0, 0);
    // Update URL without reloading page
    const newUrl = `${window.location.pathname}?propertyId=${id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const handleBackToHome = () => {
    setView('HOME');
    setSelectedPropertyId(null);
    // Clear URL query params
    window.history.pushState({ path: window.location.pathname }, '', window.location.pathname);
  };

  const handleLogoClick = () => {
    setView('HOME');
    setAiSearchResults(null);
    setAiSummary(null);
    setClassicSearchFilters(null);
    setSelectedCategory('');
    window.scrollTo(0, 0);
    // Clear URL query params
    window.history.pushState({ path: window.location.pathname }, '', window.location.pathname);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setAiSearchResults(null); 
    setAiSummary(null);
    setClassicSearchFilters(null);
    window.scrollTo(0, 0);
  };

  const handleAIResults = (ids: string[], summary: string) => {
    setAiSearchResults(ids);
    setAiSummary(summary);
    setClassicSearchFilters(null);
    setSelectedCategory(''); 
    setView('HOME');
    window.history.pushState({ path: window.location.pathname }, '', window.location.pathname);
  };

  const handleClassicSearch = (filters: { location: string; guests: number }) => {
    setClassicSearchFilters(filters);
    setAiSearchResults(null);
    setAiSummary(null);
    setSelectedCategory('');
    setView('HOME');
    window.history.pushState({ path: window.location.pathname }, '', window.location.pathname);
  };

  const clearFilters = () => {
    setAiSearchResults(null);
    setAiSummary(null);
    setClassicSearchFilters(null);
    setSelectedCategory('');
  };

  const renderContent = () => {
    if (view === 'DETAILS' && selectedPropertyId) {
      const property = MOCK_PROPERTIES.find(p => p.id === selectedPropertyId);
      if (property) {
        return <PropertyDetails property={property} onBack={handleBackToHome} lang={currentLanguage} />;
      }
    }

    // HOME VIEW
    return (
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onSelectCategory={handleCategorySelect} 
        />
        
        {/* Active Filter Banners */}
        {aiSummary && (
          <div className="my-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <Sparkles className="text-rose-500 w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-rose-700 mb-1">StayEase Genius Found Matches</h3>
              <p className="text-gray-700 text-sm">{aiSummary}</p>
            </div>
            <button onClick={clearFilters} className="text-gray-400 hover:text-gray-700">
              <XCircle size={20} />
            </button>
          </div>
        )}

        {classicSearchFilters && (
          <div className="my-6 p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full shadow-sm">
                <Search className="text-black w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Searching for '{classicSearchFilters.location}'</h3>
                <p className="text-gray-500 text-xs">{classicSearchFilters.guests} {TRANSLATIONS[currentLanguage].guests}</p>
              </div>
            </div>
            <button onClick={clearFilters} className="text-gray-400 hover:text-gray-700">
              <XCircle size={20} />
            </button>
          </div>
        )}

        {/* Display Logic */}
        {displayData.type === 'flat' ? (
          /* FLAT GRID VIEW (For Filtered Results) */
          <>
            {(displayData.data as Property[]).length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">🤔</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No exact matches found</h2>
                <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
                <button 
                  onClick={clearFilters}
                  className="px-6 py-2 border border-black rounded-lg hover:bg-gray-50 transition"
                >
                  Clear all filters
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 pt-4 pb-20">
              {(displayData.data as Property[]).map((property) => (
                <ListingCard 
                  key={property.id} 
                  data={property} 
                  onClick={handlePropertyClick}
                />
              ))}
            </div>
          </>
        ) : (
          /* GROUPED SECTION VIEW (Default Home) */
          <div className="pb-20 space-y-12 pt-4">
            {Object.entries(displayData.data as Record<string, Property[]>).map(([state, properties]) => (
              <section key={state}>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-8 bg-royal rounded-full inline-block"></span>
                  Stays in {state}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                  {properties.map((property) => (
                    <ListingCard 
                      key={property.id} 
                      data={property} 
                      onClick={handlePropertyClick}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="font-sans text-neutral-800">
      <Navbar 
        onLogoClick={handleLogoClick} 
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onLoginClick={() => { setIsAuthModalOpen(true); }}
        onSignupClick={() => { setIsAuthModalOpen(true); }}
        onHelpClick={() => setIsHelpModalOpen(true)}
        onLanguageClick={() => setIsLanguageModalOpen(true)}
        lang={currentLanguage}
      />
      
      <main>
        {renderContent()}
      </main>

      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)}
        onAIResults={handleAIResults}
        onClassicSearch={handleClassicSearch}
        lang={currentLanguage}
      />

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        lang={currentLanguage}
      />

      <HelpModal 
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
      />
      
      {/* Footer simple for aesthetics */}
      <footer className="fixed bottom-0 w-full bg-white border-t border-gray-200 py-3 px-4 md:px-20 text-xs text-gray-500 hidden md:flex justify-between z-40">
        <div className="flex items-center gap-2">
          <span>© 2025 StayEase</span>
          <Heart size={14} className="fill-primary text-primary" />
          <span>·</span>
          <span>Privacy</span>
          <span>·</span>
          <span>Terms</span>
        </div>
        <div className="flex gap-4 font-semibold text-black">
          <span>$ USD</span>
          <span>{currentLanguage === 'en' ? 'English (US)' : currentLanguage.toUpperCase()}</span>
        </div>
      </footer>
    </div>
  );
};

export default App;