import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  Check,
  ArrowLeft,
  Ruler,
  MessageCircle,
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const {
    products,
    selectedProductId,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo,
    settings,
  } = useShop();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Signature Rust');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'fabric' | 'care' | 'shipping'>('desc');
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const variantKey = `${selectedSize}_${selectedColor}`;
  const variantStock = product.variantStock[variantKey] ?? product.stock;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    const res = addToCart(product, selectedSize, selectedColor, quantity);
    if (res.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigateTo('checkout');
  };

  const handleWhatsAppInquiry = () => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${settings.brandName || 'MUSHAY'}! I am interested in purchasing "${product.name}" (SKU: ${product.sku}) in size ${selectedSize}. Please provide assistance.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-[#F5EFE6] text-[#111111]">
      {/* Back to shop navigation */}
      <button
        onClick={() => navigateTo('shop')}
        className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8B2E0B] hover:text-[#111111] transition-colors mb-6 group font-bold"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Return to Catalog</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Left: Product Images Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] w-full bg-[#FAF7F2] rounded-[22px] overflow-hidden border border-[#A0645A]/30 shadow-md">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />

            {/* Top Center Logo inside picture view */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#FAF7F2]/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#9A6652]/30 shadow-xs">
              <span className="text-xs font-serif-luxury font-bold text-[#8F3500] tracking-widest select-none uppercase">
                {settings.brandName || 'MUSHAY'}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-24 rounded-[14px] overflow-hidden border transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#8F3500] ring-2 ring-[#8F3500]'
                      : 'border-[#9A6652]/30 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details, Selectors, and Purchase CTA (Box 20px Over) */}
        <div className="flex flex-col justify-between space-y-6 bg-[#FAF7F2] p-6 sm:p-8 rounded-[20px] border border-[#9A6652]/30 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.25em] text-[#8F3500] font-bold">
                {product.category} • {product.gender.toUpperCase()}
              </span>
              <span className="text-xs text-[#171717]/60 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-[#171717] tracking-wide">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-[#8F3500]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-[#8F3500]' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-[#171717]">{product.rating}</span>
              <span className="text-xs text-[#171717]/70">({product.reviewCount} verified client reviews)</span>
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-4 py-2 border-y border-[#9A6652]/25">
              <span className="text-2xl sm:text-3xl font-bold text-[#8F3500] font-mono tabular-nums">
                PKR {product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-stone-400 line-through font-mono tabular-nums">
                  PKR {product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.discountPercent > 0 && (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-[#8F3500]/15 text-[#8F3500] rounded-full">
                  SAVE {product.discountPercent}%
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#171717]/85 leading-relaxed font-normal">
              {product.description}
            </p>

            {/* Size Selector + Size Guide */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-[#171717]">
                  Select Size
                </span>
                <button
                  onClick={() => setShowSizeModal(true)}
                  className="flex items-center gap-1 text-[#8F3500] font-semibold hover:underline"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((size) => {
                  const vStock = product.variantStock[`${size}_${selectedColor}`] ?? product.stock;
                  const isAvailable = vStock > 0;
                  return (
                    <button
                      key={size}
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-[12px] border transition-all ${
                        selectedSize === size
                          ? 'bg-[#8F3500] text-white border-[#8F3500] shadow-sm'
                          : isAvailable
                          ? 'bg-white text-[#171717] border-[#9A6652]/30 hover:border-[#8F3500]'
                          : 'bg-stone-200 text-stone-400 border-stone-300 line-through cursor-not-allowed'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] text-[#171717]/70 pt-1">
                Variant Availability:{' '}
                <strong className={variantStock > 0 ? 'text-emerald-700' : 'text-red-600'}>
                  {variantStock > 0 ? `${variantStock} pieces in stock` : 'Currently Sold Out'}
                </strong>
              </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#171717] block">
                Color: <span className="text-[#8F3500]">{selectedColor}</span>
              </span>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-full border transition-all ${
                      selectedColor === color.name
                        ? 'border-[#8F3500] bg-[#8F3500]/10 text-[#8F3500] font-bold'
                        : 'border-[#9A6652]/30 bg-white text-[#171717] hover:border-[#8F3500]'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-stone-400"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-3 pt-4">
              <div className="flex gap-3">
                {/* Stepper */}
                <div className="flex items-center border border-[#9A6652]/40 rounded-[20px] bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-3 text-[#171717] hover:text-[#8F3500]"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-bold text-[#171717]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(variantStock, q + 1))}
                    disabled={quantity >= variantStock}
                    className="px-3.5 py-3 text-[#171717] hover:text-[#8F3500] disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={variantStock <= 0}
                  className={`flex-1 py-3.5 px-6 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-[20px] border transition-all shadow-xs ${
                    justAdded
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : variantStock <= 0
                      ? 'bg-stone-300 text-stone-500 border-stone-300 cursor-not-allowed'
                      : 'bg-[#8F3500] text-white hover:bg-[#732A00] border-transparent'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Shopping Bag
                    </>
                  ) : variantStock <= 0 ? (
                    'Sold Out'
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </>
                  )}
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Wishlist toggle"
                  className={`p-3.5 border rounded-[20px] transition-colors ${
                    inWishlist
                      ? 'bg-[#8F3500] text-white border-[#8F3500]'
                      : 'border-[#9A6652]/40 bg-white text-[#171717] hover:text-[#8F3500]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Instant Buy Now Button */}
              <button
                onClick={handleBuyNow}
                disabled={variantStock <= 0}
                className="w-full py-3.5 px-6 bg-[#171717] hover:bg-[#2A1E17] text-[#FAF7F2] font-bold text-xs uppercase tracking-widest rounded-[20px] shadow-sm transition-all"
              >
                Instant Buy (Cash on Delivery)
              </button>

              {/* Ask about this product on WhatsApp */}
              <button
                onClick={handleWhatsAppInquiry}
                className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-600/40 text-emerald-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-[20px] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Inquire About This Garment on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="border-t border-[#9A6652]/25 pt-6 space-y-4">
            <div className="flex border-b border-[#9A6652]/25 gap-6 text-xs uppercase tracking-wider font-bold">
              <button
                onClick={() => setActiveTab('desc')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === 'desc'
                    ? 'border-[#8F3500] text-[#8F3500]'
                    : 'border-transparent text-[#171717]/60 hover:text-[#171717]'
                }`}
              >
                Fabrication & Fit
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === 'care'
                    ? 'border-[#8F3500] text-[#8F3500]'
                    : 'border-transparent text-[#171717]/60 hover:text-[#171717]'
                }`}
              >
                Care Guide
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === 'shipping'
                    ? 'border-[#8F3500] text-[#8F3500]'
                    : 'border-transparent text-[#171717]/60 hover:text-[#171717]'
                }`}
              >
                Shipping & COD
              </button>
            </div>

            <div className="text-xs text-[#171717]/85 leading-relaxed min-h-[80px]">
              {activeTab === 'desc' && (
                <div className="space-y-1.5">
                  <p><strong>Material:</strong> {product.material}</p>
                  <p><strong>Fabric Construction:</strong> {product.fabric}</p>
                  <p><strong>Silhouetted Fit:</strong> {product.fit}</p>
                </div>
              )}
              {activeTab === 'care' && (
                <ul className="list-disc list-inside space-y-1 text-[#171717]/80">
                  {product.careInstructions?.map((c, i) => (
                    <li key={i}>{c}</li>
                  )) || (
                    <>
                      <li>Specialist dry cleaning strongly recommended</li>
                      <li>Steam iron with cloth barrier; do not iron metallic embellishments directly</li>
                      <li>Store in provided breathable luxury garment bag on structured hanger</li>
                    </>
                  )}
                </ul>
              )}
              {activeTab === 'shipping' && (
                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 text-[#8F3500] font-bold">
                    <Truck className="w-3.5 h-3.5" />
                    Complimentary White-Glove Delivery
                  </p>
                  <p>
                    All orders exceeding PKR {settings.freeShippingThreshold.toLocaleString()} qualify for free express shipping. Cash on Delivery is available nationwide across Karachi, Lahore, Islamabad, Faisalabad, and 200+ cities in Pakistan. Delivery within 2-4 business days.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products / Complete Your Look */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-[#9A6652]/30 space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-[0.3em] text-[#8F3500] font-bold">
              Curated Recommendations
            </span>
            <h3 className="text-2xl font-serif-luxury font-bold text-[#171717] tracking-wide">
              COMPLETE YOUR LOOK
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowSizeModal(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative bg-[#FAF7F2] border border-[#9A6652]/50 rounded-[20px] p-6 max-w-lg w-full z-10 shadow-2xl space-y-4 text-[#171717]">
            <div className="flex justify-between items-center border-b border-[#9A6652]/25 pb-3">
              <h4 className="text-sm font-bold uppercase tracking-widest text-[#8F3500]">
                {settings.brandName || 'MUSHAY'} Standard Haute Couture Size Matrix (Inches)
              </h4>
              <button
                onClick={() => setShowSizeModal(false)}
                className="text-stone-500 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>
            <table className="w-full text-xs text-left text-[#171717]">
              <thead className="bg-[#ECE4D7] text-[#8F3500]">
                <tr>
                  <th className="p-2">Size</th>
                  <th className="p-2">Chest</th>
                  <th className="p-2">Waist</th>
                  <th className="p-2">Hip</th>
                  <th className="p-2">Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#9A6652]/20">
                <tr><td className="p-2 font-semibold">XS</td><td className="p-2">34"</td><td className="p-2">26"</td><td className="p-2">36"</td><td className="p-2">26"</td></tr>
                <tr><td className="p-2 font-semibold">S</td><td className="p-2">36"</td><td className="p-2">28"</td><td className="p-2">38"</td><td className="p-2">27"</td></tr>
                <tr><td className="p-2 font-semibold">M</td><td className="p-2">38"</td><td className="p-2">30"</td><td className="p-2">40"</td><td className="p-2">28"</td></tr>
                <tr><td className="p-2 font-semibold">L</td><td className="p-2">40"</td><td className="p-2">32"</td><td className="p-2">42"</td><td className="p-2">29"</td></tr>
                <tr><td className="p-2 font-semibold">XL</td><td className="p-2">43"</td><td className="p-2">35"</td><td className="p-2">45"</td><td className="p-2">30"</td></tr>
                <tr><td className="p-2 font-semibold">XXL</td><td className="p-2">46"</td><td className="p-2">38"</td><td className="p-2">48"</td><td className="p-2">31"</td></tr>
              </tbody>
            </table>
            <p className="text-[11px] text-[#171717]/70">
              Tailored fit guidelines: For relaxed wear, choose one size up. Contact our concierge for bespoke body measurement tailoring.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
