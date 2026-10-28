import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    signup,
    settings,
    navigateTo,
  } = useShop();

  // Customer Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Customer Signup State
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: 'Lahore',
    address: '',
  });

  // Feedback & Submitting
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  // 1. Customer Login Submit
  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const res = login(loginEmail, loginPassword);
      setFeedback(res);
      setIsSubmitting(false);
      if (res.success) {
        setLoginEmail('');
        setLoginPassword('');
      }
    }, 350);
  };

  // 2. Customer Signup Submit
  const handleCustomerSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!signupData.name || !signupData.email || !signupData.password || !signupData.phone) {
      setFeedback({ success: false, message: 'Please fill in all mandatory fields.' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = signup(signupData);
      setFeedback(res);
      setIsSubmitting(false);
      if (res.success) {
        setSignupData({
          name: '',
          email: '',
          password: '',
          phone: '',
          city: 'Lahore',
          address: '',
        });
      }
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dark overlay backdrop */}
      <div
        onClick={() => setIsAuthModalOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
      />

      {/* TOP RIGHT: CLOSE BUTTON */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-8 z-[60] flex items-center gap-3">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="p-2 sm:p-2.5 text-stone-600 hover:text-black bg-[#FAF7F2]/90 border border-[#A0645A]/30 hover:border-[#8B2E0B] rounded-full transition-colors cursor-pointer shadow-md"
          aria-label="Close portal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4 py-16">
        <div className="relative w-full max-w-md bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[24px] shadow-2xl p-6 sm:p-8 space-y-6 text-[#111111] animate-in fade-in zoom-in-95 duration-200">
          
          {/* Top Brand Wordmark */}
          <div className="text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#111111] tracking-tight block">
              {settings.brandName || 'MUSHAY'}
            </span>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#8B2E0B] font-bold">
              OFFICIAL
            </p>
          </div>

          {/* Customer Mode Switcher (Sign In vs Create Account) */}
          <div className="grid grid-cols-2 p-1.5 bg-[#ECE4D7] rounded-[16px] border border-[#A0645A]/25">
            <button
              onClick={() => {
                setAuthModalMode('login');
                setFeedback(null);
              }}
              className={`py-2 text-xs font-semibold uppercase tracking-wider rounded-[12px] transition-all cursor-pointer ${
                authModalMode === 'login'
                  ? 'bg-[#8B2E0B] text-white shadow-xs font-bold'
                  : 'text-[#736B63] hover:text-[#111111]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthModalMode('signup');
                setFeedback(null);
              }}
              className={`py-2 text-xs font-semibold uppercase tracking-wider rounded-[12px] transition-all cursor-pointer ${
                authModalMode === 'signup'
                  ? 'bg-[#8B2E0B] text-white shadow-xs font-bold'
                  : 'text-[#736B63] hover:text-[#111111]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback alerts */}
          {feedback && (
            <div
              className={`p-3 rounded-[14px] text-xs flex items-center gap-2.5 border animate-in fade-in duration-200 ${
                feedback.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-red-50 border-red-300 text-red-800'
              }`}
            >
              {feedback.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              )}
              <span className="leading-snug font-medium">{feedback.message}</span>
            </div>
          )}

          {/* 1. CUSTOMER SIGN IN FORM */}
          {authModalMode === 'login' && (
            <form onSubmit={handleCustomerLogin} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-[#111111] mb-1.5 font-bold">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="client@mushay.com"
                    className="w-full bg-white border border-[#A0645A]/30 focus:border-[#8B2E0B] pl-10 pr-3 py-2.5 text-[#111111] rounded-[14px] focus:outline-none transition-colors shadow-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block uppercase tracking-wider text-[#111111] font-bold">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-[#A0645A]/30 focus:border-[#8B2E0B] pl-10 pr-10 py-2.5 text-[#111111] rounded-[14px] focus:outline-none transition-colors shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-3 text-stone-400 hover:text-black cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#8B2E0B] hover:bg-[#702407] text-white font-bold uppercase tracking-widest rounded-[16px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2 space-y-2">
                <div>
                  <span className="text-stone-500">
                    New to {settings.brandName || 'MUSHAY'}?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthModalMode('signup')}
                      className="text-[#8B2E0B] hover:underline font-bold cursor-pointer"
                    >
                      Create an account
                    </button>
                  </span>
                </div>

                <div className="pt-3 border-t border-[#A0645A]/20 flex items-center justify-between gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('mushay@gamil.com');
                      setLoginPassword('admin12345');
                      setFeedback(null);
                    }}
                    className="text-[#8B2E0B] hover:underline text-[11px] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    ⚡ Quick Fill Store Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      navigateTo('admin');
                    }}
                    className="text-[#55504A] hover:text-[#8B2E0B] text-[11px] font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="w-3 h-3 text-[#8B2E0B]" />
                    <span>Go to Admin Portal →</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* 2. CUSTOMER SIGN UP FORM */}
          {authModalMode === 'signup' && (
            <form onSubmit={handleCustomerSignup} className="space-y-3.5 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-[#111111] mb-1 font-bold">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    required
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    placeholder="Lady Jacqueline Vance"
                    className="w-full bg-white border border-[#A0645A]/30 focus:border-[#8B2E0B] pl-10 pr-3 py-2 text-[#111111] rounded-[14px] focus:outline-none transition-colors shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-[#111111] mb-1 font-bold">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
                    <input
                      type="email"
                      required
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      placeholder="client@mushay.com"
                      className="w-full bg-white border border-[#A0645A]/30 focus:border-[#8B2E0B] pl-10 pr-3 py-2 text-[#111111] rounded-[14px] focus:outline-none transition-colors shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#111111] mb-1 font-bold">
                    Telephone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={signupData.phone}
                    onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="w-full bg-white border border-[#A0645A]/30 focus:border-[#8B2E0B] px-3.5 py-2 text-[#111111] rounded-[14px] focus:outline-none transition-colors shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#111111] mb-1 font-bold">
                  Create Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
                  <input
                    type="password"
                    required
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-white border border-[#A0645A]/30 focus:border-[#8B2E0B] pl-10 pr-3 py-2 text-[#111111] rounded-[14px] focus:outline-none transition-colors shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#111111] mb-1 font-bold">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  value={signupData.address}
                  onChange={(e) => setSignupData({ ...signupData, address: e.target.value })}
                  placeholder="Atelier Suite, Street 12, Gulberg III"
                  className="w-full bg-white border border-[#A0645A]/30 focus:border-[#8B2E0B] px-3.5 py-2 text-[#111111] rounded-[14px] focus:outline-none transition-colors shadow-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#8B2E0B] hover:bg-[#702407] text-white font-bold uppercase tracking-widest rounded-[16px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <span>{isSubmitting ? 'Creating Profile...' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <span className="text-stone-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('login')}
                    className="text-[#8B2E0B] hover:underline font-bold cursor-pointer"
                  >
                    Sign in here
                  </button>
                </span>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
