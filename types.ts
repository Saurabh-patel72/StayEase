export interface Property {
  id: string;
  title: string;
  description: string;
  type: string; // e.g., "Entire home", "Private room"
  category: string; // e.g., "Cabins", "Beachfront", "City"
  location: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  amenities: string[];
  hostName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  capacity: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
}

export interface SearchFilters {
  location: string;
  checkIn?: Date;
  checkOut?: Date;
  guests: number;
}

export type ViewState = 'HOME' | 'DETAILS' | 'SEARCH_RESULTS';