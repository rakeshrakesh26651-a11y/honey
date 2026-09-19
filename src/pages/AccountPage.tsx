import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/motion/PageTransition';

interface AccountPageProps {
  initialMode?: 'login' | 'signup' | 'forgot-password' | 'account';
  onNavigate: (path: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  initialMode = 'login',
  onNavigate,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password' | 'account'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageTransition>
      <div className="w-full bg-[#F4F1EA] min-h-screen py-12 md:py-20">
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
              {mode === 'account' && 'MY ACCOUNT'}
            </span>
          </nav>

          {/* Form Card */}
          <div className="bg-[#FAF9F5] border border-[#D9D7D0] rounded-[24px] p-8 sm:p-10 shadow-[0_4px_24px_rgba(36,36,36,0.04)]">
            <div className="text-center space-y-2 mb-8">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#C9892E] font-bold block">
                HIMALAYAN HARVEST HONEY
              </span>
              <h1 className="font-serif text-[30px] sm:text-[34px] font-semibold text-[#242424] leading-tight">
                {mode === 'login' && 'Sign in to your account'}
                {mode === 'signup' && 'Create your account'}
                {mode === 'forgot-password' && 'Reset your password'}
                {mode === 'account' && 'Welcome to your account'}
              </h1>
              <p className="font-sans text-[14px] text-[#686863]">
                {mode === 'login' && 'Access order history, track shipments, and manage preferences.'}
                {mode === 'signup' && 'Join the Himalayan Harvest family for seamless mountain orders.'}
                {mode === 'forgot-password' && 'Enter your email to receive recovery instructions.'}
                {mode === 'account' && 'Manage your orders and pure honey subscriptions.'}
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-6 rounded-[16px] bg-[#F4F1EA] border border-[#D9D7D0] space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-[#C9892E]/15 text-[#C9892E] mx-auto flex items-center justify-center font-serif text-2xl font-bold">
                  ✓
                </div>
                <p className="font-serif text-[18px] text-[#242424] font-medium">
                  {mode === 'forgot-password'
                    ? 'Password reset instructions have been sent to your email.'
                    : 'Account action completed successfully.'}
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMode('login');
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#242424] text-[#FAF9F5] font-sans text-[13px] font-bold"
                >
                  Return to Sign In
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-sans">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[12px] font-mono uppercase tracking-wider text-[#686863] mb-1.5 font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Senthil Murugan"
                      className="w-full px-4 py-3 rounded-[12px] bg-white border border-[#D9D7D0] text-[#242424] font-sans text-[14px] outline-none focus:border-[#C9892E] transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[12px] font-mono uppercase tracking-wider text-[#686863] mb-1.5 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-[12px] bg-white border border-[#D9D7D0] text-[#242424] font-sans text-[14px] outline-none focus:border-[#C9892E] transition-colors"
                  />
                </div>

                {mode !== 'forgot-password' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[12px] font-mono uppercase tracking-wider text-[#686863] font-medium">
                        Password
                      </label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => setMode('forgot-password')}
                          className="text-[12px] text-[#C9892E] hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-[12px] bg-white border border-[#D9D7D0] text-[#242424] font-sans text-[14px] outline-none focus:border-[#C9892E] transition-colors"
                    />
                  </div>
                )}

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[15px] font-bold tracking-wide transition-all shadow-sm cursor-pointer"
                  >
                    {mode === 'login' && 'Sign In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'forgot-password' && 'Send Reset Link'}
                    {mode === 'account' && 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* Mode Switcher */}
            <div className="mt-8 pt-6 border-t border-[#D9D7D0] text-center font-sans text-[13px] text-[#686863]">
              {mode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setMode('signup');
                    }}
                    className="text-[#242424] font-semibold hover:text-[#C9892E] transition-colors cursor-pointer underline ml-1"
                  >
                    Create one
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setMode('login');
                    }}
                    className="text-[#242424] font-semibold hover:text-[#C9892E] transition-colors cursor-pointer underline ml-1"
                  >
                    Sign in
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
