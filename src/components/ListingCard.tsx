import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Shield } from 'lucide-react';
import { Listing } from '../types/listing';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/listing/${listing.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200/60 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
    >
      <div className="relative">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {listing.verified && (
          <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
            <Shield className="h-3 w-3" />
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs font-semibold">
          {listing.price}
        </div>
      </div>
      
      <div className="p-4">
        <h4 className="font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors duration-200 text-sm">
          {listing.title}
        </h4>
        <p className="text-slate-600 text-xs mb-3 line-clamp-2">
          {listing.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{listing.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{listing.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};