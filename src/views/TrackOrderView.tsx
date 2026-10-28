import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Order, OrderStatus } from '../types';
import {
  Search,
  CheckCircle2,
  Circle,
  Truck,
  ShieldCheck,
  MapPin,
  Calendar,
  Copy,
  Clock,
  PhoneCall,
} from 'lucide-react';

export const TrackOrderView: React.FC = () => {
  const { orders, lastPlacedOrder, products, settings, setIsWhatsAppModalOpen } = useShop();

  const [searchQuery, setSearchQuery] = useState(lastPlacedOrder?.orderNumber || 'ORD-98745');
  const [phoneQuery, setPhoneQuery] = useState('');
  const [copiedAWB, setCopiedAWB] = useState(false);

  // Status milestones
  const statusMilestones: { status: OrderStatus; title: string; desc: string; icon: string }[] = [
    { status: 'Pending', title: 'Order Placed', desc: 'Order received & logged into production schedule', icon: '📝' },
    { status: 'Confirmed', title: 'Concierge Confirmed', desc: 'Order & delivery verified by client concierge', icon: '✓' },
    { status: 'Processing', title: 'Tailoring Inspection', desc: 'Garment undergoing fine QA & hand finishing', icon: '✂️' },
    { status: 'Packed', title: 'Signature Gift Sealed', desc: 'Packaged in signature MUSHAY presentation box', icon: '🎁' },
    { status: 'Shipped', title: 'Handed to Express Courier', desc: 'Dispatched from Central Hub with express Airway Bill', icon: '🛫' },
    { status: 'Out for Delivery', title: 'Out with White-Glove Rider', desc: 'Courier driver en route for doorstep presentation', icon: '🚚' },
    { status: 'Delivered', title: 'Delivered & Payment Settled', desc: 'Consignment handed over to recipient. COD collected.', icon: '🏆' },
  ];

  // Helper to generate a mock order when user searches an ID not in system
  const generateMockOrder = (orderNum: string): Order => {
    const cleanId = orderNum.trim().toUpperCase() || 'ORD-88219';
    const sampleProduct = products[0] || {
      id: 'mock-1',
      name: 'Signature Tailored Blazer & Suit',
      price: 38500,
      images: ['/src/assets/images/fashion_gold_blazer_1790533633560.jpg'],
      category: 'Men',
    };

    const now = new Date();
    const createdDate = new Date(now.getTime() - 2 * 86400000);

    return {
      id: `sim-${Date.now()}`,
      orderNumber: cleanId,
      customerName: 'Bespoke Client',
      customerEmail: 'client@mushay.com',
      customerPhone: phoneQuery.trim() || '+92 300 1234567',
      address: 'House 14, Street 9, Gulberg III',
      city: 'Lahore',
      area: 'Gulberg',
      items: [
        {
          id: 'sim-item-1',
          productId: sampleProduct.id,
          product: sampleProduct,
          size: 'M',
          color: 'Signature Rust',
          quantity: 1,
          price: sampleProduct.price,
        },
      ],
      subtotal: sampleProduct.price,
      deliveryFee: 0,
      discount: 0,
      total: sampleProduct.price,
      paymentMethod: 'Cash on Delivery',
      status: 'Shipped',
      orderNotes: 'Please call client prior to arrival at gate.',
      createdAt: createdDate.toISOString(),
      trackingHistory: [
        {
          status: 'Pending',
          timestamp: createdDate.toISOString(),
          note: 'Consignment confirmed & registered with Atelier Logistics.',
        },
        {
          status: 'Confirmed',
          timestamp: new Date(createdDate.getTime() + 1800000).toISOString(),
          note: 'Client order details & address verified.',
        },
        {
          status: 'Processing',
          timestamp: new Date(createdDate.getTime() + 7200000).toISOString(),
          note: 'Fine garment inspection completed with white-glove packaging.',
        },
        {
          status: 'Packed',
          timestamp: new Date(createdDate.getTime() + 14400000).toISOString(),
          note: 'Sealed in preservation packaging with security seal.',
        },
        {
          status: 'Shipped',
          timestamp: new Date(now.getTime() - 18000000).toISOString(),
          note: 'Dispatched via TCS Express. In transit to destination hub.',
        },
      ],
    };
  };

  const initialOrder: Order =
    lastPlacedOrder ||
    orders[0] ||
    generateMockOrder('ORD-98745');

  const [currentOrder, setCurrentOrder] = useState<Order>(initialOrder);
  const [isMockGenerated, setIsMockGenerated] = useState<boolean>(!lastPlacedOrder && orders.length === 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedOrder = searchQuery.trim().toLowerCase();
    const trimmedPhone = phoneQuery.trim();

    if (!trimmedOrder && !trimmedPhone) return;

    const found = orders.find((o) => {
      const matchOrder =
        trimmedOrder &&
        (o.orderNumber.toLowerCase() === trimmedOrder ||
          o.orderNumber.toLowerCase().includes(trimmedOrder));
      const matchPhone = trimmedPhone && o.customerPhone.includes(trimmedPhone);

      if (trimmedOrder && trimmedPhone) return matchOrder || matchPhone;
      if (trimmedOrder) return matchOrder;
      if (trimmedPhone) return matchPhone;
      return false;
    });

    if (found) {
      setCurrentOrder(found);
      setIsMockGenerated(false);
    } else {
      const mock = generateMockOrder(trimmedOrder || 'ORD-98745');
      setCurrentOrder(mock);
      setIsMockGenerated(true);
    }
  };

  const getMilestoneIndex = (status: OrderStatus) => {
    const list: OrderStatus[] = [
      'Pending',
      'Confirmed',
      'Processing',
      'Packed',
      'Shipped',
      'Out for Delivery',
      'Delivered',
    ];
    return list.indexOf(status);
  };

  const currentStepIdx = Math.max(0, getMilestoneIndex(currentOrder.status));
  const progressPercent = Math.min(100, Math.round(((currentStepIdx + 1) / statusMilestones.length) * 100));

  const copyTrackingNumber = () => {
    navigator.clipboard?.writeText(currentOrder.orderNumber);
    setCopiedAWB(true);
    setTimeout(() => setCopiedAWB(false), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-[#F5EFE6] text-[#111111] py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#FAF7F2] border border-[#A0645A]/30 rounded-full text-[#8B2E0B] text-[11px] font-bold tracking-widest uppercase shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[#8B2E0B]" />
            <span>Express Courier Tracking & Delivery</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-[#111111] tracking-wide">
            LIVE ORDER TRACKING
          </h1>

          <p className="text-xs sm:text-sm text-[#736B63] max-w-lg mx-auto font-normal leading-relaxed">
            Enter your {settings.brandName || 'MUSHAY'} Order Number or phone number to track live courier dispatch, transit progress, and expected delivery date.
          </p>
        </div>

        {/* Tracking Search Form */}
        <div className="bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[22px] p-6 md:p-8 shadow-sm space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#111111] font-bold mb-1.5">
                  Order ID / Consignment Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. ORD-98745"
                    className="w-full bg-white border border-[#A0645A]/30 focus:border-[#8B2E0B] text-sm px-3.5 py-2.5 text-[#111111] font-mono uppercase rounded-[14px] focus:outline-none shadow-xs"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#111111] font-bold mb-1.5">
                  Mobile Number (Optional)
                </label>
                <input
                  type="text"
                  value={phoneQuery}
                  onChange={(e) => setPhoneQuery(e.target.value)}
                  placeholder="e.g. 03001234567"
                  className="w-full bg-white border border-[#A0645A]/30 focus:border-[#8B2E0B] text-sm px-3.5 py-2.5 text-[#111111] rounded-[14px] focus:outline-none shadow-xs"
                />
              </div>
            </div>

            {/* Quick Demo Fill Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-stone-500 text-[11px] font-semibold">Quick Track:</span>
              {orders.slice(0, 3).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    setSearchQuery(o.orderNumber);
                    setCurrentOrder(o);
                    setIsMockGenerated(false);
                  }}
                  className="px-3 py-1 bg-white hover:bg-[#ECE4D7] border border-[#A0645A]/30 hover:border-[#8B2E0B] text-[#8B2E0B] font-mono text-[11px] font-bold rounded-full transition-colors"
                >
                  {o.orderNumber} ({o.status})
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('ORD-88219');
                  const mock = generateMockOrder('ORD-88219');
                  setCurrentOrder(mock);
                  setIsMockGenerated(true);
                }}
                className="px-3 py-1 bg-white hover:bg-[#ECE4D7] border border-[#A0645A]/30 hover:border-[#8B2E0B] text-[#111111] font-mono text-[11px] rounded-full transition-colors"
              >
                Sample ORD-88219
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#8B2E0B] hover:bg-[#702407] text-white font-bold text-xs uppercase tracking-widest rounded-[16px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Locate & View Shipment Progress</span>
            </button>
          </form>

          {isMockGenerated && (
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-[14px] flex items-center justify-between text-xs text-amber-900 font-medium">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8B2E0B]" />
                Viewing simulated consignment <strong>{currentOrder.orderNumber}</strong>.
              </span>
              <span className="text-[10px] text-amber-800 font-mono">Demo Simulation</span>
            </div>
          )}
        </div>

        {/* Live Visual Timeline & Tracking Card */}
        <div className="bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[22px] p-6 md:p-8 space-y-8 shadow-sm">
          
          {/* Top Banner: Consignment Status & Airway Bill */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#A0645A]/20 gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#8B2E0B] font-bold block">
                Official Order Reference
              </span>
              <div className="flex items-center gap-3 mt-1">
                <h2 className="text-2xl sm:text-3xl font-mono font-bold text-[#111111] tracking-wider">
                  {currentOrder.orderNumber}
                </h2>
                <button
                  onClick={copyTrackingNumber}
                  className="p-1.5 bg-white border border-[#A0645A]/30 hover:border-[#8B2E0B] text-[#111111] rounded-[8px] transition-colors shadow-xs cursor-pointer"
                  title="Copy Tracking ID"
                >
                  <Copy className="w-3.5 h-3.5 text-[#8B2E0B]" />
                </button>
                {copiedAWB && (
                  <span className="text-[11px] text-emerald-700 font-bold animate-pulse">
                    Copied!
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Recipient: <strong className="text-[#111111]">{currentOrder.customerName}</strong> • {currentOrder.city}, Pakistan
              </p>
            </div>

            <div className="flex flex-col sm:items-end">
              <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Current Shipment Status</span>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B2E0B] text-white text-xs font-bold uppercase tracking-wider rounded-[14px] shadow-xs mt-1.5">
                <Truck className="w-4 h-4" />
                <span>{currentOrder.status}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar: Courier, Estimated Date, Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#ECE4D7] border border-[#A0645A]/25 rounded-[18px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-white border border-[#A0645A]/30 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-[#8B2E0B]" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">Courier Partner</span>
                <span className="text-xs font-bold text-[#111111]">TCS Express VIP</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-white border border-[#A0645A]/30 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-[#8B2E0B]" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">Estimated Delivery</span>
                <span className="text-xs font-bold text-[#111111]">Within 24–48 Hours</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-white border border-[#A0645A]/30 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#8B2E0B]" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">Destination</span>
                <span className="text-xs font-bold text-[#111111]">Central Hub → {currentOrder.city}</span>
              </div>
            </div>
          </div>

          {/* Overall Visual Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="uppercase tracking-widest text-[#8B2E0B] font-bold text-[11px]">
                Shipment Transit Progress
              </span>
              <span className="font-mono font-bold text-[#111111]">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden border border-[#A0645A]/20">
              <div
                className="h-full bg-[#8B2E0B] transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Detailed Visual Progress Stepper */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#8B2E0B] border-b border-[#A0645A]/25 pb-2">
              Order Progress & Timeline
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-7 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#A0645A]/30">
              {statusMilestones.map((m) => {
                const milestoneIdx = getMilestoneIndex(m.status);
                const isPassed = milestoneIdx < currentStepIdx;
                const isCurrent = milestoneIdx === currentStepIdx;

                const recordedHistory = currentOrder.trackingHistory.find(
                  (h) => h.status === m.status
                );

                return (
                  <div key={m.status} className="relative flex items-start gap-4">
                    {/* Status circle */}
                    <div
                      className={`absolute -left-6 sm:-left-8 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                        isCurrent
                          ? 'bg-[#8B2E0B] border-white text-white ring-4 ring-[#8B2E0B]/25 shadow-sm scale-110'
                          : isPassed
                          ? 'bg-[#ECE4D7] border-[#8B2E0B] text-[#8B2E0B]'
                          : 'bg-white border-stone-300 text-stone-400'
                      }`}
                    >
                      {isPassed || isCurrent ? (
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        <Circle className="w-2.5 h-2.5 fill-current" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span
                          className={`text-xs uppercase tracking-wider font-bold ${
                            isCurrent
                              ? 'text-[#8B2E0B] text-sm'
                              : isPassed
                              ? 'text-[#111111]'
                              : 'text-stone-400'
                          }`}
                        >
                          {m.title}
                        </span>

                        <span className="text-[11px] text-stone-500 font-mono font-medium">
                          {recordedHistory
                            ? new Date(recordedHistory.timestamp).toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : isCurrent
                            ? 'Active Step'
                            : 'Pending'}
                        </span>
                      </div>

                      <p
                        className={`text-xs mt-1 leading-relaxed ${
                          isCurrent
                            ? 'text-[#8B2E0B] font-semibold'
                            : isPassed
                            ? 'text-[#55504A]'
                            : 'text-stone-400'
                        }`}
                      >
                        {recordedHistory ? recordedHistory.note : m.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Consignment Contents & Cash on Delivery Summary */}
          <div className="border-t border-[#A0645A]/20 pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#111111]">
                Order Items ({currentOrder.items.length})
              </h3>
              <span className="text-xs font-mono font-bold text-[#8B2E0B]">
                COD Payable: PKR {currentOrder.total.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3.5 bg-white border border-[#A0645A]/30 rounded-[20px] shadow-xs hover:border-[#8B2E0B]/50 transition-colors"
                >
                  <img
                    src={item.product?.images?.[0] || '/src/assets/images/fashion_gold_blazer_1790533633560.jpg'}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-12 h-14 object-cover rounded-[14px] bg-[#ECE4D7] border border-[#A0645A]/20 shrink-0"
                  />
                  <div className="text-xs space-y-0.5">
                    <h4 className="font-bold text-[#111111] uppercase tracking-wider line-clamp-1">
                      {item.product?.name || 'Haute Couture Garment'}
                    </h4>
                    <p className="text-stone-500 text-[11px]">
                      Size: {item.size} • Color: {item.color}
                    </p>
                    <p className="text-[#8B2E0B] font-mono font-bold">
                      Qty: {item.quantity} (PKR {(item.price * item.quantity).toLocaleString()})
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Address Box */}
            <div className="p-4 sm:p-5 bg-white border border-[#A0645A]/30 rounded-[20px] text-xs space-y-1 shadow-xs">
              <div className="text-[11px] uppercase tracking-wider text-[#8B2E0B] font-extrabold">
                Delivery Destination
              </div>
              <div className="text-[#111111] font-medium leading-relaxed">
                {currentOrder.address}, {currentOrder.area}, {currentOrder.city}
              </div>
              {currentOrder.orderNotes && (
                <div className="text-stone-500 text-[11px] italic pt-1">
                  Note: "{currentOrder.orderNotes}"
                </div>
              )}
            </div>
          </div>

          {/* Concierge Assistance */}
          <div className="p-4 sm:p-5 bg-[#ECE4D7] border border-[#A0645A]/30 rounded-[20px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-2.5 text-[#111111]">
              <div className="w-8 h-8 rounded-full bg-[#8B2E0B]/15 flex items-center justify-center text-[#8B2E0B] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-semibold">Questions regarding your consignment? Contact our client concierge.</span>
            </div>
            <button
              type="button"
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="px-5 py-2.5 bg-[#8B2E0B] hover:bg-[#702407] text-white font-bold uppercase tracking-wider rounded-[14px] transition-all transform hover:scale-105 active:scale-95 shrink-0 inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Concierge</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
