import React, { useEffect, useCallback } from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle, Truck, Package, MessageCircle, ArrowRight, Printer, Sparkles, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

export const OrderConfirmationView: React.FC = () => {
  const { lastPlacedOrder, navigateTo, settings, setIsWhatsAppModalOpen } = useShop();

  const triggerCelebrationConfetti = useCallback(() => {
    // 5 seconds continuous canvas-based confetti celebration
    const duration = 5 * 1000;
    const end = Date.now() + duration;

    // Vibrant random celebration colors
    const colors = [
      '#D4AF37', '#FFD700', '#25D366', '#8B2E0B', '#E11D48',
      '#3B82F6', '#8B5CF6', '#FF1493', '#00FFFF', '#FFA500',
      '#A855F7', '#EC4899', '#22C55E', '#38BDF8', '#F59E0B'
    ];

    // Initial festive burst
    confetti({
      particleCount: 180,
      spread: 100,
      startVelocity: 45,
      origin: { y: 0.6 },
      colors,
      zIndex: 9999,
    });

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = end - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleRatio = timeLeft / duration;

      // Left cannon
      confetti({
        particleCount: Math.max(15, Math.floor(45 * particleRatio)),
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.65 },
        colors,
        zIndex: 9999,
      });

      // Right cannon
      confetti({
        particleCount: Math.max(15, Math.floor(45 * particleRatio)),
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.65 },
        colors,
        zIndex: 9999,
      });

      // Mid-sky bursts
      confetti({
        particleCount: Math.max(10, Math.floor(25 * particleRatio)),
        spread: 75,
        startVelocity: 30,
        origin: { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.4 + 0.2 },
        colors,
        zIndex: 9999,
      });
    }, 250);
  }, []);

  useEffect(() => {
    if (lastPlacedOrder) {
      triggerCelebrationConfetti();
    }
  }, [lastPlacedOrder, triggerCelebrationConfetti]);

  if (!lastPlacedOrder) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-4">
        <p className="text-stone-300">No recent order found.</p>
        <button
          onClick={() => navigateTo('home')}
          className="px-6 py-2.5 bg-[#D4AF37] text-black text-xs font-semibold uppercase tracking-wider rounded-[20px]"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleConciergeWhatsApp = () => {
    setIsWhatsAppModalOpen(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8 animate-fadeIn text-[#111111]">
      {/* Top Success Banner with Confetti Celebration */}
      <div className="text-center space-y-3">
        <div className="relative inline-block">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-600 text-emerald-700 mb-2 shadow-[0_8px_25px_rgba(30,126,52,0.2)]">
            <CheckCircle className="w-10 h-10" />
          </div>
          <button
            type="button"
            onClick={triggerCelebrationConfetti}
            title="Click to celebrate again!"
            className="absolute -top-1 -right-2 p-2 bg-[#8B2E0B] hover:bg-[#111111] text-white rounded-full shadow-md transition-transform hover:scale-110 cursor-pointer"
          >
            <PartyPopper className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#8B2E0B]/10 border border-[#8B2E0B]/25 rounded-full text-[#8B2E0B] text-xs font-bold uppercase tracking-widest">
            <span>Order Placed Successfully • Atelier Confirmed</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#111111] tracking-wide">
            ORDER CONFIRMED
          </h1>
        </div>

        <p className="text-sm text-[#111111]/80 max-w-md mx-auto">
          Thank you for choosing <strong className="text-[#111111]">{settings.brandName || 'MUSHAY'}</strong>,{' '}
          <span className="text-[#8B2E0B] font-bold">{lastPlacedOrder.customerName}</span>. Your garments are now being prepared for dispatch.
        </p>

        <div className="pt-1">
          <button
            type="button"
            onClick={triggerCelebrationConfetti}
            className="px-4 py-1.5 bg-[#FAF7F2] hover:bg-[#8B2E0B] hover:text-white border border-[#A0645A]/40 text-[#8B2E0B] text-xs font-bold uppercase tracking-wider rounded-full transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <PartyPopper className="w-3.5 h-3.5" />
            <span>Replay Celebration 🎉</span>
          </button>
        </div>
      </div>

      {/* Order Highlights Box: Radius 22px */}
      <div className="bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[22px] p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#A0645A]/20">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#8B2E0B] font-bold block">
              Official Order Reference
            </span>
            <span className="text-xl sm:text-2xl font-mono font-bold text-[#111111] tracking-wider">
              {lastPlacedOrder.orderNumber}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white border border-[#A0645A]/30 hover:border-[#8B2E0B] text-[#111111] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 rounded-[14px] transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#8B2E0B]" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={() => navigateTo('track-order')}
              className="px-4 py-2 bg-[#8B2E0B] text-white text-xs font-bold uppercase tracking-wider rounded-[14px] hover:bg-[#111111] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Status</span>
            </button>
          </div>
        </div>

        {/* Customer & Destination Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#111111]/80 border-b border-[#A0645A]/20 pb-6">
          <div className="p-4 bg-white border border-[#A0645A]/25 rounded-[18px] shadow-xs">
            <h4 className="font-bold uppercase tracking-widest text-[#8B2E0B] mb-2">Recipient</h4>
            <p className="text-[#111111] font-bold">{lastPlacedOrder.customerName}</p>
            <p>{lastPlacedOrder.customerPhone}</p>
            <p>{lastPlacedOrder.customerEmail}</p>
          </div>

          <div className="p-4 bg-white border border-[#A0645A]/25 rounded-[18px] shadow-xs">
            <h4 className="font-bold uppercase tracking-widest text-[#8B2E0B] mb-2">Destination</h4>
            <p className="text-[#111111] font-bold">{lastPlacedOrder.address}</p>
            <p>{lastPlacedOrder.area}, {lastPlacedOrder.city}</p>
            <p>Pakistan {lastPlacedOrder.postalCode ? `(${lastPlacedOrder.postalCode})` : ''}</p>
          </div>

          <div className="p-4 bg-white border border-[#A0645A]/25 rounded-[18px] shadow-xs">
            <h4 className="font-bold uppercase tracking-widest text-[#8B2E0B] mb-2">Payment</h4>
            <p className="text-[#111111] font-bold">{lastPlacedOrder.paymentMethod}</p>
            <p className="text-emerald-700 font-semibold">Payment on Unboxing</p>
            <p className="text-[#111111]/60 mt-1">Status: Initial Verification</p>
          </div>
        </div>

        {/* Garments Table */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-widest font-bold text-[#111111]">
            Order Items ({lastPlacedOrder.items.length})
          </h4>
          <div className="space-y-2.5">
            {lastPlacedOrder.items.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-white border border-[#A0645A]/25 rounded-[16px] flex items-center justify-between gap-4 text-xs shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-12 h-14 object-cover object-center rounded-[10px] bg-[#ECE4D7] border border-[#A0645A]/20 shrink-0"
                  />
                  <div>
                    <h5 className="font-bold text-[#111111] uppercase tracking-wider">
                      {item.product.name}
                    </h5>
                    <p className="text-[#111111]/70 text-[11px]">
                      Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono font-bold text-[#8B2E0B] tabular-nums">
                  PKR {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="border-t border-[#A0645A]/20 pt-4 space-y-2 text-xs text-[#111111]/80 font-medium">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono text-[#111111] font-bold tabular-nums">PKR {lastPlacedOrder.subtotal.toLocaleString()}</span>
          </div>

          {lastPlacedOrder.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Promotional Discount</span>
              <span className="font-mono tabular-nums">-PKR {lastPlacedOrder.discount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="font-mono tabular-nums font-bold">
              {lastPlacedOrder.deliveryFee === 0 ? (
                <span className="text-[#8B2E0B]">FREE</span>
              ) : (
                `PKR ${lastPlacedOrder.deliveryFee.toLocaleString()}`
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm sm:text-base font-bold text-[#111111] pt-3 border-t border-[#A0645A]/25">
            <span className="uppercase tracking-wider">Total Cash on Delivery</span>
            <span className="font-mono text-[#8B2E0B] tabular-nums text-lg font-bold">
              PKR {lastPlacedOrder.total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Post-order Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={() => navigateTo('track-order')}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#8B2E0B] hover:bg-[#111111] text-[#F5EFE6] font-bold text-xs uppercase tracking-widest rounded-[22px] shadow-sm transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Truck className="w-4 h-4" />
          <span>Real-Time Order Tracker</span>
        </button>

        <button
          onClick={handleConciergeWhatsApp}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#1E7E34] hover:bg-[#155D27] text-white font-bold text-xs uppercase tracking-widest rounded-[22px] transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Contact WhatsApp Concierge</span>
        </button>

        <button
          onClick={() => navigateTo('shop')}
          className="w-full sm:w-auto px-6 py-3.5 bg-white border border-[#A0645A]/30 hover:border-[#8B2E0B] text-[#111111] font-bold text-xs uppercase tracking-widest rounded-[22px] transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <span>Continue Browsing</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
