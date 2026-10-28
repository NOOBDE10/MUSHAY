/**
 * =======================================================================
 * MUSHAY ATELIER - WHATSAPP & PHONE CONTACTS CONFIGURATION
 * =======================================================================
 * You can easily update the 4 department phone numbers right here!
 *
 * Simply edit the 'phoneNumber' values below with your desired numbers.
 * The system automatically cleans spaces, '+', brackets, and hyphens
 * for WhatsApp links (wa.me/PHONE_NUMBER) and phone calls (tel:PHONE_NUMBER).
 * =======================================================================
 */

export interface WhatsAppContact {
  id: 'sales' | 'support' | 'orders' | 'inquiry';
  name: string;
  nameUrdu: string;
  description: string;
  phoneNumber: string; // <-- REPLACE YOUR PHONE NUMBER HERE
  badge?: string;
}

export const WHATSAPP_CONTACTS: WhatsAppContact[] = [
  {
    id: 'sales',
    name: 'Sales',
    nameUrdu: 'سیلز ڈیپارٹمنٹ',
    description: 'Haute couture inquiries, bespoke sizing & purchasing assistance',
    phoneNumber: '+92 300 1234567', // <-- Contact 1: Sales
    badge: 'Direct VIP',
  },
  {
    id: 'support',
    name: 'Customer Support',
    nameUrdu: 'کسٹمر سپورٹ',
    description: 'Order queries, tailoring advice, alterations & exchanges',
    phoneNumber: '+92 300 2345678', // <-- Contact 2: Customer Support
  },
  {
    id: 'orders',
    name: 'Orders',
    nameUrdu: 'آرڈرز اور ڈیلیوری',
    description: 'Real-time parcel tracking, dispatch updates & rider contact',
    phoneNumber: '+92 300 3456789', // <-- Contact 3: Orders
  },
  {
    id: 'inquiry',
    name: 'General Inquiry',
    nameUrdu: 'عام معلومات',
    description: 'Boutique locations, designer collaborations & brand questions',
    phoneNumber: '+92 300 4567890', // <-- Contact 4: General Inquiry
  },
];

/**
 * Utility function to clean any phone number into pure digits for WhatsApp URLs:
 * Example: "+92 300 1234567" -> "923001234567"
 */
export const cleanPhoneNumberForWhatsApp = (rawPhone: string): string => {
  return rawPhone.replace(/[^0-9]/g, '');
};

/**
 * Utility function for tel: link dialing
 */
export const formatPhoneNumberForCall = (rawPhone: string): string => {
  return rawPhone.replace(/\s+/g, '');
};
