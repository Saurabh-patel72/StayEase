import React from 'react';
import { Palmtree, Mountain, Tent, Home, Castle, Anchor, Building, Snowflake, Sun } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  { label: 'All', icon: null },
  { label: 'Amazing pools', icon: Palmtree },
  { label: 'Cabins', icon: Home },
  { label: 'Beachfront', icon: Anchor },
  { label: 'Treehouses', icon: Tent },
  { label: 'Castles', icon: Castle },
  { label: 'Camping', icon: Mountain },
  { label: 'City', icon: Building },
  { label: 'Arctic', icon: Snowflake },
  { label: 'Desert', icon: Sun },
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="pt-24 pb-4 flex flex-row items-center justify-start md:justify-center overflow-x-auto gap-8 px-4 md:px-20 border-b border-gray-100 no-scrollbar">
      {categories.map((item, index) => {
        const isSelected = selectedCategory === item.label || (selectedCategory === '' && item.label === 'All');
        
        return (
          <div 
            key={index}
            onClick={() => onSelectCategory(item.label === 'All' ? '' : item.label)}
            className={`
              flex flex-col items-center justify-center gap-2 p-2 
              border-b-2 transition cursor-pointer min-w-fit hover:opacity-80
              ${isSelected ? 'border-neutral-800 text-neutral-800' : 'border-transparent text-neutral-500'}
            `}
          >
            {item.icon ? <item.icon size={24} /> : <div className="h-6 w-6 border-2 border-current rounded-full flex items-center justify-center text-[10px] font-bold">ALL</div>}
            <div className={`font-medium text-xs ${isSelected ? 'font-bold' : ''}`}>
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryFilter;