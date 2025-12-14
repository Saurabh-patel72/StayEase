import React, { useState } from 'react';
import { X, Sparkles, Send, Loader2, MapPin, Calendar, Search, Minus, Plus } from 'lucide-react';
import { searchPropertiesWithAI } from '../services/geminiService';
import { TRANSLATIONS, Language } from '../utils/translations';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAIResults: (ids: string[], summary: string) => void;
  onClassicSearch: (filters: { location: string; guests: number }) => void;
  lang: Language;
}

const regions = [
  "I'm flexible", "United States", "Italy", "France", "Japan", "Brazil", "India"
];

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onAIResults, onClassicSearch, lang }) => {
  const [activeTab, setActiveTab] = useState<'AI' | 'CLASSIC'>('AI');
  const [activeStep, setActiveStep] = useState<'LOCATION' | 'DATES' | 'GUESTS'>('LOCATION');
  const t = TRANSLATIONS[lang];

  // AI State
  const [query, setQuery] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);

  // Classic State
  const [location, setLocation] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);

  // Mock Calendar Data
  const [currentMonth, setCurrentMonth] = useState('November 2024');

  if (!isOpen) return null;

  const handleAISearch = async () => {
    if (!query.trim()) return;
    setIsAILoading(true);
    const result = await searchPropertiesWithAI(query);
    setIsAILoading(false);
    onAIResults(result.recommendedPropertyIds, result.summary);
    onClose();
  };

  const handleClassicSearch = () => {
    onClassicSearch({ location, guests: adults + children });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start pt-4 justify-center bg-gray-100/50 backdrop-blur-sm px-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header Tabs */}
        <div className="flex justify-center pt-6 pb-4 relative">
          <div className="flex bg-gray-100 p-1 rounded-full">
            <button 
              onClick={() => setActiveTab('AI')}
              className={`px-6 py-2 rounded-full font-semibold text-sm transition ${activeTab === 'AI' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
            >
              StayEase Genius
            </button>
            <button 
               onClick={() => setActiveTab('CLASSIC')}
               className={`px-6 py-2 rounded-full font-semibold text-sm transition ${activeTab === 'CLASSIC' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
            >
              Classic Search
            </button>
          </div>
          <button onClick={onClose} className="absolute right-6 top-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
             <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {activeTab === 'AI' ? (
             <div className="animate-in slide-in-from-bottom-4 duration-300 mt-4">
                <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl p-8 text-white mb-6 shadow-lg">
                   <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="text-yellow-300" />
                      <h2 className="text-2xl font-bold">Genius Search</h2>
                   </div>
                   <p className="text-white/90">Tell us your dream...</p>
                   
                   <div className="relative mt-6">
                    <textarea
                      className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 pr-14 text-white placeholder:text-white/50 text-lg focus:outline-none focus:bg-white/20 transition resize-none h-32"
                      placeholder="e.g., A romantic cabin in Kyoto with a private onsen..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <button 
                      onClick={handleAISearch}
                      className="absolute bottom-4 right-4 bg-white text-rose-600 p-3 rounded-full hover:scale-105 transition shadow-lg disabled:opacity-50"
                      disabled={isAILoading || !query.trim()}
                    >
                       {isAILoading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                    </button>
                   </div>
                </div>
             </div>
          ) : (
             <div className="animate-in slide-in-from-bottom-4 duration-300">
               {/* Search Bar Steps */}
               <div className="bg-gray-100 rounded-full p-1 flex shadow-inner mb-8">
                  <div 
                    onClick={() => setActiveStep('LOCATION')}
                    className={`flex-1 px-6 py-3 rounded-full cursor-pointer transition relative group ${activeStep === 'LOCATION' ? 'bg-white shadow-md' : 'hover:bg-gray-200'}`}
                  >
                     <div className="text-xs font-bold text-gray-800">{t.searchWhere}</div>
                     <input 
                       value={location}
                       onChange={(e) => setLocation(e.target.value)}
                       placeholder={t.searchDestinations}
                       className="w-full bg-transparent outline-none text-sm text-gray-600 truncate"
                     />
                  </div>
                  <div className="w-[1px] bg-gray-300 my-2"></div>
                  <div 
                    onClick={() => setActiveStep('DATES')}
                    className={`flex-1 px-6 py-3 rounded-full cursor-pointer transition ${activeStep === 'DATES' ? 'bg-white shadow-md' : 'hover:bg-gray-200'}`}
                  >
                     <div className="text-xs font-bold text-gray-800">{t.checkIn}</div>
                     <div className="text-sm text-gray-400 truncate">{t.addGuests}</div>
                  </div>
                  <div className="w-[1px] bg-gray-300 my-2"></div>
                  <div 
                     onClick={() => setActiveStep('DATES')}
                     className={`flex-1 px-6 py-3 rounded-full cursor-pointer transition ${activeStep === 'DATES' ? 'bg-white shadow-md' : 'hover:bg-gray-200'}`}
                  >
                     <div className="text-xs font-bold text-gray-800">{t.checkOut}</div>
                     <div className="text-sm text-gray-400 truncate">{t.addGuests}</div>
                  </div>
                  <div className="w-[1px] bg-gray-300 my-2"></div>
                  <div 
                     onClick={() => setActiveStep('GUESTS')}
                     className={`flex-[1.3] pl-6 pr-2 py-2 rounded-full cursor-pointer transition flex justify-between items-center ${activeStep === 'GUESTS' ? 'bg-white shadow-md' : 'hover:bg-gray-200'}`}
                  >
                     <div>
                       <div className="text-xs font-bold text-gray-800">{t.searchWho}</div>
                       <div className="text-sm text-gray-400 truncate">
                         {adults + children > 0 ? `${adults + children} ${t.guests}` : t.addGuests}
                       </div>
                     </div>
                     <button 
                       onClick={handleClassicSearch}
                       className="bg-primary hover:bg-primary-hover text-white p-3 rounded-full shadow-md transition flex items-center gap-2"
                     >
                        <Search size={18} />
                        {activeStep === 'GUESTS' ? 'Search' : ''}
                     </button>
                  </div>
               </div>

               {/* Expanded Content Area */}
               <div className="min-h-[300px] bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                  {activeStep === 'LOCATION' && (
                    <div className="animate-in fade-in">
                      <h3 className="font-semibold text-gray-700 mb-4">{t.selectRegion}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {regions.map(r => (
                          <button 
                            key={r} 
                            onClick={() => setLocation(r === "I'm flexible" ? "Anywhere" : r)}
                            className="border hover:border-black rounded-xl p-4 flex items-center gap-3 transition text-left"
                          >
                            <MapPin className="text-gray-400" />
                            <span className="font-medium">{r}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeStep === 'DATES' && (
                     <div className="animate-in fade-in flex flex-col items-center">
                       <div className="flex justify-between w-full max-w-md mb-4 font-bold text-lg">
                          <button onClick={() => setCurrentMonth("October 2024")}>&lt;</button>
                          <span>{currentMonth}</span>
                          <button onClick={() => setCurrentMonth("December 2024")}>&gt;</button>
                       </div>
                       <div className="grid grid-cols-7 gap-2 w-full max-w-md text-center">
                          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="text-xs text-gray-500">{d}</div>)}
                          {Array.from({length: 30}).map((_, i) => (
                             <button key={i} className="aspect-square rounded-full hover:bg-black hover:text-white transition font-medium text-sm">
                               {i + 1}
                             </button>
                          ))}
                       </div>
                     </div>
                  )}

                  {activeStep === 'GUESTS' && (
                     <div className="animate-in fade-in max-w-md mx-auto space-y-6">
                        {/* Adults */}
                        <div className="flex justify-between items-center border-b pb-4">
                           <div>
                              <div className="font-bold">{t.adults}</div>
                              <div className="text-sm text-gray-500">{t.ages13}</div>
                           </div>
                           <div className="flex items-center gap-3">
                              <button onClick={() => setAdults(Math.max(1, adults - 1))} disabled={adults <= 1} className="p-2 border rounded-full hover:border-black disabled:opacity-20"><Minus size={16}/></button>
                              <span className="w-4 text-center">{adults}</span>
                              <button onClick={() => setAdults(adults + 1)} className="p-2 border rounded-full hover:border-black"><Plus size={16}/></button>
                           </div>
                        </div>
                        {/* Children */}
                         <div className="flex justify-between items-center border-b pb-4">
                           <div>
                              <div className="font-bold">{t.children}</div>
                              <div className="text-sm text-gray-500">{t.ages212}</div>
                           </div>
                           <div className="flex items-center gap-3">
                              <button onClick={() => setChildren(Math.max(0, children - 1))} disabled={children <= 0} className="p-2 border rounded-full hover:border-black disabled:opacity-20"><Minus size={16}/></button>
                              <span className="w-4 text-center">{children}</span>
                              <button onClick={() => setChildren(children + 1)} className="p-2 border rounded-full hover:border-black"><Plus size={16}/></button>
                           </div>
                        </div>
                        {/* Pets */}
                        <div className="flex justify-between items-center">
                           <div>
                              <div className="font-bold">{t.pets}</div>
                              <div className="text-sm text-gray-500 underline cursor-pointer">{t.bringingServiceAnimal}</div>
                           </div>
                           <div className="flex items-center gap-3">
                              <button onClick={() => setPets(Math.max(0, pets - 1))} disabled={pets <= 0} className="p-2 border rounded-full hover:border-black disabled:opacity-20"><Minus size={16}/></button>
                              <span className="w-4 text-center">{pets}</span>
                              <button onClick={() => setPets(pets + 1)} className="p-2 border rounded-full hover:border-black"><Plus size={16}/></button>
                           </div>
                        </div>
                     </div>
                  )}
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;