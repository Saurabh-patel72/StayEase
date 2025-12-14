import React, { useState } from 'react';
import { X, Sparkles, Send, Loader2 } from 'lucide-react';
import { searchPropertiesWithAI } from '../services/geminiService';

interface AISearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResults: (ids: string[], summary: string) => void;
}

const AISearchModal: React.FC<AISearchModalProps> = ({ isOpen, onClose, onResults }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    const result = await searchPropertiesWithAI(query);
    setIsLoading(false);
    
    onResults(result.recommendedPropertyIds, result.summary);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-6 flex flex-row justify-between items-start text-white">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <h2 className="text-xl font-bold">StayEase Genius</h2>
            </div>
            <p className="text-rose-100 text-sm">
              Describe your dream trip, and our AI will find the perfect match.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Input Area */}
        <div className="p-8">
          <div className="relative">
            <textarea
              className="w-full border-2 border-gray-200 rounded-2xl p-4 pr-12 text-lg focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition resize-none h-40"
              placeholder="e.g., I'm looking for a cozy cabin near a lake with a fireplace for a romantic weekend..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            
            <div className="absolute bottom-4 right-4">
              <button 
                onClick={handleSearch}
                disabled={isLoading || !query.trim()}
                className={`
                  p-3 rounded-full flex items-center justify-center transition shadow-lg
                  ${isLoading ? 'bg-gray-100 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600 text-white'}
                `}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin text-rose-500" size={24} />
                ) : (
                  <Send size={24} />
                )}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Try asking about</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setQuery("A secluded treehouse for nature lovers")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition"
              >
                🌲 Secluded treehouse
              </button>
              <button 
                onClick={() => setQuery("Luxury villa with a pool for a party of 8")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition"
              >
                🎱 Luxury party villa
              </button>
              <button 
                onClick={() => setQuery("Romantic getaway with a hot tub near the mountains")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition"
              >
                🏔️ Romantic mountain trip
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">Powered by Gemini AI 2.5 Flash</p>
        </div>
      </div>
    </div>
  );
};

export default AISearchModal;