/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { QuickViewModal } from './components/QuickViewModal';
import { AuthModal } from './components/AuthModal';

// Views
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CheckoutView } from './views/CheckoutView';
import { OrderConfirmationView } from './views/OrderConfirmationView';
import { TrackOrderView } from './views/TrackOrderView';
import { WishlistView } from './views/WishlistView';
import { AccountView } from './views/AccountView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AboutView, ContactView, FAQView } from './views/SupportViews';

const AppContent: React.FC = () => {
  const { currentView, isAdminLoggedIn, setIsAuthModalOpen, setAuthModalMode } = useShop();
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // If in admin view, render dedicated Admin Dashboard directly
  if (currentView === 'admin') {
    return <AdminDashboardView />;
  }
  
  return (
    <div className="min-h-screen bg-[#F5EFE6] text-[#111111] flex flex-col font-sans selection:bg-[#8B2E0B] selection:text-white">
      {/* Sticky Header with AURA announcement */}
      <Header onOpenSearch={() => setSearchModalOpen(true)} />

      {/* Main Dynamic View Area */}
      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'shop' && <ShopView />}
        {currentView === 'product-detail' && <ProductDetailView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'order-confirmation' && <OrderConfirmationView />}
        {currentView === 'track-order' && <TrackOrderView />}
        {currentView === 'wishlist' && <WishlistView />}
        {currentView === 'account' && <AccountView />}
        {currentView === 'about' && <AboutView />}
        {currentView === 'contact' && <ContactView />}
        {currentView === 'faq' && <FAQView />}
        {currentView === 'size-guide' && <FAQView />}
      </main>

      {/* Privilege Roster & Luxury Footer */}
      <Footer />

      {/* Floating WhatsApp Button (Icon Only - User Requirement) */}
      <WhatsAppButton />

      {/* Modals & Drawers */}
      <CartDrawer />
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
      <QuickViewModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
