import React, { useState } from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Heart, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isDealCard?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isDealCard = false }) => {
  const {
    settings,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo,
    setQuickViewProduct,
  } = useShop();

  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [selectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor] = useState<string>(product.colors[0]?.name || 'Signature Rust');

  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = addToCart(product, selectedSize, selectedColor, 1);
    if (res.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const primaryImage = product.images[0] || '/src/assets/images/fashion_gold_blazer_1790533633560.jpg';
  const secondaryImage = product.images[1] || primaryImage;

  // Format clean department and subcategory without repetitive brackets
  const departmentName = product.gender === 'women' ? "Women's" : product.gender === 'men' ? "Men's" : product.gender === 'child' ? "Children's" : '';
  const subcategoryDisplay = product.subcategory || product.category;

  return (
    <div
      onClick={() => navigateTo('product-detail', product.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex flex-col bg-gradient-to-b from-[#FAF7F2] via-[#FAF7F2] to-[#F1E8DC] border border-[#A0645A]/30 hover:border-[#8B2E0B] p-5 sm:p-6 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] shadow-[0_8px_25px_rgba(17,17,17,0.07)] hover:shadow-[0_22px_45px_rgba(17,17,17,0.14),0_6px_16px_rgba(160,100,90,0.2)] cursor-pointer ${
        isDealCard ? 'rounded-md' : 'rounded-[24px]'
      }`}
    >
      {/* Deal Card Badge for special promotions */}
      {isDealCard && (
        <div className="mb-2.5 flex items-center justify-between">
          <span className="px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase bg-[#8B2E0B] text-white rounded-md shadow-xs">
            ATELIER DEAL
          </span>
          <span className="text-[10px] font-serif-luxury font-bold tracking-wider text-[#8B2E0B]">
            {settings.brandName || 'MUSHAY'}
          </span>
        </div>
      )}

      {/* Product Image Showcase with Smooth Hover Zoom */}
      <div className={`relative aspect-[3/4] w-full overflow-hidden bg-[#ECE4D7] mb-3.5 shadow-inner ${
        isDealCard ? 'rounded-md' : 'rounded-[18px]'
      }`}>
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
        />

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.isNew && (
            <span className="px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-[#8B2E0B] text-white rounded-full shadow-xs">
              NEW
            </span>
          )}
          {product.isBestSeller && !product.isNew && (
            <span className="px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-[#111111] text-[#FAF7F2] rounded-full shadow-xs">
              BEST SELLER
            </span>
          )}
          {product.isSale && (
            <span className="px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-[#A0645A] text-white rounded-full shadow-xs">
              SALE -{product.discountPercent}%
            </span>
          )}
        </div>

        {/* Quick Action Overlay Buttons (Wishlist & Quick View) */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleWishlistClick}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            title="Add to Wishlist"
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
              inWishlist
                ? 'bg-[#8B2E0B] text-white shadow-md'
                : 'bg-white/90 text-[#111111] hover:text-[#8B2E0B] hover:bg-white shadow-xs'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-white' : ''}`} />
          </button>

          <button
            onClick={handleQuickView}
            aria-label="Quick preview product"
            title="Inspect Details"
            className="p-2 rounded-full bg-white/90 text-[#111111] hover:text-[#8B2E0B] hover:bg-white backdrop-blur-md transition-colors duration-200 shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow justify-between text-center space-y-1.5">
        <h3 className="text-xs md:text-sm font-semibold tracking-wider uppercase text-[#111111] group-hover:text-[#8B2E0B] transition-colors line-clamp-1 font-serif-luxury">
          {product.name}
        </h3>

        {/* Clean Luxury Category & Department (No messy repetitive brackets) */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#A0645A] font-medium tracking-wider uppercase">
          <span>{subcategoryDisplay}</span>
          {departmentName && (
            <>
              <span className="text-[#C4AD8A]">•</span>
              <span className="text-[#8B2E0B] font-semibold">{departmentName}</span>
            </>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="text-sm md:text-base font-bold text-[#8B2E0B] font-mono tabular-nums">
            PKR {product.price.toLocaleString()}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-[#A0645A]/70 line-through font-mono tabular-nums">
              PKR {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Action Button: ADD TO CART */}
        <div className="pt-2">
          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className={`w-full py-2.5 px-3 text-[11px] uppercase tracking-widest font-bold transition-all duration-200 flex items-center justify-center gap-1.5 rounded-[20px] shadow-xs ${
              justAdded
                ? 'bg-emerald-700 text-white'
                : product.stock <= 0
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-[#8B2E0B] hover:bg-[#111111] text-[#F5EFE6] active:scale-95'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added to Bag
              </>
            ) : product.stock <= 0 ? (
              'Sold Out'
            ) : (
              'Add to Bag'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
