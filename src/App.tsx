import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Search, ShoppingBag, MapPin, Clock, DollarSign, Shield, Zap, TrendingUp, User, LogOut, ChevronDown, AlertTriangle, Network } from 'lucide-react';
import { useDynamicContext, getNetwork } from "@dynamic-labs/sdk-react-core";
import { sdk } from '@farcaster/frame-sdk';
import { ListingCard } from './components/ListingCard';
import { ListingDetail } from './components/ListingDetail';
import { listings } from './data/listings';

// Supported networks
const SUPPORTED_NETWORKS = {
  8453: { name: 'Base', color: 'blue' },
  84532: { name: 'Base Sepolia', color: 'green' }
};

function HomePage() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<number | null>(null);
  const [showNetworkWarning, setShowNetworkWarning] = useState(false);
  const [isNetworkLoading, setIsNetworkLoading] = useState(false);
  const { setShowAuthFlow, primaryWallet, user, handleLogOut, network } = useDynamicContext();

  useEffect(() => {
    const load = async () => {
      sdk.actions.ready();
      setIsSDKLoaded(true);
    };
    
    if (sdk && !isSDKLoaded) {
      load();
    }
  }, [isSDKLoaded]);

  // Monitor network changes with improved detection
  useEffect(() => {
    if (primaryWallet) {
      const checkNetwork = async () => {
        try {
          setIsNetworkLoading(true);
          
          // Try multiple methods to get the network
          let networkId = null;
          
          // Method 1: Use Dynamic's getNetwork utility
          try {
            networkId = await getNetwork(primaryWallet.connector);
          } catch (error) {
            console.log('getNetwork failed, trying alternative method');
          }
          
          // Method 2: Try to get from the network context
          if (!networkId && network) {
            networkId = network;
          }
          
          // Method 3: Try to get directly from wallet if available
          if (!networkId && primaryWallet.connector && primaryWallet.connector.getNetwork) {
            try {
              networkId = await primaryWallet.connector.getNetwork();
            } catch (error) {
              console.log('Direct connector getNetwork failed');
            }
          }
          
          // Method 4: For web3 wallets, try to get chainId directly
          if (!networkId && window.ethereum) {
            try {
              const chainId = await window.ethereum.request({ method: 'eth_chainId' });
              networkId = parseInt(chainId, 16);
            } catch (error) {
              console.log('Direct ethereum request failed');
            }
          }
          
          console.log('Detected network ID:', networkId);
          setCurrentNetwork(networkId);
          
          // Check if network is supported
          if (networkId && !SUPPORTED_NETWORKS[networkId as keyof typeof SUPPORTED_NETWORKS]) {
            setShowNetworkWarning(true);
          } else {
            setShowNetworkWarning(false);
          }
        } catch (error) {
          console.error('Error getting network:', error);
        } finally {
          setIsNetworkLoading(false);
        }
      };
      
      checkNetwork();
      
      // Set up interval to periodically check network
      const networkCheckInterval = setInterval(checkNetwork, 2000);
      
      // Listen for network changes if available
      if (window.ethereum) {
        const handleChainChanged = (chainId: string) => {
          const networkId = parseInt(chainId, 16);
          console.log('Chain changed to:', networkId);
          setCurrentNetwork(networkId);
          
          if (!SUPPORTED_NETWORKS[networkId as keyof typeof SUPPORTED_NETWORKS]) {
            setShowNetworkWarning(true);
          } else {
            setShowNetworkWarning(false);
          }
        };
        
        window.ethereum.on('chainChanged', handleChainChanged);
        
        return () => {
          clearInterval(networkCheckInterval);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        };
      }
      
      return () => {
        clearInterval(networkCheckInterval);
      };
    } else {
      setCurrentNetwork(null);
      setShowNetworkWarning(false);
    }
  }, [primaryWallet, network]);

  const handleAuthClick = () => {
    if (primaryWallet) {
      // User is logged in, could show profile or logout options
      console.log('User is logged in:', user);
    } else {
      // Show login flow
      setShowAuthFlow(true);
    }
  };

  const handleLogoutClick = () => {
    handleLogOut();
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const switchToNetwork = async (chainId: number) => {
    if (primaryWallet?.connector?.supportsNetworkSwitching()) {
      try {
        setIsNetworkLoading(true);
        await primaryWallet.switchNetwork(chainId);
        
        // Force network check after a short delay
        setTimeout(async () => {
          try {
            const networkId = await getNetwork(primaryWallet.connector);
            setCurrentNetwork(networkId);
            
            if (!SUPPORTED_NETWORKS[networkId as keyof typeof SUPPORTED_NETWORKS]) {
              setShowNetworkWarning(true);
            } else {
              setShowNetworkWarning(false);
            }
          } catch (error) {
            console.error('Error checking network after switch:', error);
          } finally {
            setIsNetworkLoading(false);
          }
        }, 1000);
        
        console.log(`Successfully switched to network ${chainId}`);
      } catch (error) {
        console.error('Error switching network:', error);
        alert('Failed to switch network. Please try again or switch manually in your wallet.');
        setIsNetworkLoading(false);
      }
    } else {
      alert('Network switching not supported by this wallet. Please switch manually in your wallet.');
    }
  };

  const getNetworkInfo = (networkId: number | null) => {
    if (!networkId) return { name: 'Unknown', color: 'gray' };
    return SUPPORTED_NETWORKS[networkId as keyof typeof SUPPORTED_NETWORKS] || { name: `Chain ${networkId}`, color: 'red' };
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.wallet-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const networkInfo = getNetworkInfo(currentNetwork);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Network Warning Banner */}
      {showNetworkWarning && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Unsupported Network
                </p>
                <p className="text-xs text-red-600">
                  Please switch to Base or Base Sepolia to use this marketplace
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => switchToNetwork(8453)}
                disabled={isNetworkLoading}
                className="bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isNetworkLoading ? 'Switching...' : 'Switch to Base'}
              </button>
              <button
                onClick={() => switchToNetwork(84532)}
                disabled={isNetworkLoading}
                className="bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isNetworkLoading ? 'Switching...' : 'Switch to Base Sepolia'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section - Optimized for Mini App */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo and Brand - Compact */}
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MarketPlace
                </h1>
                <p className="text-xs text-slate-500 -mt-1">Farcaster Mini App</p>
              </div>
            </div>

            {/* Search Bar - Responsive */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>
            </div>

            {/* Navigation - Compact */}
            <div className="flex items-center space-x-2">
              {/* Only show Post button when user is logged in */}
              {primaryWallet && (
                <button className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm px-2 py-1">
                  Post
                </button>
              )}
              {primaryWallet ? (
                <div className="relative wallet-dropdown">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 px-2 py-1.5 rounded-lg border border-slate-200 transition-all duration-200"
                  >
                    <User className="h-3 w-3" />
                    <span className="truncate max-w-20">
                      {primaryWallet.address.slice(0, 6)}...{primaryWallet.address.slice(-4)}
                    </span>
                    <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-500">Connected Wallet</p>
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {primaryWallet.address}
                        </p>
                        
                        {/* Network Info */}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Network className="h-3 w-3 text-slate-500" />
                            <span className="text-xs text-slate-500">Network:</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {isNetworkLoading ? (
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                            ) : (
                              <div className={`w-2 h-2 rounded-full ${
                                SUPPORTED_NETWORKS[currentNetwork as keyof typeof SUPPORTED_NETWORKS] 
                                  ? `bg-${networkInfo.color}-500` 
                                  : 'bg-red-500'
                              }`}></div>
                            )}
                            <span className={`text-xs font-medium ${
                              isNetworkLoading 
                                ? 'text-gray-500' 
                                : SUPPORTED_NETWORKS[currentNetwork as keyof typeof SUPPORTED_NETWORKS]
                                  ? `text-${networkInfo.color}-700`
                                  : 'text-red-700'
                            }`}>
                              {isNetworkLoading ? 'Detecting...' : networkInfo.name}
                            </span>
                          </div>
                        </div>
                        
                        {/* Network Switching */}
                        {currentNetwork && !SUPPORTED_NETWORKS[currentNetwork as keyof typeof SUPPORTED_NETWORKS] && (
                          <div className="mt-2 pt-2 border-t border-slate-100">
                            <p className="text-xs text-red-600 mb-2">Switch to supported network:</p>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => switchToNetwork(8453)}
                                disabled={isNetworkLoading}
                                className="flex-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium hover:bg-blue-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isNetworkLoading ? 'Switching...' : 'Base'}
                              </button>
                              <button
                                onClick={() => switchToNetwork(84532)}
                                disabled={isNetworkLoading}
                                className="flex-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium hover:bg-green-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isNetworkLoading ? 'Switching...' : 'Base Sepolia'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleLogoutClick}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Log out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleAuthClick}
                  className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm px-2 py-1"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Optimized for Mini App */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section - Compact */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            Buy & Sell <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Anything</span>
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto mb-4">
            The premier marketplace for everything you need - powered by Farcaster
          </p>
          
          {/* Dynamic Login/Logout Buttons Below Description */}
          <div className="flex flex-col items-center space-y-2">
            <button 
              onClick={handleAuthClick}
              className="bg-white border border-slate-300 text-slate-700 px-6 py-2.5 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 text-sm shadow-sm"
            >
              {primaryWallet ? `Connected: ${primaryWallet.address.slice(0, 6)}...${primaryWallet.address.slice(-4)}` : 'Log in or sign up'}
            </button>
            
            {/* Network Display */}
            {primaryWallet && (
              <div className="flex items-center space-x-2 text-xs text-slate-600">
                <Network className="h-3 w-3" />
                <span>Network:</span>
                <div className="flex items-center space-x-1">
                  {isNetworkLoading ? (
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                  ) : (
                    <div className={`w-2 h-2 rounded-full ${
                      SUPPORTED_NETWORKS[currentNetwork as keyof typeof SUPPORTED_NETWORKS] 
                        ? `bg-${networkInfo.color}-500` 
                        : 'bg-red-500'
                    }`}></div>
                  )}
                  <span className={`font-medium ${
                    isNetworkLoading 
                      ? 'text-gray-500' 
                      : SUPPORTED_NETWORKS[currentNetwork as keyof typeof SUPPORTED_NETWORKS]
                        ? `text-${networkInfo.color}-700`
                        : 'text-red-700'
                  }`}>
                    {isNetworkLoading ? 'Detecting...' : networkInfo.name}
                  </span>
                </div>
                
                {/* Quick Network Switch Buttons */}
                {!isNetworkLoading && currentNetwork && !SUPPORTED_NETWORKS[currentNetwork as keyof typeof SUPPORTED_NETWORKS] && (
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => switchToNetwork(8453)}
                      disabled={isNetworkLoading}
                      className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium hover:bg-blue-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Switch to Base
                    </button>
                    <button
                      onClick={() => switchToNetwork(84532)}
                      disabled={isNetworkLoading}
                      className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium hover:bg-green-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Switch to Base Sepolia
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {primaryWallet && (
              <button 
                onClick={handleLogoutClick}
                className="bg-red-50 border border-red-200 text-red-700 px-6 py-2.5 rounded-lg font-medium hover:bg-red-100 hover:border-red-300 transition-all duration-200 text-sm shadow-sm flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Bar - Compact Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-slate-200/60">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-green-100 rounded-md">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800">15.8K</p>
                <p className="text-xs text-slate-500">Listings</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-slate-200/60">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-100 rounded-md">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800">98%</p>
                <p className="text-xs text-slate-500">Verified</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-slate-200/60">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-purple-100 rounded-md">
                <Zap className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800">24/7</p>
                <p className="text-xs text-slate-500">Support</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-slate-200/60">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-orange-100 rounded-md">
                <DollarSign className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800">$250M+</p>
                <p className="text-xs text-slate-500">Volume</p>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Section - Optimized for Mobile */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800">Featured Listings</h3>
            <div className="flex items-center space-x-2">
              <select className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All</option>
                <option>Electronics</option>
                <option>Furniture</option>
                <option>Vehicles</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>

        {/* Load More Button - Compact */}
        <div className="text-center">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm">
            Load More Listings
          </button>
        </div>
      </main>

      {/* Footer - Minimal for Mini App */}
      <footer className="bg-slate-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="p-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-bold">MarketPlace</h1>
            </div>
            <p className="text-slate-400 text-sm">Powered by Farcaster</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/listing/:id" element={<ListingDetail />} />
    </Routes>
  );
}

export default App;