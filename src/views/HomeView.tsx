import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import {
  ArrowRight,
  Crown,
  ShieldCheck,
  Truck,
  RefreshCw,
  Layers,
  ChevronDown,
  ChevronUp,
  Flame,
  Award,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    products,
    settings,
    navigateTo,
    categories,
    setSelectedShopDepartment,
    setSelectedShopCategory,
    setActiveAdminTab,
    setIsWhatsAppModalOpen,
  } = useShop();

  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);

  // Increased card quantities for a richer, more abundant browsing experience
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 12);
  const newArrivals = products.filter((p) => p.isNew || p.id === 'prod-001' || p.id === 'prod-002').slice(0, 8);
  const dealProducts = products.filter((p) => p.isSale || p.discountPercent > 10).slice(0, 8);

  // Active categories from Admin Panel
  const activeCategories = categories.filter((c) => c.isActive);

  const handleDepartmentClick = (dept: 'women' | 'men' | 'child') => {
    setSelectedShopDepartment(dept);
    setSelectedShopCategory('all');
    navigateTo('shop');
  };

  const handleCategoryCardClick = (cat: typeof categories[0]) => {
    if (cat.gender && cat.gender !== 'all') {
      setSelectedShopDepartment(cat.gender);
    } else {
      setSelectedShopDepartment('all');
    }
    setSelectedShopCategory(cat.name);
    navigateTo('shop');
  };

  const handleWhatsAppOrder = () => {
    setIsWhatsAppModalOpen(true);
  };

  return (
    <div className="w-full space-y-16 md:space-y-24 pb-16 bg-[#F5EFE6] text-[#111111]">
      {/* 
        1. LUXURY HERO SECTION WITH MATCHING BACKGROUND IMAGE & TOTALLY TRANSPARENT LOGO:
        "हीरो सेशन में इमेज लगा दो। मेरे लोगो का बैकग्राउंड रिमूव करके टोटल ट्रांसपेरेंट कर दो। 
        और लोगो से ही मिलते-जुलते कुछ भी आप अपनी तरफ से पिक्चर हीरो सेशन के बैकग्राउंड पर लगा दो।"
      */}
      <section className="relative w-full min-h-[72vh] md:min-h-[82vh] flex items-center justify-center overflow-hidden border-b border-[#A0645A]/25">
        {/* Hero Background Image */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={settings.heroBackgroundImage || '/src/assets/images/hero_ms_luxury_1791101309370.jpg'}
            alt="MUSHAY Luxury Atelier"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.97] contrast-[1.03] transition-transform duration-1000"
          />
          {/* Luminous, translucent luxury overlay that ensures typography remains crisp and clear */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F5EFE6]/75 via-[#FAF7F2]/65 to-[#F5EFE6]/90 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.45)_0%,rgba(245,239,230,0.7)_80%)]" />
        </div>

        {/* Hero Center Content: Typography & Call to Actions (Logo removed as requested) */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center py-20 md:py-32 flex flex-col items-center">
          <span className="text-xs sm:text-sm font-semibold tracking-[0.38em] text-[#8B2E0B] uppercase mb-4 animate-fadeIn">
            HAUTE COUTURE ATELIER • {settings.brandName || 'MUSHAY'}
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif-luxury font-bold tracking-tight text-[#111111] animate-fadeIn">
            {settings.heroHeadline || 'STYLE THAT SPEAKS.'}
          </h1>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-[#111111]/75 font-light max-w-xl tracking-wide leading-relaxed animate-fadeIn">
            {settings.heroSubtext || 'Discover refined fashion designed for your everyday moments.'}
          </p>

          {/* Action Buttons: Rust-red primary button, explore button & animated WhatsApp Concierge button */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
            <button
              onClick={() => navigateTo('shop')}
              className="relative group overflow-hidden px-8 py-3.5 bg-[#8B2E0B] hover:bg-[#111111] text-[#F5EFE6] font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] rounded-[22px] shadow-[0_8px_25px_rgba(139,46,11,0.28)] hover:shadow-[0_12px_30px_rgba(17,17,17,0.35)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>SHOP NOW</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform pointer-events-none" />
            </button>

            <button
              onClick={() => navigateTo('shop')}
              className="px-8 py-3.5 bg-white/80 hover:bg-[#8B2E0B] text-[#111111] hover:text-white border border-[#A0645A]/40 hover:border-[#8B2E0B] font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] rounded-[22px] backdrop-blur-md transition-all shadow-xs hover:shadow-lg transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              EXPLORE COLLECTIONS
            </button>

            {/* WhatsApp Direct Order & Concierge Inquiry Button */}
            <button
              onClick={handleWhatsAppOrder}
              className="group relative flex items-center gap-2.5 px-7 py-3.5 rounded-[22px] bg-[#1E7E34] hover:bg-[#155D27] text-white font-bold text-xs sm:text-sm uppercase tracking-[0.18em] shadow-[0_8px_25px_rgba(30,126,52,0.3)] hover:shadow-[0_12px_30px_rgba(30,126,52,0.45)] border border-emerald-400/30 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
              title="Open MUSHAY WhatsApp Concierge & Live Inquiry"
            >
              {/* Subtle active status dot */}
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
              </span>

              {/* WhatsApp Official SVG Icon */}
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 fill-white drop-shadow-xs group-hover:scale-110 transition-transform duration-300"
                viewBox="0 0 24 24"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>WHATSAPP INQUIRY</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY TILES: EXPLORE THE HOUSE OF MUSHAY (Women, Men, Child) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8B2E0B] font-semibold">
            Curated Collections
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-[#111111] tracking-wide">
            EXPLORE THE HOUSE OF {settings.brandName || 'MUSHAY'}
          </h2>
          <p className="text-xs sm:text-sm text-[#111111]/70 max-w-lg mx-auto">
            Choose your department to view tailored garments and exclusive bespoke creations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Women's Couture */}
          <div
            onClick={() => handleDepartmentClick('women')}
            className="group relative h-[420px] rounded-[22px] overflow-hidden border border-[#A0645A]/30 hover:border-[#8B2E0B] cursor-pointer transition-all duration-300 shadow-[0_10px_30px_rgba(17,17,17,0.08)] hover:shadow-[0_22px_45px_rgba(139,46,11,0.2)] hover:-translate-y-1.5"
          >
            <img
              src="/src/assets/images/fashion_gold_blazer_1790533633560.jpg"
              alt="Women's Couture"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#C4AD8A] font-semibold">
                  Atelier
                </span>
                <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white tracking-wide">
                  WOMEN'S COUTURE
                </h3>
                <p className="text-xs text-[#FAF7F2]/80 mt-1">
                  View all Women's dresses, evening gowns & tailored blazers
                </p>
              </div>
              <span className="p-3 rounded-full bg-[#8B2E0B] text-white group-hover:scale-110 group-hover:translate-x-1 transition-all shadow-md">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Card 2: Men's Bespoke */}
          <div
            onClick={() => handleDepartmentClick('men')}
            className="group relative h-[420px] rounded-[22px] overflow-hidden border border-[#A0645A]/30 hover:border-[#8B2E0B] cursor-pointer transition-all duration-300 shadow-[0_10px_30px_rgba(17,17,17,0.08)] hover:shadow-[0_22px_45px_rgba(139,46,11,0.2)] hover:-translate-y-1.5"
          >
            <img
              src="/src/assets/images/fashion_mens_gold_tuxedo_1790533657236.jpg"
              alt="Men's Bespoke"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#C4AD8A] font-semibold">
                  Sartorial
                </span>
                <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white tracking-wide">
                  MEN'S BESPOKE
                </h3>
                <p className="text-xs text-[#FAF7F2]/80 mt-1">
                  View all Men's luxury suits, tuxedos & executive tailoring
                </p>
              </div>
              <span className="p-3 rounded-full bg-[#8B2E0B] text-white group-hover:scale-110 group-hover:translate-x-1 transition-all shadow-md">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Card 3: Children's Collection */}
          <div
            onClick={() => handleDepartmentClick('child')}
            className="group relative h-[420px] rounded-[22px] overflow-hidden border border-[#A0645A]/30 hover:border-[#8B2E0B] cursor-pointer transition-all duration-300 shadow-[0_10px_30px_rgba(17,17,17,0.08)] hover:shadow-[0_22px_45px_rgba(139,46,11,0.2)] hover:-translate-y-1.5"
          >
            <img
              src="/src/assets/images/child_luxury_fashion_1790986764971.jpg"
              alt="Children's Atelier"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#C4AD8A] font-semibold">
                  Junior Atelier
                </span>
                <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white tracking-wide">
                  CHILDREN'S COLLECTION
                </h3>
                <p className="text-xs text-[#FAF7F2]/80 mt-1">
                  View all luxury Child kurtas, sets & festive dresses
                </p>
              </div>
              <span className="p-3 rounded-full bg-[#8B2E0B] text-white group-hover:scale-110 group-hover:translate-x-1 transition-all shadow-md">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 
        3. SIGNATURE BEST SELLERS (Increased quantity: 12 cards)
        "जो कार्ड्स हैं, वो कार्ड्स की क्वांटिटी थोड़ी बढ़ा दो।"
      */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-[#A0645A]/25">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#8B2E0B] font-semibold">
              Most Coveted
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#111111] tracking-wide">
              SIGNATURE BEST SELLERS
            </h2>
          </div>

          <button
            onClick={() => navigateTo('shop')}
            className="text-xs uppercase tracking-widest font-bold text-[#8B2E0B] hover:text-[#111111] flex items-center gap-1.5 group transition-colors"
          >
            <span>VIEW ALL PIECES</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. LUXURY CAMPAIGN BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[22px] overflow-hidden border border-[#A0645A]/30 bg-[#FAF7F2] p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_10px_30px_rgba(17,17,17,0.06)]">
          <div className="max-w-xl space-y-4 text-left">
            <span className="text-xs uppercase tracking-[0.3em] text-[#8B2E0B] font-bold flex items-center justify-start gap-1.5">
              <Crown className="w-3.5 h-3.5 text-[#8B2E0B]" />
              Bespoke Tailoring Atelier
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-[#111111] tracking-wide leading-tight">
              PRECISION TAILORING. UNCOMPROMISED NOBILITY.
            </h2>
            <p className="text-xs sm:text-sm text-[#111111]/80 font-normal leading-relaxed">
              Every {settings.brandName || 'MUSHAY'} garment is hand-inspected in our design ateliers before being sealed in preservation packaging. Enjoy nationwide Cash on Delivery and prompt delivery.
            </p>
          </div>

          <button
            onClick={() => navigateTo('shop')}
            className="px-8 py-3.5 bg-[#8B2E0B] hover:bg-[#111111] text-[#F5EFE6] font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] rounded-[22px] transition-all transform hover:scale-105 shrink-0 shadow-md cursor-pointer"
          >
            EXPLORE ATELIER
          </button>
        </div>
      </section>

      {/* 
        5. FEATURED DEALS & SALE HIGHLIGHTS (8 cards)
      */}
      {dealProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-[#A0645A]/25">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#8B2E0B] font-semibold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#8B2E0B]" />
                Limited Privileges
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#111111] tracking-wide">
                SPECIAL ATELIER DEALS
              </h2>
            </div>

            <button
              onClick={() => navigateTo('shop')}
              className="text-xs uppercase tracking-widest font-bold text-[#8B2E0B] hover:text-[#111111] flex items-center gap-1.5 group transition-colors"
            >
              <span>EXPLORE ALL DEALS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {dealProducts.map((product) => (
              <ProductCard key={product.id} product={product} isDealCard={true} />
            ))}
          </div>
        </section>
      )}

      {/* 6. NEW COUTURE DROPS (8 cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8B2E0B] font-semibold">
            Fresh From Atelier
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#111111] tracking-wide">
            NEW COUTURE DROPS
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. TRUST INDICATORS: ONLY 2 DAYS EASY EXCHANGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 md:p-8 bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[22px] text-center shadow-[0_8px_25px_rgba(17,17,17,0.06)]">
          <div className="space-y-2">
            <Truck className="w-6 h-6 text-[#8B2E0B] mx-auto" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111111]">Cash on Delivery</h4>
            <p className="text-[11px] text-[#111111]/70">Pay safely upon unboxing across Pakistan</p>
          </div>

          <div className="space-y-2">
            <Award className="w-6 h-6 text-[#8B2E0B] mx-auto" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111111]">Complimentary Delivery</h4>
            <p className="text-[11px] text-[#111111]/70">On all orders above PKR {settings.freeShippingThreshold.toLocaleString()}</p>
          </div>

          <div className="space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#8B2E0B] mx-auto" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111111]">Pure Craftsmanship</h4>
            <p className="text-[11px] text-[#111111]/70">100% genuine silk, cashmere, and wool fabrics</p>
          </div>

          <div className="space-y-2">
            <RefreshCw className="w-6 h-6 text-[#8B2E0B] mx-auto" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111111]">Easy Exchange Policy</h4>
            <p className="text-[11px] text-[#8B2E0B] font-semibold">Only 2 Days: Hassle-free size exchange guarantee</p>
          </div>
        </div>
      </section>

      {/* 8. DYNAMIC CATEGORIES SHOWCASE SESSION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-[#FAF7F2] border border-[#A0645A]/40 rounded-[22px] p-5 sm:p-6 shadow-[0_10px_30px_rgba(17,17,17,0.06)] transition-all">
          {/* Header Strip with Small Button on the Right Side */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-full bg-[#8B2E0B]/10 text-[#8B2E0B] shrink-0">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B2E0B]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base md:text-lg font-serif-luxury font-bold text-[#111111] uppercase tracking-wide">
                    ALL BOUTIQUE CATEGORIES • ATELIER ARCHIVE
                  </h3>
                  <span className="hidden sm:inline-block px-2.5 py-0.5 bg-[#8B2E0B]/15 text-[#8B2E0B] text-[10px] font-bold uppercase tracking-wider rounded-full">
                    Haute Couture
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#111111]/70">
                  {isCategoryDrawerOpen
                    ? 'Explore all handcrafted boutique categories and exclusive seasonal releases'
                    : 'Discover all boutique departments and bespoke collections'}
                </p>
              </div>
            </div>

            {/* Chota Sa Button on the Right Side */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsCategoryDrawerOpen(!isCategoryDrawerOpen)}
                className="px-3.5 sm:px-4 py-1.5 sm:py-2 bg-[#8B2E0B] hover:bg-[#111111] text-[#F5EFE6] text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-full shadow-md hover:shadow-lg flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                title={isCategoryDrawerOpen ? 'Close Categories' : 'Open Categories'}
              >
                <span>{isCategoryDrawerOpen ? 'Close' : 'View Categories'}</span>
                <span className="bg-white/20 text-white px-1.5 py-0.2 rounded-full text-[9px] font-mono leading-none">
                  {activeCategories.length}
                </span>
                {isCategoryDrawerOpen ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Collapsible Dynamic Categories Session (Expands directly underneath the button) */}
          {isCategoryDrawerOpen && (
            <div className="mt-6 pt-6 border-t border-[#A0645A]/25 animate-in fade-in slide-in-from-top-4 duration-300 space-y-5">
              <div className="flex items-center justify-between text-xs text-[#111111]/80">
                <span className="font-semibold uppercase tracking-wider text-[11px] text-[#8B2E0B]">
                  Select a category to view collection:
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {activeCategories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => handleCategoryCardClick(cat)}
                    className="group relative bg-white border border-[#A0645A]/30 hover:border-[#8B2E0B] rounded-[20px] p-3.5 cursor-pointer transition-all duration-300 hover:shadow-[0_12px_28px_rgba(139,46,11,0.18)] hover:-translate-y-1 flex flex-col justify-between"
                  >
                    {/* Category Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[12px] mb-2.5 bg-[#EAE0D1]">
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      />
                      <span className="absolute top-1.5 right-1.5 px-2 py-0.5 bg-[#111111]/85 backdrop-blur-xs text-[#FAF7F2] text-[9px] font-bold uppercase tracking-wider rounded-full">
                        {cat.gender.toUpperCase()}
                      </span>
                    </div>

                    {/* Category Title & Count */}
                    <div className="text-center space-y-0.5">
                      <h4 className="text-xs font-bold text-[#111111] group-hover:text-[#8B2E0B] transition-colors uppercase tracking-wider line-clamp-1">
                        {cat.name}
                      </h4>
                      {cat.itemCount && (
                        <p className="text-[10px] text-[#A0645A] font-mono font-medium">
                          {cat.itemCount} Garments
                        </p>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryCardClick(cat);
                      }}
                      className="mt-2.5 w-full py-1.5 text-[9px] font-bold uppercase tracking-widest text-[#8B2E0B] group-hover:text-white group-hover:bg-[#8B2E0B] border border-[#8B2E0B]/40 rounded-[14px] transition-colors"
                    >
                      BROWSE
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
