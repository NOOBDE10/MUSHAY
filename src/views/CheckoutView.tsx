import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, Lock, Tag } from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    subtotal,
    deliveryFee,
    discountAmount,
    total,
    appliedCoupon,
    placeOrder,
    navigateTo,
    settings,
    deliveryDistanceKm,
    setDeliveryDistanceKm,
  } = useShop();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Lahore',
    area: '',
    postalCode: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const majorCities = [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Sialkot',
    'Gujranwala',
    'Quetta',
    'Hyderabad',
    'Other City',
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.phone.trim()) errs.phone = 'Valid phone number is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.address.trim()) errs.address = 'Delivery address is required';
    if (!formData.area.trim()) errs.area = 'Area/Sector is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (cart.length === 0) {
      navigateTo('shop');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder(formData);
      setIsSubmitting(false);
    }, 600);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-4">
        <p className="text-sm uppercase tracking-widest text-stone-300 font-semibold">
          Your shopping bag is currently empty
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-2.5 bg-[#D4AF37] text-black text-xs font-semibold uppercase tracking-wider rounded-xs"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-[#F5EFE6] text-[#111111]">
      <button
        onClick={() => navigateTo('shop')}
        className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8B2E0B] hover:text-[#111111] transition-colors mb-8 group font-bold"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Continue Shopping</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Customer Information & Delivery Address Form */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#111111] tracking-wide">
              EXPRESS CHECKOUT
            </h1>
            <p className="text-xs text-[#111111]/70 mt-1">
              Please enter your delivery details for prompt Cash on Delivery service.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Details */}
            <div className="bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[22px] p-6 space-y-4 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#8B2E0B] border-b border-[#A0645A]/20 pb-2">
                1. Recipient Contact
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#111111] font-semibold mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Eleanor Vance"
                    className={`w-full bg-white border ${
                      errors.name ? 'border-red-500' : 'border-[#A0645A]/30'
                    } focus:border-[#8B2E0B] text-xs px-3.5 py-2.5 text-[#111111] rounded-[14px] focus:outline-none transition-colors shadow-xs`}
                  />
                  {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#111111] font-semibold mb-1">
                    Phone Number (for Courier & Tracking) *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 0300 1234567"
                    className={`w-full bg-white border ${
                      errors.phone ? 'border-red-500' : 'border-[#A0645A]/30'
                    } focus:border-[#8B2E0B] text-xs px-3.5 py-2.5 text-[#111111] rounded-[14px] focus:outline-none transition-colors shadow-xs`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#111111] font-semibold mb-1">
                  Email Address (for Order Confirmation & Tracking) *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. eleanor@email.com"
                  className={`w-full bg-white border ${
                    errors.email ? 'border-red-500' : 'border-[#A0645A]/30'
                  } focus:border-[#8B2E0B] text-xs px-3.5 py-2.5 text-[#111111] rounded-[14px] focus:outline-none transition-colors shadow-xs`}
                />
                {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Shipping Destination */}
            <div className="bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[22px] p-6 space-y-4 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#8B2E0B] border-b border-[#A0645A]/20 pb-2">
                2. Delivery Destination
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#111111] font-semibold mb-1">
                    City *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-white border border-[#A0645A]/30 focus:border-[#8B2E0B] text-xs px-3.5 py-2.5 text-[#111111] rounded-[14px] focus:outline-none transition-colors shadow-xs cursor-pointer font-medium"
                  >
                    {majorCities.map((c) => (
                      <option key={c} value={c} className="bg-white text-[#111111]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#111111] font-semibold mb-1">
                    Area / Phase / Sector *
                  </label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="e.g. DHA Phase 5 / Gulberg / F-7"
                    className={`w-full bg-white border ${
                      errors.area ? 'border-red-500' : 'border-[#A0645A]/30'
                    } focus:border-[#8B2E0B] text-xs px-3.5 py-2.5 text-[#111111] rounded-[14px] focus:outline-none transition-colors shadow-xs`}
                  />
                  {errors.area && <p className="text-[11px] text-red-500 mt-1">{errors.area}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#111111] font-semibold mb-1">
                  Complete Street Address / House / Flat / Plaza *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. House #14, Street 9, Near Central Park"
                  className={`w-full bg-white border ${
                    errors.address ? 'border-red-500' : 'border-[#A0645A]/30'
                  } focus:border-[#8B2E0B] text-xs px-3.5 py-2.5 text-[#111111] rounded-[14px] focus:outline-none transition-colors shadow-xs`}
                />
                {errors.address && <p className="text-[11px] text-red-500 mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#111111] font-semibold mb-1">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="e.g. 54000"
                    className="w-full bg-white border border-[#A0645A]/30 focus:border-[#8B2E0B] text-xs px-3.5 py-2.5 text-[#111111] rounded-[14px] focus:outline-none transition-colors shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#111111] font-semibold mb-1">
                    Order Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Call before delivery"
                    className="w-full bg-white border border-[#A0645A]/30 focus:border-[#8B2E0B] text-xs px-3.5 py-2.5 text-[#111111] rounded-[14px] focus:outline-none transition-colors shadow-xs"
                  />
                </div>
              </div>

              {/* Nationwide Luxury Express Courier */}
              <div className="p-4 sm:p-5 bg-white border border-[#A0645A]/30 rounded-[20px] space-y-3 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#A0645A]/20 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-full bg-[#8B2E0B]/10 text-[#8B2E0B]">
                      <Truck className="w-4 h-4 text-[#8B2E0B]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#111111] block">
                        Nationwide Express Courier
                      </span>
                      <span className="text-[11px] text-[#555555]">
                        Insured & Tracked Dispatch across Pakistan
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-mono px-3 py-1 bg-[#FAF7F2] border border-[#A0645A]/30 rounded-full text-[#8B2E0B] self-start sm:self-auto">
                    {deliveryFee === 0 ? 'COMPLIMENTARY (FREE)' : `PKR ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>

                {subtotal >= (settings.freeShippingThreshold || 500) ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-[14px] flex items-center gap-2.5 text-xs text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      ✨ <strong>Complimentary Luxury Delivery:</strong> Your order qualifies for 100% free insured express shipping.
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-[#FAF7F2] border border-[#A0645A]/25 rounded-[14px] flex items-center justify-between text-xs text-[#111111]">
                    <span>Standard Express Shipping across Pakistan</span>
                    <span className="text-[#8B2E0B] font-mono font-bold">
                      PKR {deliveryFee.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[10px] text-[#666666] uppercase tracking-wider font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B2E0B]" />
                    <span>2–4 Business Days</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B2E0B]" />
                    <span>Cash On Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B2E0B]" />
                    <span>Luxury Sealed Pack</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method (Cash on Delivery) */}
            <div className="bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[22px] p-6 space-y-3 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#8B2E0B] border-b border-[#A0645A]/20 pb-2">
                3. Payment Method
              </h2>

              <div className="flex items-start gap-3 p-4 bg-white border border-[#A0645A]/30 rounded-[18px]">
                <CheckCircle2 className="w-5 h-5 text-[#8B2E0B] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                    Cash on Delivery (COD) Nationwide
                  </span>
                  <p className="text-[11px] text-[#111111]/70 leading-relaxed">
                    Pay the total balance in Pakistani Rupees directly to the courier rider upon delivery. No advance payment required.
                  </p>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-[#8B2E0B] hover:bg-[#111111] text-[#F5EFE6] font-bold text-sm uppercase tracking-[0.2em] rounded-[22px] shadow-[0_8px_25px_rgba(139,46,11,0.28)] transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.01] active:scale-98"
            >
              {isSubmitting ? (
                <span>CONFIRMING ORDER...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>PLACE ORDER — PKR {total.toLocaleString()}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[24px] p-6 space-y-6 sticky top-28 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#111111] border-b border-[#A0645A]/20 pb-3">
              Order Summary ({cart.reduce((a, b) => a + b.quantity, 0)} Items)
            </h3>

            {/* Item Mini Cards */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-[#A0645A]/15">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 pt-3 first:pt-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-16 object-cover object-center rounded-[12px] bg-[#ECE4D7] border border-[#A0645A]/20 shrink-0"
                  />
                  <div className="flex-1 text-xs">
                    <h4 className="font-bold text-[#111111] uppercase tracking-wider line-clamp-1">
                      {item.product.name}
                    </h4>
                    <p className="text-[#111111]/70 text-[11px] mt-0.5">
                      Size: {item.size} • {item.color}
                    </p>
                    <div className="flex justify-between items-center mt-2 text-[#111111] font-mono">
                      <span>Qty: {item.quantity}</span>
                      <span className="font-bold text-[#8B2E0B] tabular-nums">
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-2 text-xs border-t border-[#A0645A]/20 pt-4 font-medium">
              <div className="flex justify-between text-[#111111]/80">
                <span>Subtotal</span>
                <span className="font-mono text-[#111111] font-bold tabular-nums">PKR {subtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span className="font-mono tabular-nums">-PKR {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-[#111111]/80">
                <span>Shipping & Courier (Nationwide Express)</span>
                <span className="font-mono tabular-nums">
                  {deliveryFee === 0 ? (
                    <span className="text-[#8B2E0B] font-bold">FREE (Complimentary)</span>
                  ) : (
                    `PKR ${deliveryFee.toLocaleString()}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-[#111111] pt-3 border-t border-[#A0645A]/25">
                <span className="uppercase tracking-wider">Total Amount Due</span>
                <span className="font-mono text-[#8B2E0B] tabular-nums text-lg font-bold">
                  PKR {total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Assurance Trust Badges */}
            <div className="pt-2 border-t border-[#A0645A]/20 space-y-2 text-[11px] text-[#111111]/70 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8B2E0B] shrink-0" />
                <span>Verified authentic {settings.brandName || 'MUSHAY'} garment packaging</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#8B2E0B] shrink-0" />
                <span>Express courier tracking generated upon confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
