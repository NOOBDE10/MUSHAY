import React, { useState, useEffect } from 'react';
import { useShop, AppView } from '../context/ShopContext';
import { Search, Heart, ShoppingBag, Menu, X, User, Truck } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const {
    settings,
    cart,
    wishlist,
    setIsCartOpen,
    currentView,
    navigateTo,
    currentUser,
    isAdminLoggedIn,
    setIsAuthModalOpen,
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleNav = (view: AppView) => {
    navigateTo(view);
    setMobileMenuOpen(false);
  };

  const handleAccountClick = () => {
    if (isAdminLoggedIn) {
      navigateTo('admin');
    } else if (currentUser) {
      navigateTo('account');
    } else {
      setIsAuthModalOpen(true);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Announcement Bar with Free Delivery Topic & Order Tracker */}
      {settings.isAnnouncementActive && (
        <div className="w-full bg-[#8B2E0B] text-[#F5EFE6] py-1.5 px-3 sm:px-6 text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 shadow-xs border-b border-[#A0645A]/30">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Left/Center Free Delivery Topic */}
            <div className="flex-1 flex items-center justify-center sm:justify-start gap-2 truncate">
              <span className="font-bold tracking-widest uppercase">
                {settings.announcementText || 'MUSHAY'}
              </span>
              <span className="hidden sm:inline text-[#F5EFE6]/50">•</span>
              <span className="font-semibold text-[11px] sm:text-xs text-[#F5EFE6] truncate tracking-wide">
                {settings.announcementDeliveryText ||
                  `FREE DELIVERY NATIONWIDE ON ORDERS ABOVE PKR ${(settings.freeShippingThreshold || 500).toLocaleString()}`}
              </span>
            </div>

            {/* Top Right Order Tracker button */}
            <button
              onClick={() => handleNav('track-order')}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#111111]/40 hover:bg-[#111111] text-[#FAF7F2] border border-[#F5EFE6]/30 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all shrink-0 hover:scale-105 cursor-pointer shadow-xs"
              title="Track Your Order Consignment"
            >
              <Truck className="w-3.5 h-3.5 text-[#F3E5AB]" />
              <span>Track Order</span>
            </button>
          </div>
        </div>
      )}

      {/* 
        Main Sticky Header: Deep Dark Luxury Tone (#161616)
        "हेडर को थोड़ा सा डार्क रंग दो कि पहचान में आए, हेडर वाजे हो। थोड़ा सा डार्क रंग दो।"
        "लोगो का बैकग्राउंड ट्रांसपेरेंट कर दो।"
      */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#121212]/95 backdrop-blur-md border-b border-[#262626] py-2.5 shadow-lg'
            : 'bg-[#161616] border-b border-[#242424] py-3.5 md:py-4 shadow-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Hamburger Menu Toggle */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-[#FAF7F2] p-2 hover:text-[#A0645A] transition-colors bg-transparent border-0"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* 
              Brand Name & Category:
              - Logo removed as requested.
              - Brand name text cleanly displayed: MUSHAY.
              - Below brand name: WEAR.
            */}
            <div className="flex items-center">
              <button
                onClick={() => handleNav('home')}
                className="text-left group flex items-center transition-transform hover:scale-[1.02] bg-transparent p-0 border-0 focus:outline-none cursor-pointer"
                title="MUSHAY Home"
              >
                {/* Brand Name Text with OFFICIAL below it */}
                <div className="flex flex-col justify-center select-none py-1">
                  <span className="text-xl sm:text-2xl font-serif-luxury font-bold tracking-[0.12em] text-[#FAF7F2] leading-none">
                    {settings.brandName || 'MUSHAY'}
                  </span>
                  <span className="text-[8.5px] sm:text-[9.5px] text-[#A0645A] uppercase tracking-[0.35em] font-bold mt-1.5 leading-none">
                    OFFICIAL
                  </span>
                </div>
              </button>
            </div>

            {/* Clean Desktop Navigation Links */}
            <nav className="hidden md:flex items-center justify-center space-x-1 lg:space-x-2 bg-[#202020] border border-[#2D2D2D] rounded-full px-5 py-1.5 shadow-inner">
              <button
                onClick={() => handleNav('home')}
                className={`px-4 py-1.5 text-xs font-semibold tracking-widest uppercase transition-all duration-200 rounded-full ${
                  currentView === 'home'
                    ? 'bg-[#8B2E0B] text-white shadow-xs'
                    : 'text-[#C4AD8A] hover:text-[#FAF7F2] hover:bg-[#282828]'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => handleNav('shop')}
                className={`px-4 py-1.5 text-xs font-semibold tracking-widest uppercase transition-all duration-200 rounded-full ${
                  currentView === 'shop'
                    ? 'bg-[#8B2E0B] text-white shadow-xs'
                    : 'text-[#C4AD8A] hover:text-[#FAF7F2] hover:bg-[#282828]'
                }`}
              >
                Shop
              </button>

              <button
                onClick={() => handleNav('about')}
                className={`px-4 py-1.5 text-xs font-semibold tracking-widest uppercase transition-all duration-200 rounded-full ${
                  currentView === 'about'
                    ? 'bg-[#8B2E0B] text-white shadow-xs'
                    : 'text-[#C4AD8A] hover:text-[#FAF7F2] hover:bg-[#282828]'
                }`}
              >
                About
              </button>

              <button
                onClick={() => handleNav('contact')}
                className={`px-4 py-1.5 text-xs font-semibold tracking-widest uppercase transition-all duration-200 rounded-full ${
                  currentView === 'contact'
                    ? 'bg-[#8B2E0B] text-white shadow-xs'
                    : 'text-[#C4AD8A] hover:text-[#FAF7F2] hover:bg-[#282828]'
                }`}
              >
                Contact
              </button>
            </nav>

            {/* Header Right Actions: Search, Wishlist, Account, Cart */}
            <div className="flex items-center space-x-1 sm:space-x-2 bg-[#202020] border border-[#2D2D2D] rounded-full px-3 py-1 shadow-inner">
              <button
                onClick={onOpenSearch}
                className="p-1.5 text-[#C4AD8A] hover:text-[#FAF7F2] hover:bg-[#282828] rounded-full transition-colors"
                title="Search garments"
                aria-label="Search"
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>

              <button
                onClick={() => handleNav('wishlist')}
                className="p-1.5 text-[#C4AD8A] hover:text-[#FAF7F2] hover:bg-[#282828] rounded-full transition-colors relative"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#8B2E0B] text-white text-[8px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={handleAccountClick}
                className="p-1.5 text-[#C4AD8A] hover:text-[#FAF7F2] hover:bg-[#282828] rounded-full transition-colors"
                title={isAdminLoggedIn ? "Admin Portal" : currentUser ? "Account" : "Sign In"}
                aria-label="Account"
              >
                <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-1.5 text-[#C4AD8A] hover:text-[#FAF7F2] hover:bg-[#282828] rounded-full transition-colors relative"
                title="Shopping Bag"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#8B2E0B] text-white text-[8px] font-bold rounded-full flex items-center justify-center shadow-xs animate-pulse">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#161616]/98 backdrop-blur-md border-b border-[#282828] px-4 pt-3 pb-6 space-y-2 animate-fadeIn shadow-2xl mt-2 mx-4 rounded-[16px]">
            <button
              onClick={() => handleNav('home')}
              className={`w-full text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${
                currentView === 'home' ? 'bg-[#8B2E0B] text-white' : 'text-[#C4AD8A] hover:bg-[#242424]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('shop')}
              className={`w-full text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${
                currentView === 'shop' ? 'bg-[#8B2E0B] text-white' : 'text-[#C4AD8A] hover:bg-[#242424]'
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => handleNav('wishlist')}
              className={`w-full text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${
                currentView === 'wishlist' ? 'bg-[#8B2E0B] text-white' : 'text-[#C4AD8A] hover:bg-[#242424]'
              }`}
            >
              Wishlist
            </button>
            <button
              onClick={() => handleNav('about')}
              className={`w-full text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${
                currentView === 'about' ? 'bg-[#8B2E0B] text-white' : 'text-[#C4AD8A] hover:bg-[#242424]'
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleNav('contact')}
              className={`w-full text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${
                currentView === 'contact' ? 'bg-[#8B2E0B] text-white' : 'text-[#C4AD8A] hover:bg-[#242424]'
              }`}
            >
              Contact
            </button>
            <button
              onClick={handleAccountClick}
              className="w-full text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-[#C4AD8A] hover:bg-[#242424] rounded-lg transition-colors border-t border-[#282828] mt-2"
            >
              {currentUser ? "My Account" : "Customer Sign In / Register"}
            </button>
          </div>
        )}
      </header>
    </>
  );
};
