import React, { useState } from 'react';
import { X, Phone, User, Home, MessageSquare, Send, CheckCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Reset after a delay
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Help Center</h2>
            <p className="text-gray-400 text-sm">We are here to assist you.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {isSubmitted ? (
             <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                 <CheckCircle size={32} className="text-green-600" />
               </div>
               <h3 className="text-xl font-bold text-gray-800 mb-2">Request Received!</h3>
               <p className="text-gray-500">Our support team will contact you shortly.</p>
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Full Name</label>
                <div className="relative">
                  <User className="absolute top-3 left-3 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute top-3 left-3 text-gray-400" size={18} />
                  <input 
                    type="tel" 
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Room Number (if applicable)</label>
                <div className="relative">
                  <Home className="absolute top-3 left-3 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    placeholder="e.g. 104"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Describe your issue</label>
                <div className="relative">
                  <MessageSquare className="absolute top-3 left-3 text-gray-400" size={18} />
                  <textarea 
                    rows={4}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition resize-none"
                    placeholder="How can we help?"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="mt-4 bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
              >
                Submit Request
                <Send size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpModal;