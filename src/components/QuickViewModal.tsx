import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { X, Check, ShoppingBag, Star } from 'lucide-react';

interface QuickViewContentProps {
  product: Product;
  onClose: () => void;
}

const QuickViewContent: React.FC<QuickViewContentProps> = ({ product, onClose }) => {
  const { addToCart, navigateTo, settings } = useShop();

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Black | Gold Accent');
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const variantKey = `${selectedSize}_${selectedColor}`;
  const variantStock = product.variantStock[variantKey] ?? product.stock;

  const handleAdd = () => {
    const res = addToCart(product, selectedSize, selectedColor, quantity);
    if (res.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const handleFullDetails = () => {
    const id = product.id;
    onClose();
    navigateTo('product-detail', id);
  };

  const handleWhatsAppInquiry = () => {
    const cleanNumber = (settings.whatsappNumber || '03001234567').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello MUSHAY! I am interested in purchasing "${product.name}" (SKU: ${product.sku}) in size ${selectedSize}, color ${selectedColor}. Price: PKR ${product.price}. Please provide order assistance.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[22px] shadow-2xl p-6 md:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-500 hover:text-black p-1.5 rounded-full hover:bg-stone-200/50 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Image Preview */}
            <div className="relative aspect-[3/4] bg-[#ECE4D7] rounded-[18px] overflow-hidden border border-[#A0645A]/20">
              <img
                src={product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-3 left-3 bg-[#FAF7F2]/95 border border-[#A0645A]/30 px-3 py-1 rounded-full shadow-xs">
                <span className="text-[10px] font-serif-luxury font-bold text-[#8B2E0B] tracking-widest">
                  {settings.brandName || 'MUSHAY'}
                </span>
              </div>
            </div>

            {/* Info and Selectors */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#8B2E0B] mb-1">
                  <Star className="w-3.5 h-3.5 fill-[#8B2E0B]" />
                  <span className="font-semibold text-[#111111]">{product.rating}</span>
                  <span className="text-stone-500">({product.reviewCount} reviews)</span>
                </div>

                <h3 className="text-lg md:text-xl font-bold uppercase tracking-wider text-[#111111]">
                  {product.name}
                </h3>

                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xl font-bold text-[#8B2E0B] font-mono tabular-nums">
                    PKR {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-stone-400 line-through font-mono tabular-nums">
                      PKR {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#55504A] mt-3 leading-relaxed">
                  {product.shortDescription || product.description}
                </p>
              </div>

              {/* Size Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-[#111111]">Select Size</span>
                  <span className="text-[11px] text-stone-500">
                    Stock: <strong className={variantStock > 0 ? 'text-emerald-700' : 'text-red-600'}>{variantStock > 0 ? `${variantStock} available` : 'Out of Stock'}</strong>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-[12px] border transition-all ${
                        selectedSize === size
                          ? 'bg-[#8B2E0B] text-white border-[#8B2E0B] shadow-xs'
                          : 'bg-white text-[#111111] border-[#A0645A]/30 hover:border-[#8B2E0B]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#111111] block">
                  Color: <span className="text-[#8B2E0B] font-bold">{selectedColor}</span>
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-[12px] border transition-all ${
                        selectedColor === color.name
                          ? 'border-[#8B2E0B] bg-[#8B2E0B]/10 text-[#8B2E0B] font-bold'
                          : 'border-[#A0645A]/30 bg-white text-[#55504A] hover:border-[#8B2E0B]'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-stone-300" style={{ backgroundColor: color.hex }} />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-3 pt-2">
                <div className="flex gap-3">
                  <div className="flex items-center border border-[#A0645A]/30 rounded-[14px] bg-white">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-stone-600 hover:text-black font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-mono font-bold text-[#111111]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(variantStock, q + 1))}
                      disabled={quantity >= variantStock}
                      className="px-3 py-2 text-stone-600 hover:text-black disabled:opacity-30 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAdd}
                    disabled={variantStock <= 0}
                    className={`flex-1 py-3 px-4 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-[16px] border transition-all shadow-xs ${
                      justAdded
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : variantStock <= 0
                        ? 'bg-stone-200 text-stone-400 border-stone-300 cursor-not-allowed'
                        : 'bg-[#8B2E0B] hover:bg-[#702407] text-white border-[#8B2E0B]'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Bag
                      </>
                    ) : variantStock <= 0 ? (
                      'Out of Stock'
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" /> Add to Cart
                      </>
                    )}
                  </button>
                </div>

                {/* Fabric & SKU Highlights */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#55504A] py-2.5 border-y border-[#A0645A]/20">
                  <div>
                    <span className="text-stone-400 uppercase font-semibold block text-[10px]">Fabric / Material</span>
                    <span className="text-[#111111] font-medium">{product.fabric || 'Pure Mulberry Silk & Wool'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 uppercase font-semibold block text-[10px]">SKU Reference</span>
                    <span className="text-[#8B2E0B] font-mono font-bold">{product.sku}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleWhatsAppInquiry}
                    className="flex-1 py-2.5 px-3 bg-[#1E7E34] hover:bg-[#165F26] text-white font-bold text-xs uppercase tracking-wider rounded-[14px] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>Inquire WhatsApp</span>
                  </button>

                  <button
                    onClick={handleFullDetails}
                    className="flex-1 py-2.5 px-3 text-xs uppercase tracking-wider text-[#111111] hover:text-[#8B2E0B] border border-[#A0645A]/40 hover:border-[#8B2E0B] rounded-[14px] bg-white transition-colors text-center font-bold shadow-xs"
                  >
                    Full Details →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct } = useShop();

  if (!quickViewProduct) return null;

  return (
    <QuickViewContent
      key={quickViewProduct.id}
      product={quickViewProduct}
      onClose={() => setQuickViewProduct(null)}
    />
  );
};
