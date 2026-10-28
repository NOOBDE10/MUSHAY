import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Truck, Crown, MessageCircle, Mail, MapPin, Phone, HelpCircle } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { navigateTo, settings } = useShop();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12 text-[#111111]">
      <div className="text-center space-y-4">
        <span className="text-xs uppercase tracking-[0.3em] text-[#8B2E0B] font-bold">
          The Haute Couture House
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-[#111111] tracking-wide">
          ABOUT {settings.brandName || 'MUSHAY'}
        </h1>
        <p className="text-sm md:text-base text-[#111111]/75 max-w-2xl mx-auto font-light leading-relaxed">
          {settings.brandName || 'MUSHAY'} is a modern luxury clothing brand created for individuals who believe personal style should feel effortless, confident, and timeless.
        </p>
      </div>

      <div className="relative aspect-video rounded-[24px] overflow-hidden border border-[#A0645A]/30 shadow-lg">
        <img
          src="/src/assets/images/hero_model_black_gold_1790533620187.jpg"
          alt="MUSHAY Atelier"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-sm uppercase tracking-widest text-[#FAF7F2] font-semibold">
            Handcrafted with Master Tailoring & Premium Fabrics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-6 bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[22px] space-y-2.5 shadow-sm">
          <Crown className="w-6 h-6 text-[#8B2E0B]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">Artisanal Heritage</h3>
          <p className="text-xs text-[#111111]/75 leading-relaxed">
            Our atelier pairs classical subcontinental textile heritage with modern, tailored silhouettes for every occasion.
          </p>
        </div>

        <div className="p-6 bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[22px] space-y-2.5 shadow-sm">
          <ShieldCheck className="w-6 h-6 text-[#8B2E0B]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">Refined Fabrics</h3>
          <p className="text-xs text-[#111111]/75 leading-relaxed">
            We source pure silks, fine wool blends, breathable linens, and luxury textures tested for durability and drape.
          </p>
        </div>

        <div className="p-6 bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[22px] space-y-2.5 shadow-sm">
          <Truck className="w-6 h-6 text-[#8B2E0B]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">Prompt Delivery</h3>
          <p className="text-xs text-[#111111]/75 leading-relaxed">
            Every garment arrives securely packaged with convenient nationwide Cash on Delivery and prompt courier tracking.
          </p>
        </div>
      </div>

      <div className="text-center pt-8">
        <button
          onClick={() => navigateTo('shop')}
          className="px-8 py-3.5 bg-[#8B2E0B] hover:bg-[#111111] text-[#F5EFE6] font-bold text-xs uppercase tracking-widest rounded-[22px] shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          Explore Ready-to-Wear Catalog
        </button>
      </div>
    </div>
  );
};

export const ContactView: React.FC = () => {
  const { settings, setIsWhatsAppModalOpen } = useShop();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12 text-[#111111]">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-[#8B2E0B] font-bold">
          Client Services & Inquiries
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-[#111111] tracking-wide">
          CONNECT WITH {settings.brandName || 'MUSHAY'}
        </h1>
        <p className="text-sm text-[#111111]/75 max-w-md mx-auto">
          For bespoke tailoring consultations, size guidance, and order concierge support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="space-y-6 bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[24px] p-6 md:p-8 shadow-sm">
          <h2 className="text-base font-serif-luxury font-bold text-[#8B2E0B] tracking-wider uppercase border-b border-[#A0645A]/20 pb-3">
            Atelier Flagship Locations
          </h2>

          <div className="space-y-4 text-xs text-[#111111]/80">
            <div className="flex items-start gap-3 p-3.5 bg-white rounded-[16px] border border-[#A0645A]/25 shadow-xs">
              <MapPin className="w-4 h-4 text-[#8B2E0B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111111] block font-bold">Lahore Atelier</strong>
                <span>Plot 22, MM Alam Road, Gulberg III, Lahore, Pakistan</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-white rounded-[16px] border border-[#A0645A]/25 shadow-xs">
              <Phone className="w-4 h-4 text-[#8B2E0B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111111] block font-bold">Telephone Inquiries</strong>
                <span>{settings.whatsappNumber} (Monday - Saturday, 10 AM - 8 PM PKT)</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-white rounded-[16px] border border-[#A0645A]/25 shadow-xs">
              <Mail className="w-4 h-4 text-[#8B2E0B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111111] block font-bold">Official Email</strong>
                <span className="text-[#8B2E0B] font-semibold">{settings.notificationEmail}</span>
              </div>
            </div>

            <div
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="flex items-start gap-3 p-3.5 bg-emerald-50 hover:bg-emerald-100 rounded-[16px] border border-emerald-300 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111111] block font-bold">WhatsApp Direct Concierge Service</strong>
                <span className="text-emerald-800 font-medium">Instant client assistance for sizing, orders & inquiries ↗</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[24px] p-6 md:p-8 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xl">
                ✓
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#8B2E0B]">
                Inquiry Received
              </h3>
              <p className="text-xs text-[#111111]/75">
                Our client team will contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-[#111111] mb-1 font-bold">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sofia Martinez"
                  className="w-full bg-white border border-[#A0645A]/30 focus:border-[#8B2E0B] px-3.5 py-2.5 text-[#111111] rounded-[14px] focus:outline-none transition-colors shadow-xs"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#111111] mb-1 font-bold">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sofia@email.com"
                  className="w-full bg-white border border-[#A0645A]/30 focus:border-[#8B2E0B] px-3.5 py-2.5 text-[#111111] rounded-[14px] focus:outline-none transition-colors shadow-xs"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#111111] mb-1 font-bold">Inquiry Type</label>
                <select className="w-full bg-white border border-[#A0645A]/30 focus:border-[#8B2E0B] px-3.5 py-2.5 text-[#111111] rounded-[14px] focus:outline-none transition-colors shadow-xs cursor-pointer">
                  <option>Bespoke Tailoring & Sizing</option>
                  <option>Order Status Assistance</option>
                  <option>Exchange / Return Request</option>
                  <option>General Brand Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#111111] mb-1 font-bold">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide sizing preferences, product details, or specific questions..."
                  className="w-full bg-white border border-[#A0645A]/30 focus:border-[#8B2E0B] px-3.5 py-2.5 text-[#111111] rounded-[14px] focus:outline-none transition-colors shadow-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#8B2E0B] hover:bg-[#111111] text-[#F5EFE6] font-bold uppercase tracking-widest rounded-[22px] shadow-sm transition-transform hover:scale-[1.01] active:scale-98 cursor-pointer"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const FAQView: React.FC = () => {
  const faqs = [
    {
      q: 'How does Cash on Delivery (COD) work?',
      a: 'We offer hassle-free Cash on Delivery across all cities in Pakistan. Simply place your order without entering credit card details. When our courier partner arrives at your address, you pay the exact order amount in cash.',
    },
    {
      q: 'When do I qualify for Free Delivery?',
      a: 'All orders with a subtotal of PKR 500 or above automatically receive complimentary express delivery across Pakistan.',
    },
    {
      q: 'How can I track my order?',
      a: 'Once your order is confirmed, you receive an official Order Number (e.g. ORD-98745). You can use our real-time "Track Order" page at any time to monitor dispatch status from our atelier to your door.',
    },
    {
      q: 'What is your size exchange policy?',
      a: 'We provide a 2-day hassle-free exchange policy. If the garment does not fit flawlessly, notify our concierge on WhatsApp, and we will dispatch a replacement size with courier doorstep exchange.',
    },
    {
      q: 'What fabrics do you use?',
      a: 'Our collections feature premium mulberry silk, pure cottons, structured blazers, fine wool blends, and artisanal embellishments crafted for comfort and elegance.',
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-8 text-[#111111]">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.3em] text-[#8B2E0B] font-bold">
          Assistance & Inquiries
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#111111] tracking-wide">
          FREQUENTLY ASKED QUESTIONS
        </h1>
      </div>

      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[20px] p-6 space-y-2.5 shadow-sm">
            <h3 className="text-sm font-bold text-[#8B2E0B] uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 shrink-0" />
              {f.q}
            </h3>
            <p className="text-xs text-[#111111]/80 leading-relaxed font-normal pl-6">
              {f.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
