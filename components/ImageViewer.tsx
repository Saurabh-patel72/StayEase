import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
}

const ImageViewer: React.FC<ImageViewerProps> = ({ isOpen, onClose, images }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black flex flex-col animate-in fade-in duration-300">
      <div className="flex justify-between items-center p-4">
        <button 
          onClick={onClose} 
          className="text-white hover:bg-white/20 p-2 rounded-full transition flex gap-2 items-center"
        >
          <X size={24} /> 
          <span className="font-semibold">Close</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-10 no-scrollbar">
         <div className="max-w-4xl mx-auto flex flex-col gap-4">
           {images.map((img, idx) => (
             <div key={idx} className="w-full">
                <img src={img} className="w-full object-contain rounded-lg shadow-2xl" alt={`Gallery ${idx}`} />
             </div>
           ))}
         </div>
      </div>
    </div>
  );
};

export default ImageViewer;