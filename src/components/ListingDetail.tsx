import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Shield, Star, User, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { listings } from '../data/listings';

export const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setShowAuthFlow, primaryWallet } = useDynamicContext();
  
  const listing = listings.find(l => l.id === parseInt(id || '0'));

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Listing Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  const handleBuyClick = () => {
    if (!primaryWallet) {
      // Show login if user is not authenticated
      setShowAuthFlow(true);
    } else {
      // Handle purchase logic here
      alert('Purchase functionality would be implemented here!');
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={handleBackClick}
              className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Listings</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-lg"
              />
              {listing.verified && (
                <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg">
                  <Shield className="h-5 w-5" />
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 leading-tight">
                  {listing.title}
                </h1>
                {listing.category && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {listing.category}
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold text-green-600 mb-4">
                {listing.price}
              </div>
            </div>

            {/* Location and Time */}
            <div className="flex items-center space-x-4 text-slate-600">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{listing.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{listing.time}</span>
              </div>
            </div>

            {/* Seller Info */}
            {listing.seller && (
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-slate-200/60">
                <h3 className="font-semibold text-slate-800 mb-2">Seller Information</h3>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-100 rounded-full">
                    <User className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-slate-800">{listing.seller.name}</span>
                      {listing.seller.verified && (
                        <Shield className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-slate-600">{listing.seller.rating} rating</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-slate-200/60">
              <h3 className="font-semibold text-slate-800 mb-2">Description</h3>
              <p className="text-slate-600 leading-relaxed">{listing.description}</p>
            </div>

            {/* Specifications */}
            {listing.specifications && (
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-slate-200/60">
                <h3 className="font-semibold text-slate-800 mb-3">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(listing.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1">
                      <span className="text-slate-600 text-sm">{key}:</span>
                      <span className="text-slate-800 text-sm font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleBuyClick}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{primaryWallet ? 'Buy Now' : 'Login to Buy'}</span>
              </button>
              
              <button className="w-full bg-white border-2 border-slate-300 text-slate-700 py-3 px-6 rounded-lg font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all duration-200">
                Contact Seller
              </button>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Secure Transaction</h4>
                  <p className="text-sm text-blue-600 mt-1">
                    All transactions are protected by our buyer protection program. Your payment is held securely until you confirm receipt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};