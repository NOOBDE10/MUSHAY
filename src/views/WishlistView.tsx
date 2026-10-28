import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ArrowLeft } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const { wishlist, products, navigateTo } = useShop();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 text-[#111111]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#A0645A]/25 gap-4">
        <div>
          <button
            onClick={() => navigateTo('shop')}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8B2E0B] hover:text-[#111111] transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shop</span>
          </button>
          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-[#111111] tracking-wide flex items-center gap-3">
            <Heart className="w-6 h-6 text-[#8B2E0B] fill-[#8B2E0B]" />
            PRIVATE WISHLIST ({wishlist.length})
          </h1>
        </div>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[20px] p-8 max-w-lg mx-auto shadow-sm">
          <Heart className="w-12 h-12 text-[#A0645A]/40 mx-auto" />
          <p className="text-sm font-semibold uppercase tracking-wider text-[#111111]">
            Your wishlist is empty
          </p>
          <p className="text-xs text-[#111111]/70 leading-relaxed">
            Save your favorite tailored blazers, silk gowns, and tuxedos by tapping the heart icon on any product.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="px-6 py-2.5 bg-[#8B2E0B] text-[#F5EFE6] text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-[#111111] transition-colors shadow-sm"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
