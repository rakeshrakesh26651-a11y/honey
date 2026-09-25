import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/motion/PageTransition';
import { useAuth } from '../context/AuthContext';
import { LogoutIcon } from '../components/Icons';

interface AccountPageProps {
  mode: 'login' | 'signup' | 'forgot-password' | 'account';
  onNavigate: (path: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  mode,
  onNavigate,
}) => {
  const { user, userProfile, loading, error, clearError, login, signup, logout, resetPassword } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSentEmail, setResetSentEmail] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Clear errors when mode changes
  useEffect(() => {
    setLocalError(null);
    clearError();
  }, [mode]);

  // Protect /account: automatically redirect unauthenticated visitors to /login
  useEffect(() => {
    if (!loading && !user && mode === 'account') {
      onNavigate('/login');
    }
  }, [loading, user, mode, onNavigate]);

  // Redirect already authenticated visitors from /login or /signup to /account
  useEffect(() => {
    if (!loading && user && (mode === 'login' || mode === 'signup')) {
      onNavigate('/account');
    }
  }, [loading, user, mode, onNavigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setLocalError(null);
    clearError();

    if (!email.trim() || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      onNavigate('/account');
    } catch (err: any) {
      setLocalError(err?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setLocalError(null);
    clearError();

    if (!name.trim()) {
      setLocalError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setLocalError('Please enter your phone number.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(name, email, phone, password);
      onNavigate('/account');
    } catch (err: any) {
      setLocalError(err?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setLocalError(null);
    clearError();

    if (!email.trim()) {
      setLocalError('Please enter your registered email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setResetSentEmail(email.trim());
    } catch (err: any) {
      setLocalError(err?.message || 'Failed to send password reset email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    onNavigate('/login');
    try {
      await logout();
    } catch (err: any) {
      console.warn('Logout notice:', err);
    }
  };

  const activeError = localError || error;

  // Format date helper
  const formatMemberDate = (isoOrTimestamp?: string | null) => {
    if (!isoOrTimestamp) return 'Recent Member';
    try {
      const d = new Date(isoOrTimestamp);
      return isNaN(d.getTime())
        ? 'Recent Member'
        : d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
      return 'Recent Member';
    }
  };

  // Auth Loading Screen: Only shown on initial cold start session restoration
  if (loading) {
    return (
      <PageTransition>
        <div className="w-full bg-[#F4F1EA] min-h-[70vh] flex items-center justify-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 border-2 border-[#C9892E] border-t-transparent rounded-full animate-spin" />
            <p className="font-mono text-[12px] uppercase tracking-widest text-[#686863]">
              Loading Himalayan Harvest Account...
            </p>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Logged In Customer Profile View (/account)
  if (user && mode === 'account') {
    const displayName =
      userProfile?.name?.trim() || user.displayName?.trim() || user.email?.split('@')[0] || 'Harvest Patron';
    const displayEmail = user.email || userProfile?.email || '';
    const displayPhone = userProfile?.phone || 'Not provided';
    const memberSince = formatMemberDate(userProfile?.createdAt || user.metadata?.creationTime);
    const initials = (displayName.slice(0, 2) || 'HH').toUpperCase();

    return (
      <PageTransition>
        <div className="w-full bg-[#F4F1EA] min-h-screen py-10 md:py-16">
          <div className="max-w-[760px] mx-auto px-4 sm:px-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 mb-8 text-[13px] font-mono text-[#686863]">
              <button
                onClick={() => onNavigate('/')}
                className="hover:text-[#242424] transition-colors cursor-pointer"
              >
                HOME
              </button>
              <span>/</span>
              <span className="text-[#242424] font-semibold uppercase">MY ACCOUNT</span>
            </nav>

            {/* Customer Profile Hub Card */}
            <div className="bg-[#FAF9F5] border border-[#D9D7D0] rounded-[24px] p-6 sm:p-10 shadow-[0_4px_24px_rgba(36,36,36,0.04)]">
              {/* Header profile greeting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-[#D9D7D0] gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-[#242424] text-[#DDAA55] flex items-center justify-center font-serif text-2xl font-bold shadow-sm flex-shrink-0">
                    {initials}
                  </div>
                  <div>
                    <span className="font-mono text-[10.5px] uppercase tracking-widest text-[#C9892E] font-bold block">
                      AUTHENTICATED CUSTOMER
                    </span>
                    <h1 className="font-serif text-[26px] sm:text-[30px] font-semibold text-[#242424] leading-tight">
                      {displayName}
                    </h1>
                    <p className="font-sans text-[13.5px] text-[#686863]">
                      <span className="font-medium text-[#242424]">{displayEmail}</span> • Member since {memberSince}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-full border border-[#D9D7D0] hover:border-[#242424] hover:bg-[#242424] hover:text-[#FAF9F5] text-[#242424] font-sans text-[13px] font-semibold transition-colors cursor-pointer self-start sm:self-center"
                >
                  <LogoutIcon size={16} color="currentColor" />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Profile Details Grid */}
              <div className="py-8 border-b border-[#D9D7D0]">
                <h2 className="font-serif text-[19px] font-medium text-[#242424] mb-5">
                  Account Credentials & Contact
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-[14px] bg-[#F4F1EA]/70 border border-[#D9D7D0]/70">
                    <span className="block font-mono text-[10.5px] uppercase tracking-wider text-[#686863] mb-1">
                      Full Name
                    </span>
                    <span className="font-sans text-[15px] font-semibold text-[#242424]">
                      {displayName}
                    </span>
                  </div>

                  <div className="p-4 rounded-[14px] bg-[#F4F1EA]/70 border border-[#D9D7D0]/70">
                    <span className="block font-mono text-[10.5px] uppercase tracking-wider text-[#686863] mb-1">
                      Email Address
                    </span>
                    <span className="font-sans text-[15px] font-semibold text-[#242424] break-all">
                      {displayEmail}
                    </span>
                  </div>

                  <div className="p-4 rounded-[14px] bg-[#F4F1EA]/70 border border-[#D9D7D0]/70">
                    <span className="block font-mono text-[10.5px] uppercase tracking-wider text-[#686863] mb-1">
                      Phone Number
                    </span>
                    <span className="font-sans text-[15px] font-semibold text-[#242424]">
                      {displayPhone}
                    </span>
                  </div>

                  <div className="p-4 rounded-[14px] bg-[#F4F1EA]/70 border border-[#D9D7D0]/70">
                    <span className="block font-mono text-[10.5px] uppercase tracking-wider text-[#686863] mb-1">
                      Customer ID (UID)
                    </span>
                    <span className="font-mono text-[12px] font-medium text-[#686863] break-all">
                      {user.uid}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Shop Redirection */}
              <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-[17px] font-medium text-[#242424]">
                    Ready to order pure Himalayan honey?
                  </h3>
                  <p className="font-sans text-[13px] text-[#686863]">
                    Explore raw seasonal batches delivered direct from high altitude hives.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('/shop')}
                  className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[14px] font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
                >
                  Explore Pure Honey
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Not Logged In trying to view /account -> show redirecting indicator while routing to /login
  if (!user && mode === 'account') {
    return (
      <PageTransition>
        <div className="w-full bg-[#F4F1EA] min-h-[70vh] flex items-center justify-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 border-2 border-[#C9892E] border-t-transparent rounded-full animate-spin" />
            <p className="font-mono text-[12px] uppercase tracking-widest text-[#686863]">
              Redirecting to Sign In...
            </p>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Form View: Login, Signup, or Forgot-Password
  return (
    <PageTransition>
      <div className="w-full bg-[#F4F1EA] min-h-screen py-10 md:py-16">
        <div className="max-w-[520px] mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8 text-[13px] font-mono text-[#686863]">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#242424] transition-colors cursor-pointer"
            >
              HOME
            </button>
            <span>/</span>
            <span className="text-[#242424] font-semibold uppercase">
              {mode === 'login' && 'LOGIN'}
              {mode === 'signup' && 'CREATE ACCOUNT'}
              {mode === 'forgot-password' && 'RESET PASSWORD'}
            </span>
          </nav>

          {/* Form Card */}
          <div className="bg-[#FAF9F5] border border-[#D9D7D0] rounded-[24px] p-6 sm:p-10 shadow-[0_4px_24px_rgba(36,36,36,0.04)]">
            <div className="text-center space-y-2 mb-7">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#C9892E] font-bold block">
                HIMALAYAN HARVEST HONEY
              </span>
              <h1 className="font-serif text-[28px] sm:text-[32px] font-semibold text-[#242424] leading-tight">
                {mode === 'login' && 'Sign in to your account'}
                {mode === 'signup' && 'Create customer account'}
                {mode === 'forgot-password' && 'Reset your password'}
              </h1>
              <p className="font-sans text-[14px] text-[#686863]">
                {mode === 'login' && 'Access order history, track shipments, and manage preferences.'}
                {mode === 'signup' && 'Join the Himalayan Harvest family for pure honey delivered fresh.'}
                {mode === 'forgot-password' && 'Enter your email address to receive password reset instructions.'}
              </p>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
              {activeError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mb-5 p-3.5 rounded-[12px] bg-[#C9892E]/10 border border-[#C9892E]/40 text-[#9E3628] font-sans text-[13px] flex items-start gap-2.5"
                >
                  <span className="text-[#9E3628] font-bold">⚠️</span>
                  <div className="flex-1">{activeError}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setLocalError(null);
                      clearError();
                    }}
                    className="text-[#9E3628] hover:opacity-75 font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forgot Password Confirmation Screen */}
            {mode === 'forgot-password' && resetSentEmail ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-6 rounded-[16px] bg-[#F4F1EA] border border-[#D9D7D0] space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-[#C9892E]/20 text-[#C9892E] mx-auto flex items-center justify-center font-serif text-2xl font-bold">
                  ✓
                </div>
                <h3 className="font-serif text-[20px] text-[#242424] font-semibold">
                  Check Your Email
                </h3>
                <p className="font-sans text-[13.5px] text-[#686863]">
                  Password reset instructions have been dispatched to{' '}
                  <strong className="text-[#242424]">{resetSentEmail}</strong>. Please check your inbox and spam folders.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setResetSentEmail(null);
                    onNavigate('/login');
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#242424] text-[#FAF9F5] font-sans text-[13px] font-bold cursor-pointer"
                >
                  Return to Sign In
                </button>
              </motion.div>
            ) : (
              /* Authentication Forms */
              <form
                onSubmit={
                  mode === 'login'
                    ? handleLoginSubmit
                    : mode === 'signup'
                    ? handleSignupSubmit
                    : handleResetPasswordSubmit
                }
                className="space-y-4 font-sans"
              >
                {/* Full Name for Signup */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[12px] font-mono uppercase tracking-wider text-[#686863] mb-1.5 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Senthil Murugan"
                      className="w-full px-4 py-3 rounded-[12px] bg-white border border-[#D9D7D0] text-[#242424] font-sans text-[16px] sm:text-[14px] outline-none focus:border-[#C9892E] transition-colors"
                    />
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-[12px] font-mono uppercase tracking-wider text-[#686863] mb-1.5 font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-[12px] bg-white border border-[#D9D7D0] text-[#242424] font-sans text-[16px] sm:text-[14px] outline-none focus:border-[#C9892E] transition-colors"
                  />
                </div>

                {/* Phone Number for Signup */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[12px] font-mono uppercase tracking-wider text-[#686863] mb-1.5 font-medium">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-[12px] bg-white border border-[#D9D7D0] text-[#242424] font-sans text-[16px] sm:text-[14px] outline-none focus:border-[#C9892E] transition-colors"
                    />
                  </div>
                )}

                {/* Password field for Login and Signup */}
                {mode !== 'forgot-password' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[12px] font-mono uppercase tracking-wider text-[#686863] font-medium">
                        Password *
                      </label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => onNavigate('/forgot-password')}
                          className="text-[12px] text-[#C9892E] hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 pr-12 rounded-[12px] bg-white border border-[#D9D7D0] text-[#242424] font-sans text-[16px] sm:text-[14px] outline-none focus:border-[#C9892E] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#686863] hover:text-[#242424] transition-colors cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Confirm Password for Signup */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[12px] font-mono uppercase tracking-wider text-[#686863] mb-1.5 font-medium">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 pr-12 rounded-[12px] bg-white border border-[#D9D7D0] text-[#242424] font-sans text-[16px] sm:text-[14px] outline-none focus:border-[#C9892E] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#686863] hover:text-[#242424] transition-colors cursor-pointer"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Submit Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] disabled:opacity-60 text-[#242424] font-sans text-[15px] font-bold tracking-wide transition-all shadow-sm cursor-pointer flex items-center justify-center space-x-2"
                  >
                    {isSubmitting && (
                      <div className="w-4 h-4 border-2 border-[#242424] border-t-transparent rounded-full animate-spin" />
                    )}
                    <span>
                      {mode === 'login' && (isSubmitting ? 'Signing In...' : 'Sign In')}
                      {mode === 'signup' && (isSubmitting ? 'Creating Account...' : 'Create Account')}
                      {mode === 'forgot-password' && (isSubmitting ? 'Sending Instructions...' : 'Send Reset Link')}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* Mode Switchers */}
            <div className="mt-8 pt-6 border-t border-[#D9D7D0] text-center font-sans text-[13px] text-[#686863]">
              {mode === 'login' && (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('/signup')}
                    className="text-[#242424] font-semibold hover:text-[#C9892E] transition-colors cursor-pointer underline ml-1"
                  >
                    Create one
                  </button>
                </p>
              )}

              {mode === 'signup' && (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('/login')}
                    className="text-[#242424] font-semibold hover:text-[#C9892E] transition-colors cursor-pointer underline ml-1"
                  >
                    Sign in
                  </button>
                </p>
              )}

              {mode === 'forgot-password' && (
                <p>
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('/login')}
                    className="text-[#242424] font-semibold hover:text-[#C9892E] transition-colors cursor-pointer underline ml-1"
                  >
                    Return to Sign In
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
