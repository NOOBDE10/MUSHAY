import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  WHATSAPP_CONTACTS,
  WhatsAppContact,
  cleanPhoneNumberForWhatsApp,
  formatPhoneNumberForCall,
} from '../data/whatsappContacts';
import {
  X,
  Phone,
  ArrowLeft,
  ChevronRight,
  ShoppingBag,
  Headphones,
  Package,
  MessageCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { settings, whatsappContacts, isWhatsAppModalOpen, setIsWhatsAppModalOpen } = useShop();
  const contactsList = whatsappContacts && whatsappContacts.length > 0 ? whatsappContacts : WHATSAPP_CONTACTS;
  const [selectedContact, setSelectedContact] = useState<WhatsAppContact | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isWhatsAppModalOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWhatsAppModalOpen]);

  const handleClose = () => {
    setIsWhatsAppModalOpen(false);
    // Smooth reset after exit
    setTimeout(() => {
      setSelectedContact(null);
    }, 200);
  };

  const handleOpen = () => {
    setSelectedContact(null);
    setIsWhatsAppModalOpen(true);
  };

  const handleSelectContact = (contact: WhatsAppContact) => {
    setSelectedContact(contact);
  };

  const handleBackToOptions = () => {
    setSelectedContact(null);
  };

  const handleWhatsAppAction = (contact: WhatsAppContact) => {
    const cleanNumber = cleanPhoneNumberForWhatsApp(contact.phoneNumber);
    const message = encodeURIComponent(
      `Hello ${settings.brandName || 'MUSHAY'} ${contact.name}! I would like assistance regarding your luxury collections.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const getDepartmentIcon = (id: WhatsAppContact['id']) => {
    switch (id) {
      case 'sales':
        return <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />;
      case 'support':
        return <Headphones className="w-5 h-5 text-[#25D366]" />;
      case 'orders':
        return <Package className="w-5 h-5 text-[#A0645A]" />;
      case 'inquiry':
      default:
        return <MessageCircle className="w-5 h-5 text-[#FAF7F2]" />;
    }
  };

  return (
    <>
      {/* 1. FLOATING WHATSAPP TRIGGER BUTTON */}
      <aside aria-label="Support contacts" className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleOpen}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isWhatsAppModalOpen}
          aria-label="Open contact selection"
          title="Contact MUSHAY Concierge (Call / WhatsApp)"
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#1B5E20] via-[#25D366] to-[#4ADE80] text-white shadow-[0_4px_25px_rgba(37,211,102,0.4)] border border-white/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          {/* WhatsApp Official SVG Icon */}
          <svg
            className="w-7 h-7 fill-white drop-shadow-md group-hover:rotate-12 transition-transform duration-300"
            viewBox="0 0 24 24"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </button>
      </aside>

      {/* 2. CONTACT SELECTION POPUP MODAL */}
      {isWhatsAppModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
        >
          {/* Dark Backdrop with Luxury Blur */}
          <div
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-md bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[22px] shadow-2xl overflow-hidden text-[#111111] z-10 animate-in zoom-in-95 duration-200">
            {/* Top Brand & WhatsApp Header Banner */}
            <div className="bg-[#111111] border-b border-[#222222] p-4 sm:p-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1B5E20] via-[#25D366] to-[#4ADE80] flex items-center justify-center shadow-md shrink-0">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C4AD8A] font-semibold block">
                    {settings.brandName || 'MUSHAY'} OFFICIAL CONCIERGE
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                    <span className="text-xs text-white font-medium">Online & Ready to Assist</span>
                  </div>
                </div>
              </div>

              {/* Close (X) button */}
              <button
                onClick={handleClose}
                aria-label="Close contact dialog"
                className="p-2 text-stone-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {!selectedContact ? (
                /* STEP 1: FOUR CONTACT OPTIONS */
                <div className="space-y-4">
                  <div className="text-left space-y-1">
                    <h3
                      id="contact-modal-title"
                      className="text-lg sm:text-xl font-serif-luxury font-bold text-[#111111] tracking-wide"
                    >
                      How can we help you?
                    </h3>
                    <p className="text-xs text-[#55504A] font-light">
                      Select a department below to connect via direct phone call or WhatsApp message:
                    </p>
                  </div>

                  {/* Contact Cards */}
                  <div className="space-y-2.5 pt-1">
                    {contactsList.map((contact, index) => (
                      <button
                        key={contact.id}
                        type="button"
                        onClick={() => handleSelectContact(contact)}
                        className="group w-full flex items-center justify-between p-3.5 bg-white hover:bg-[#ECE4D7] border border-[#A0645A]/25 hover:border-[#1E7E34] rounded-[16px] transition-all duration-200 cursor-pointer shadow-xs text-left"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Department icon */}
                          <div className="w-10 h-10 rounded-[12px] bg-[#ECE4D7] border border-[#A0645A]/20 group-hover:border-[#1E7E34] flex items-center justify-center shrink-0 transition-colors">
                            {getDepartmentIcon(contact.id)}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-[#111111] group-hover:text-[#1E7E34] transition-colors">
                                {index + 1}. {contact.name}
                              </span>
                              {contact.badge && (
                                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#8B2E0B] text-white">
                                  {contact.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-mono font-bold text-[#1E7E34] block mt-0.5">
                              {contact.phoneNumber}
                            </span>
                            <span className="text-[11px] text-[#55504A] truncate block mt-0.5">
                              {contact.description}
                            </span>
                          </div>
                        </div>

                        {/* Chevron right indicator */}
                        <div className="w-7 h-7 rounded-full bg-stone-100 group-hover:bg-[#1E7E34]/15 flex items-center justify-center shrink-0 transition-colors ml-2">
                          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#1E7E34] transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Fast info notice */}
                  <div className="p-2.5 rounded-[12px] bg-[#ECE4D7] border border-[#A0645A]/20 flex items-center gap-2 text-[11px] text-[#55504A]">
                    <Clock className="w-3.5 h-3.5 text-[#8B2E0B] shrink-0" />
                    <span>Average reply time: Under 5 minutes during atelier hours.</span>
                  </div>
                </div>
              ) : (
                /* STEP 2: SELECTED NUMBER ACTIONS (CALL OR WHATSAPP) */
                <div className="space-y-5 animate-in fade-in duration-200 text-center">
                  {/* Back button */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#A0645A]/20">
                    <button
                      type="button"
                      onClick={handleBackToOptions}
                      className="inline-flex items-center gap-1.5 text-xs text-[#8B2E0B] hover:text-[#111111] transition-colors cursor-pointer font-bold"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Departments</span>
                    </button>
                    <span className="text-[11px] text-stone-500 uppercase tracking-wider">
                      Selected Department
                    </span>
                  </div>

                  {/* Department Emblem & Info */}
                  <div className="space-y-2">
                    <div className="w-14 h-14 rounded-full bg-[#ECE4D7] border-2 border-[#1E7E34] flex items-center justify-center mx-auto shadow-sm">
                      {getDepartmentIcon(selectedContact.id)}
                    </div>
                    <div>
                      <h3 className="text-xl font-serif-luxury font-bold text-[#111111]">
                        {selectedContact.name}
                      </h3>
                      <p className="text-xs text-[#55504A]">
                        {selectedContact.nameUrdu} • {selectedContact.description}
                      </p>
                    </div>

                    {/* Phone Number Displayed Clearly */}
                    <div className="py-2.5 px-4 bg-[#ECE4D7] border border-[#A0645A]/30 rounded-[14px] max-w-xs mx-auto shadow-xs">
                      <span className="text-[10px] uppercase tracking-widest text-[#55504A] block mb-0.5 font-bold">
                        Direct Contact Number
                      </span>
                      <span className="text-lg sm:text-xl font-mono font-bold text-[#1E7E34] tracking-wider select-all">
                        {selectedContact.phoneNumber}
                      </span>
                    </div>
                  </div>

                  {/* EXACTLY TWO ACTION BUTTONS: CALL & WHATSAPP */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {/* OPTION 1: CALL (opens phone dialer interface) */}
                    <a
                      href={`tel:${formatPhoneNumberForCall(selectedContact.phoneNumber)}`}
                      className="group flex items-center justify-center gap-2 py-3.5 px-4 bg-white hover:bg-[#ECE4D7] text-[#111111] hover:text-[#8B2E0B] border border-[#A0645A]/40 hover:border-[#8B2E0B] rounded-[14px] font-bold text-xs uppercase tracking-wider shadow-xs transition-all duration-200 cursor-pointer text-center"
                    >
                      <Phone className="w-4 h-4 text-[#8B2E0B] group-hover:scale-110 transition-transform" />
                      <span>Call Now</span>
                    </a>

                    {/* OPTION 2: WHATSAPP (opens direct chat with this exact contact number) */}
                    <button
                      type="button"
                      onClick={() => handleWhatsAppAction(selectedContact)}
                      className="group flex items-center justify-center gap-2 py-3.5 px-4 bg-[#1E7E34] hover:bg-[#165F26] text-white rounded-[14px] font-bold text-xs uppercase tracking-wider shadow-sm transition-all duration-200 cursor-pointer text-center active:scale-95"
                    >
                      <svg className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                      <span>WhatsApp Chat</span>
                    </button>
                  </div>

                  <div className="pt-2 text-center">
                    <span className="text-[11px] text-stone-500 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
                      Direct verified line with official {settings.brandName || 'MUSHAY'} concierge.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

