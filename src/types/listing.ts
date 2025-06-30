export interface Listing {
  id: number;
  title: string;
  price: string;
  location: string;
  time: string;
  image: string;
  description: string;
  verified: boolean;
  category?: string;
  seller?: {
    name: string;
    rating: number;
    verified: boolean;
  };
  specifications?: Record<string, string>;
}