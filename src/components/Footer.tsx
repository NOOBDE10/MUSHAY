import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Instagram, Linkedin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, settings, setActiveAdminTab, addSubscriber } = useShop();
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribedEmail.trim()) return;
    
    setStatus('loading');
    setTimeout(() => {
      const res = addSubscriber(subscribedEmail);
      if (res.success) {
        setStatus('success');
        setFeedbackMessage(res.message);
        setSubscribedEmail('');
      } else {
        setStatus('error');
        setFeedbackMessage(res.message);
      }
    }, 300);
  };

  const social = settings.socialLinks || {};

  // Format link safely to always use proper external URL protocol
  const getExternalLink = (url?: string, defaultUrl?: string) => {
    const target = url && url.trim() ? url.trim() : defaultUrl;
    if (!target) return '#';
    if (
      target.startsWith('http://') ||
      target.startsWith('https://') ||
      target.startsWith('//') ||
      target.startsWith('mailto:') ||
      target.startsWith('tel:')
    ) {
      return target;
    }
    if (target.startsWith('wa.me')) {
      return `https://${target}`;
    }
    return `https://${target}`;
  };

  return (
    <footer className="w-full bg-[#111111] border-t border-[#262626] text-[#FAF7F2]">
      {/* 
        Privilege Roster Section:
        Consistent deep #111111 background matching Header.
      */}
      <section
        aria-labelledby="newsletter-heading"
        className="w-full py-14 px-4 sm:px-6 lg:px-8 border-b border-[#222222] bg-[#111111]"
      >
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#A0645A] font-semibold">
            Haute Couture Atelier
          </span>

          <h2
            id="newsletter-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-serif-luxury font-normal tracking-wide text-[#FAF7F2]"
          >
            The MUSHAY Atelier Newsletter
          </h2>

          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-[#C4AD8A] leading-relaxed font-light max-w-xl mx-auto">
              Subscribe to receive private previews of seasonal lookbooks, bespoke couture showcases, and exclusive atelier appointments.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[#A0645A] font-semibold tracking-widest uppercase pt-1">
              <span className="text-[#C4AD8A]">First Look at New Collections</span>
              <span className="text-[#8B2E0B] font-bold">•</span>
              <span className="text-[#C4AD8A]">Private Concierge Fitting</span>
              <span className="text-[#8B2E0B] font-bold">•</span>
              <span className="text-[#C4AD8A]">Express Delivery Service</span>
            </div>

            {/* Subscribe Form */}
            <form onSubmit={handleSubscribe} className="pt-3 max-w-md mx-auto flex gap-2">
              <input
                type="email"
                value={subscribedEmail}
                onChange={(e) => {
                  setSubscribedEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="Enter your email (e.g. name@domain.com)"
                required
                className="flex-1 bg-[#1A1A1A] border border-[#333333] px-4 py-2.5 text-xs text-[#FAF7F2] placeholder-[#777777] rounded-[20px] focus:outline-none focus:border-[#A0645A] transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-2.5 bg-[#8B2E0B] hover:bg-[#A0645A] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider rounded-[20px] transition-all shadow-sm cursor-pointer disabled:opacity-60 flex items-center gap-1.5 active:scale-95"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </form>

            {status === 'success' && (
              <div className="p-3 bg-[#1A1A1A] border border-[#A0645A]/60 rounded-[20px] max-w-md mx-auto flex items-center justify-center gap-2.5 text-xs text-[#FAF7F2] shadow-md animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium text-[#FAF7F2]">{feedbackMessage}</span>
              </div>
            )}

            {status === 'error' && (
              <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-[20px] max-w-md mx-auto flex items-center justify-center gap-2 text-xs text-red-200 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{feedbackMessage}</span>
              </div>
            )}
          </div>

          {/* Social Media Links (Transparent backgrounds, brand accents) */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
            {/* 1. Instagram */}
            <a
              href={getExternalLink(social.instagram, 'https://instagram.com/mushayofficial')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Follow MUSHAY on Instagram"
              className="text-[#C4AD8A] hover:text-[#FAF7F2] p-2 hover:bg-[#1A1A1A] rounded-full hover:scale-110 transition-all duration-200"
            >
              <Instagram className="w-5 h-5" />
            </a>

            {/* 2. Facebook */}
            <a
              href={getExternalLink(social.facebook, 'https://facebook.com/mushayofficial')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              title="Follow MUSHAY on Facebook"
              className="text-[#C4AD8A] hover:text-[#FAF7F2] p-2 hover:bg-[#1A1A1A] rounded-full hover:scale-110 transition-all duration-200"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* 3. Pinterest */}
            <a
              href={getExternalLink(social.pinterest, 'https://pinterest.com/mushayofficial')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pinterest"
              title="Explore MUSHAY on Pinterest"
              className="text-[#C4AD8A] hover:text-[#FAF7F2] p-2 hover:bg-[#1A1A1A] rounded-full hover:scale-110 transition-all duration-200"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.057.24-.19.291-.437.175-1.632-.759-2.651-3.14-2.651-5.056 0-4.116 2.991-7.899 8.627-7.899 4.529 0 8.049 3.227 8.049 7.541 0 4.501-2.837 8.123-6.775 8.123-1.323 0-2.567-.688-2.993-1.501l-.815 3.107c-.294 1.134-1.09 2.556-1.625 3.424C9.58 23.834 10.77 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </a>

            {/* 4. LinkedIn */}
            <a
              href={getExternalLink(social.linkedin, 'https://linkedin.com/company/mushay')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="Connect with MUSHAY on LinkedIn"
              className="text-[#C4AD8A] hover:text-[#FAF7F2] p-2 hover:bg-[#1A1A1A] rounded-full hover:scale-110 transition-all duration-200"
            >
              <Linkedin className="w-5 h-5" />
            </a>

            {/* 5. TikTok */}
            <a
              href={getExternalLink(social.tiktok, 'https://tiktok.com/@mushayofficial')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              title="Watch MUSHAY on TikTok"
              className="text-[#C4AD8A] hover:text-[#FAF7F2] p-2 hover:bg-[#1A1A1A] rounded-full hover:scale-110 transition-all duration-200"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.89-4.46V8.55a8.28 8.28 0 0 0 5.24 1.86v-3.72a4.84 4.84 0 0 1-1.36 0z" />
              </svg>
            </a>

            {/* 6. Threads */}
            <a
              href={getExternalLink(social.threads, 'https://threads.net/@mushayofficial')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Threads"
              title="Follow MUSHAY on Threads"
              className="text-[#C4AD8A] hover:text-[#FAF7F2] p-2 hover:bg-[#1A1A1A] rounded-full hover:scale-110 transition-all duration-200"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.004 0C5.372 0 0 5.372 0 12.004c0 6.632 5.372 12.004 12.004 12.004 6.632 0 12.004-5.372 12.004-12.004C24.008 5.372 18.636 0 12.004 0zm5.105 14.54c-.214.364-.476.69-.785.975-.487.45-1.077.784-1.755.993-.679.21-1.408.315-2.17.315-.815 0-1.579-.12-2.274-.356a5.55 5.55 0 0 1-1.815-1.026 5.334 5.334 0 0 1-1.22-1.637 4.975 4.975 0 0 1-.444-2.115c0-.796.155-1.536.463-2.203a5.27 5.27 0 0 1 1.275-1.734 5.626 5.626 0 0 1 1.93-1.127 6.776 6.776 0 0 1 2.42-.424c.905 0 1.745.166 2.5.495.753.33 1.388.8 1.89 1.4.502.6.86 1.32 1.066 2.14.206.82.26 1.72.16 2.68h-7.85c.03.62.18 1.15.45 1.57.27.43.63.76 1.08.99.45.24.96.36 1.54.36.6 0 1.1-.11 1.5-.34.4-.23.7-.56.9-.98l1.43.89zm-7.6-4.32h5.53c-.04-.57-.22-1.03-.54-1.38-.32-.35-.74-.53-1.26-.53-.55 0-1.01.18-1.37.53-.36.35-.58.81-.66 1.38z" />
              </svg>
            </a>

            {/* 7. Snapchat */}
            <a
              href={getExternalLink(social.snapchat, 'https://snapchat.com/add/mushayofficial')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Snapchat"
              title="Add MUSHAY on Snapchat"
              className="text-[#C4AD8A] hover:text-[#FAF7F2] p-2 hover:bg-[#1A1A1A] rounded-full hover:scale-110 transition-all duration-200"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.03 2c-3.5 0-5.85 2.5-5.85 5.5 0 .5.1 1.2.3 1.7-.6.2-1.4.8-1.5 1.5-.1.6.3 1.1.8 1.3-.2.8-.8 1.5-1.7 1.8-.4.1-.6.5-.4.9.4.9 1.7 1.2 3.1 1 .5 1.1 1.5 1.8 2.7 2 .1.4.3.8.7 1.1-.9.3-2.1.8-3.1 1.8-.3.3-.2.8.2 1 .8.4 2 .6 3.4.6 1.1 0 1.7-.2 2.2-.4.4.2 1.1.4 2.2.4 1.4 0 2.6-.2 3.4-.6.4-.2.5-.7.2-1-1-1-2.2-1.5-3.1-1.8.4-.3.6-.7.7-1.1 1.2-.2 2.2-.9 2.7-2 1.4.2 2.7-.1 3.1-1 .2-.4 0-.8-.4-.9-.9-.3-1.5-1-1.7-1.8.5-.2.9-.7.8-1.3-.1-.7-.9-1.3-1.5-1.5.2-.5.3-1.2.3-1.7 0-3-2.35-5.5-5.85-5.5z" />
              </svg>
            </a>

            {/* 8. YouTube */}
            <a
              href={getExternalLink(social.youtube, 'https://youtube.com/@mushayofficial')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              title="Subscribe to MUSHAY on YouTube"
              className="text-[#C4AD8A] hover:text-[#FAF7F2] p-2 hover:bg-[#1A1A1A] rounded-full hover:scale-110 transition-all duration-200"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* 9. Google */}
            <a
              href={getExternalLink(social.google, 'https://google.com/search?q=mushay+clothing')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google"
              title="Find MUSHAY on Google"
              className="text-[#C4AD8A] hover:text-[#FAF7F2] p-2 hover:bg-[#1A1A1A] rounded-full hover:scale-110 transition-all duration-200"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
            </a>

            {/* 10. WhatsApp */}
            <a
              href={getExternalLink(social.whatsapp || (settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}` : 'https://wa.me/923001234567'))}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              title="Contact MUSHAY on WhatsApp"
              className="text-[#C4AD8A] hover:text-[#25D366] p-2 hover:bg-[#1A1A1A] rounded-full hover:scale-110 transition-all duration-200"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </a>

            {/* 11. X / Twitter */}
            <a
              href={getExternalLink(social.twitter, 'https://x.com/mushayofficial')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              title="Follow MUSHAY on X"
              className="text-[#C4AD8A] hover:text-[#FAF7F2] p-2 hover:bg-[#1A1A1A] rounded-full hover:scale-110 transition-all duration-200"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>

          {/* Editorial Navigation Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 max-w-xl mx-auto pt-4 text-xs text-[#C4AD8A] gap-y-3 font-normal">
            <button
              onClick={() => navigateTo('about')}
              className="hover:text-[#A0645A] transition-colors text-center"
            >
              About MUSHAY
            </button>
            <button
              onClick={() => navigateTo('shop')}
              className="hover:text-[#A0645A] transition-colors text-center"
            >
              Bespoke Collections
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className="hover:text-[#A0645A] transition-colors text-center"
            >
              Contact & Ateliers
            </button>
          </div>
        </div>
      </section>

      {/* 
        Main Footer Bottom:
        - Deep color #111111 matching Header.
        - Logo with transparent background blending with dark theme.
        - Monogram visible with brand colors (Tan, Rose-brown, Rust-red, NOT white).
        - Beside the logo: "M&S WEAR" with "WEAR" clearly written in #A0645A.
        - Rule 3: logo image plus brand name as text "M&S WEAR".
        - Rule 4: "© 2026 M&S WEAR. All rights reserved."
      */}
      <div className="w-full bg-[#111111] text-[#FAF7F2] border-t border-[#1C1C1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
          {/* 
            Left Corner: Logo image + Brand Name Text
            "फुटर में जो लोगो है, उसके बराबर में ये एम एंड एस लोगो वेयर, उसके नीचे वेयर, इस तरह का नाम भी लिख दो।"
            "ensure the 'M&S WEAR' branding text is visible and legible in a dark, luxury-appropriate color (like #A0645A)"
          */}
          <div className="flex items-center gap-3 bg-transparent">
            {/* Adjacent Brand Name & Subtext with logo removed */}
            <div className="flex flex-col text-left">
              <span className="text-xl sm:text-2xl font-serif-luxury font-bold tracking-[0.12em] text-[#FAF7F2]">
                {settings.brandName || 'MUSHAY'}
              </span>
              <span className="text-[9.5px] sm:text-[10px] text-[#A0645A] uppercase tracking-[0.35em] font-bold mt-1">
                OFFICIAL
              </span>
            </div>
          </div>

          {/* Copyright & Tailoring Tagline */}
          <div className="text-center sm:text-right text-[#888888] text-xs">
            <p className="text-[#C4AD8A]/80">© 2026 {settings.brandName || 'MUSHAY'}. All rights reserved.</p>
            <p className="text-[10px] text-[#A0645A] mt-1 tracking-wider uppercase">
              Designed with bespoke artisanal excellence
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
