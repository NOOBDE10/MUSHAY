import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, Tag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartItemQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    discountAmount,
    total,
    freeShippingProgress,
    amountUntilFreeShipping,
    settings,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigateTo,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#A0645A]/30 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 text-[#111111]">
          {/* Header */}
          <div className="p-5 border-b border-[#262626] flex items-center justify-between bg-[#161616] text-[#FAF7F2]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#C4AD8A]" />
              <h2 className="text-sm font-serif-luxury font-bold uppercase tracking-widest text-white">
                Your Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-[#C4AD8A] hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#F5EFE6] px-5 py-3 border-b border-[#A0645A]/20">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[#111111] flex items-center gap-1.5 font-medium">
                <Truck className="w-3.5 h-3.5 text-[#8B2E0B]" />
                {amountUntilFreeShipping === 0 ? (
                  <span className="text-emerald-700 font-bold">
                    Congratulations! You unlocked FREE DELIVERY.
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#8B2E0B]">PKR {amountUntilFreeShipping.toLocaleString()}</strong> more for FREE DELIVERY
                  </span>
                )}
              </span>
              <span className="text-[#8B2E0B] font-mono font-bold text-[11px]">
                {Math.round(freeShippingProgress)}%
              </span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8B2E0B] transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
                <ShoppingBag className="w-12 h-12 text-[#A0645A]/40 mb-2 stroke-[1.5]" />
                <p className="text-sm uppercase tracking-wider text-[#111111] font-bold">
                  Your bag is currently empty
                </p>
                <p className="text-xs text-[#111111]/70 max-w-xs">
                  Discover our exclusive luxury couture pieces and elevate your wardrobe.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('shop');
                  }}
                  className="mt-4 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-[#F5EFE6] bg-[#8B2E0B] hover:bg-[#111111] transition-all rounded-[20px] shadow-sm cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 bg-white border border-[#A0645A]/25 rounded-[18px] hover:border-[#8B2E0B] transition-colors shadow-xs"
                >
                  <img
                    src={item.product.images[0] || '/src/assets/images/fashion_gold_blazer_1790533633560.jpg'}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-20 object-cover object-center rounded-[12px] bg-[#ECE4D7] border border-[#A0645A]/20 shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-red-600 p-0.5 transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#111111]/70 font-medium">
                        <span>Size: <strong className="text-[#111111]">{item.size}</strong></span>
                        <span>•</span>
                        <span>{item.color}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-[#A0645A]/30 rounded-[12px] bg-[#F5EFE6] overflow-hidden">
                        <button
                          onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-[#111111] hover:text-[#8B2E0B] transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-bold text-[#111111]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-[#111111] hover:text-[#8B2E0B] transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total for item */}
                      <span className="text-xs font-mono font-bold text-[#8B2E0B] tabular-nums">
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Coupon & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#A0645A]/20 space-y-3">
              {/* Coupon section */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-[14px] bg-[#8B2E0B]/10 border border-[#8B2E0B]/30 text-xs">
                  <div className="flex items-center gap-1.5 text-[#8B2E0B] font-bold">
                    <Tag className="w-3.5 h-3.5 text-[#8B2E0B]" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-PKR {discountAmount.toLocaleString()})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-500 hover:text-red-600 font-bold uppercase text-[10px] ml-2 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter coupon (e.g. MS10)"
                    className="flex-1 bg-[#F5EFE6] border border-[#A0645A]/30 focus:border-[#8B2E0B] text-xs px-3 py-2 text-[#111111] uppercase placeholder:text-stone-400 rounded-[14px] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#FAF7F2] hover:bg-[#8B2E0B] hover:text-white text-[#111111] transition-colors rounded-[14px] border border-[#A0645A]/30 cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponFeedback && (
                <p className={`text-[11px] ${couponFeedback.success ? 'text-emerald-700' : 'text-red-600'}`}>
                  {couponFeedback.message}
                </p>
              )}

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs text-[#111111]/80 pt-1 border-t border-[#A0645A]/20 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#111111] font-bold tabular-nums">PKR {subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon Discount</span>
                    <span className="font-mono tabular-nums">-PKR {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="font-mono tabular-nums font-bold">
                    {deliveryFee === 0 ? (
                      <span className="text-[#8B2E0B]">FREE</span>
                    ) : (
                      `PKR ${deliveryFee.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#111111] pt-2 border-t border-[#A0645A]/25">
                  <span className="uppercase tracking-wider">Estimated Total</span>
                  <span className="font-mono text-[#8B2E0B] tabular-nums text-base font-bold">
                    PKR {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 bg-[#8B2E0B] hover:bg-[#111111] text-[#F5EFE6] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-[22px] shadow-[0_8px_25px_rgba(139,46,11,0.28)] transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
