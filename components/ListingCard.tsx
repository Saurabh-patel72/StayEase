import React from 'react';
import { Property } from '../types';
import { Star, Heart } from 'lucide-react';

interface ListingCardProps {
  data: Property;
  onClick: (id: string) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ data, onClick }) => {
  return (
    <div 
      className="col-span-1 cursor-pointer group"
      onClick={() => onClick(data.id)}
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <img 
            src={data.imageUrl} 
            alt={data.title}
            className="object-cover h-full w-full group-hover:scale-110 transition h-full w-full"
          />
          <div className="absolute top-3 right-3">
             <Heart className="text-white fill-neutral-500/50 hover:fill-rose-500 hover:text-rose-500 transition" size={24} />
          </div>
        </div>
        <div className="font-semibold text-lg flex flex-row justify-between">
          <div className="truncate pr-4">{data.location}</div>
          <div className="flex flex-row items-center gap-1 text-sm font-light">
             <Star size={14} className="fill-black" />
             {data.rating}
          </div>
        </div>
        <div className="font-light text-neutral-500 text-sm truncate">
          {data.type} • {data.hostName}
        </div>
        <div className="font-light text-neutral-500 text-sm">
          Nov 14 - 19
        </div>
        <div className="flex flex-row items-center gap-1 mt-1">
          <div className="font-semibold">
            ${data.pricePerNight}
          </div>
          <div className="font-light">night</div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;