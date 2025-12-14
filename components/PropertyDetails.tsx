import React, { useState } from 'react';
import { Property } from '../types';
import { Star, ShieldCheck, MapPin, Share, Heart, CheckCircle } from 'lucide-react';
import { TRANSLATIONS, Language } from '../utils/translations';
import AuthModal from './AuthModal';
import ShareModal from './ShareModal';
import ImageViewer from './ImageViewer';

interface PropertyDetailsProps {
  property: Property;
  onBack: () => void;
  lang: Language;
}

// Completely new list of reliable, high-quality interior images
const INTERIOR_IMAGES = [
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=1200&auto=format&fit=crop', // Modern Living Room
  'https://images.unsplash.com/photo-1616137466211-f939a420be84?q=80&w=1200&auto=format&fit=crop', // Bright Bedroom
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop', // Elegant Sofa
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop', // Modern Furniture
  'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1200&auto=format&fit=crop', // Clean Kitchen
  'https://images.unsplash.com/photo-1595558171673-e79482169081?q=80&w=1200&auto=format&fit=crop', // Zen Bedroom
  'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1200&auto=format&fit=crop', // Kitchen Island
  'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1200&auto=format&fit=crop', // Contemporary Living
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop', // Cozy Corner
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1200&auto=format&fit=crop'  // Spacious Interior
];

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, onBack, lang }) => {
  const [isBooked, setIsBooked] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const t = TRANSLATIONS[lang];

  const handleReserve = () => {
    setTimeout(() => {
      setIsBooked(true);
    }, 500);
  };

  const handleSaveClick = () => {
    if (isSaved) {
      setIsSaved(false);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsSaved(true);
  };

  // Generate deterministic gallery images based on property ID
  const galleryImages = [property.imageUrl];
  
  // Use a simple hash of the ID to pick starting index from INTERIOR_IMAGES
  let hash = 0;
  for (let i = 0; i < property.id.length; i++) {
    hash = property.id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const baseIndex = Math.abs(hash) % INTERIOR_IMAGES.length;

  // Add 4 additional images for the grid
  for (let i = 0; i < 4; i++) {
    galleryImages.push(INTERIOR_IMAGES[(baseIndex + i) % INTERIOR_IMAGES.length]);
  }

  return (
    <>
    {/* Layout update: 95% width, max 1800px for "bhara bhara" look but with padding */}
    <div className="w-[95%] max-w-[1800px] mx-auto px-4 md:px-8 py-8 animate-in slide-in-from-bottom-4 duration-500 pt-28">
      
      <button 
        onClick={onBack}
        className="mb-6 text-sm font-semibold underline text-neutral-800 hover:text-neutral-500"
      >
        &larr; Back
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 tracking-tight">{property.title}</h1>
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm md:text-base font-medium text-gray-700">
             <Star size={16} className="fill-black text-black" />
             <span className="underline">{property.rating} · {property.reviewCount} {t.reviews}</span>
             <span>·</span>
             <span className="underline font-bold text-gray-900">{property.location}</span>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={() => setIsShareModalOpen(true)}
               className="flex items-center gap-2 text-sm underline hover:bg-gray-100 px-4 py-2 rounded-lg transition font-medium"
             >
               <Share size={18}/> {t.share}
             </button>
             <button 
               onClick={handleSaveClick}
               className="flex items-center gap-2 text-sm underline hover:bg-gray-100 px-4 py-2 rounded-lg transition font-medium"
             >
               <Heart 
                 size={18} 
                 className={`transition-colors duration-300 ${isSaved ? 'fill-primary text-primary' : 'text-gray-800'}`}
               /> 
               {isSaved ? 'Saved' : t.save}
             </button>
          </div>
        </div>
      </div>

      {/* Image Grid - Height 60vh to look full */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-3xl overflow-hidden h-[50vh] md:h-[60vh] min-h-[400px] mb-8 relative shadow-premium">
        <div className="h-full">
           <img 
             src={galleryImages[0]} 
             alt="Main" 
             className="object-cover w-full h-full hover:scale-105 transition duration-700 cursor-pointer" 
             onClick={() => setIsGalleryOpen(true)}
           />
        </div>
        <div className="hidden md:grid grid-cols-2 gap-2 h-full">
           {galleryImages.slice(1, 5).map((img, i) => (
             <div key={i} className="overflow-hidden h-full w-full">
               <img 
                 src={img} 
                 className="object-cover w-full h-full hover:scale-105 transition duration-500 cursor-pointer" 
                 alt={`Gallery ${i}`}
                 onClick={() => setIsGalleryOpen(true)}
               />
             </div>
           ))}
        </div>
        <button 
          onClick={() => setIsGalleryOpen(true)}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 border border-black/10 rounded-lg text-sm font-semibold shadow-lg hover:bg-white transition"
        >
           {t.showPhotos}
        </button>
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left Col */}
        <div className="md:col-span-2">
           <div className="border-b border-gray-200 pb-6 mb-6">
             <h2 className="text-2xl font-semibold mb-1 text-gray-900">
               {property.type} {t.hostedBy} {property.hostName}
             </h2>
             <p className="text-gray-600">
               {property.capacity.guests} {t.guests} · {property.capacity.bedrooms} bedrooms · {property.capacity.beds} beds · {property.capacity.bathrooms} baths
             </p>
           </div>

           <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex items-start gap-4 mb-4">
                 <ShieldCheck size={28} className="text-gray-800 mt-1" />
                 <div>
                   <div className="font-bold text-gray-900">Self check-in</div>
                   <div className="text-gray-500 text-sm">Check yourself in with the keypad.</div>
                 </div>
              </div>
              <div className="flex items-start gap-4 mb-4">
                 <MapPin size={28} className="text-gray-800 mt-1" />
                 <div>
                   <div className="font-bold text-gray-900">Great location</div>
                   <div className="text-gray-500 text-sm">90% of recent guests gave the location a 5-star rating.</div>
                 </div>
              </div>
              {isSaved && (
                <div className="flex items-start gap-4 mb-4 animate-in slide-in-from-left-2">
                   <Heart size={28} className="text-primary fill-primary mt-1" />
                   <div>
                     <div className="font-bold text-gray-900">Saved to your list</div>
                     <div className="text-gray-500 text-sm">You loved this property!</div>
                   </div>
                </div>
              )}
           </div>

           <div className="border-b border-gray-200 pb-6 mb-6">
             <h2 className="text-2xl font-semibold mb-4 text-gray-900">About this place</h2>
             <p className="text-gray-700 leading-relaxed text-lg font-light">
               {property.description}
             </p>
           </div>

           <div>
             <h2 className="text-2xl font-semibold mb-4 text-gray-900">What this place offers</h2>
             <div className="grid grid-cols-2 gap-4">
               {property.amenities.map(amenity => (
                 <div key={amenity} className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-royal" />
                    {amenity}
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* Right Col - Reservation Card */}
        <div className="relative">
          <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl shadow-premium p-6">
             <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-2xl font-bold text-gray-900">${property.pricePerNight}</span>
                  <span className="text-gray-500 text-sm"> / {t.night}</span>
                </div>
                <div className="text-xs font-semibold underline text-gray-700">
                   {property.reviewCount} {t.reviews}
                </div>
             </div>

             <div className="border border-gray-300 rounded-xl mb-4 overflow-hidden">
                <div className="grid grid-cols-2 border-b border-gray-300">
                   <div className="p-3 border-r border-gray-300 hover:bg-gray-50 transition cursor-pointer">
                      <div className="text-[10px] font-bold uppercase text-gray-800">{t.checkIn}</div>
                      <div className="text-sm text-gray-600">11/14/2024</div>
                   </div>
                   <div className="p-3 hover:bg-gray-50 transition cursor-pointer">
                      <div className="text-[10px] font-bold uppercase text-gray-800">{t.checkOut}</div>
                      <div className="text-sm text-gray-600">11/19/2024</div>
                   </div>
                </div>
                <div className="p-3 hover:bg-gray-50 transition cursor-pointer">
                   <div className="text-[10px] font-bold uppercase text-gray-800">{t.guests}</div>
                   <div className="text-sm text-gray-600">1 {t.guest}</div>
                </div>
             </div>

            {isBooked ? (
               <div className="w-full bg-green-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 mb-4 animate-in zoom-in">
                 <CheckCircle size={20} />
                 Reserved!
               </div>
            ) : (
             <button 
               onClick={handleReserve}
               className="w-full bg-gradient-to-r from-primary to-rose-600 hover:shadow-lg text-white font-bold py-4 rounded-xl transition mb-4 active:scale-[0.98] text-lg"
             >
               {t.reserve}
             </button>
            )}

             <div className="text-center text-sm text-gray-500 mb-6 font-medium">
                You won't be charged yet
             </div>

             <div className="space-y-4 text-gray-600">
                <div className="flex justify-between">
                   <span className="underline">${property.pricePerNight} x 5 {t.night}</span>
                   <span>${property.pricePerNight * 5}</span>
                </div>
                <div className="flex justify-between">
                   <span className="underline">{t.cleaningFee}</span>
                   <span>$60</span>
                </div>
                <div className="flex justify-between">
                   <span className="underline">{t.serviceFee}</span>
                   <span>$80</span>
                </div>
                <div className="h-px bg-gray-200 my-4"></div>
                <div className="flex justify-between font-bold text-gray-900 text-lg">
                   <span>{t.total}</span>
                   <span>${(property.pricePerNight * 5) + 60 + 80}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>

    {/* Modals triggered from this page */}
    <AuthModal 
      isOpen={isAuthModalOpen} 
      onClose={() => setIsAuthModalOpen(false)} 
      lang={lang}
      onSuccess={handleAuthSuccess}
    />
    <ShareModal 
      isOpen={isShareModalOpen} 
      onClose={() => setIsShareModalOpen(false)} 
      lang={lang} 
      property={property}
    />
    <ImageViewer
      isOpen={isGalleryOpen}
      onClose={() => setIsGalleryOpen(false)}
      images={galleryImages}
    />
    </>
  );
};

export default PropertyDetails;