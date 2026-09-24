import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AdminCard, AdminButton, AdminInput, AdminIcons } from '../components/ui';
import { BrandLogo } from '../../components/BrandLogo';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const { adminUser, isAdmin, loginAdmin, error, clearError } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const getRedirectTarget = (): string => {
    try {
      const url = new URL(window.location.href);
      return url.searchParams.get('redirect') || '/admin';
    } catch {
      return '/admin';
    }
  };

  useEffect(() => {
    if (adminUser && isAdmin) {
      onNavigate(getRedirectTarget());
    }
  }, [adminUser, isAdmin, onNavigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setLocalError(null);
    clearError();

    if (!email.trim() || !password) {
      setLocalError('Please enter both administrative email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await loginAdmin(email, password);
      onNavigate(getRedirectTarget());
    } catch (err: any) {
      setLocalError(err.message || 'Login failed. Please verify administrative credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeError = localError || error;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C241E] flex flex-col justify-between p-4 sm:p-6 md:p-8 selection:bg-[#FAF3E8] selection:text-[#9B6418]">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="cursor-pointer text-left flex items-center gap-3"
          aria-label="Himalayan Harvest Honey Home"
        >
          <BrandLogo variant="admin-login" />
          <span className="hidden sm:inline-block font-mono text-[9.5px] uppercase tracking-widest text-[#C9892E] font-bold border-l border-[#EBE6DD] pl-3 py-1">
            Admin Portal
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="font-sans text-xs text-[#73665C] hover:text-[#2C241E] transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>View Customer Storefront</span>
          <AdminIcons.ExternalLink className="w-3.5 h-3.5 text-[#C9892E]" />
        </button>
      </div>

      {/* Main Login Card Center */}
      <div className="max-w-[420px] w-full mx-auto my-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <AdminCard padding="lg" className="border-[#EBE6DD] shadow-[0_16px_48px_rgba(44,36,30,0.06)]">
            <div className="text-center space-y-3 mb-7">
              <div className="flex justify-center mb-1">
                <BrandLogo variant="admin-login-card" />
              </div>
              <h1 className="font-serif text-2xl font-semibold text-[#2C241E]">
                Administrator Sign In
              </h1>
              <p className="font-sans text-xs text-[#73665C]">
                Authorized access only. Verified cryptographic token claims enforced.
              </p>
            </div>

            <AnimatePresence>
              {activeError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] font-sans text-xs flex items-start gap-2"
                >
                  <span className="font-bold flex-shrink-0">⚠</span>
                  <span className="flex-1 leading-snug">{activeError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <AdminInput
                label="Admin Email Address"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@himalayanharvest.com"
              />

              <AdminInput
                label="Password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
              />

              <div className="pt-2">
                <AdminButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full"
                >
                  Authenticate to Control Console
                </AdminButton>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-[#EBE6DD] text-center">
              <p className="font-mono text-[10.5px] text-[#8C8075] leading-relaxed">
                Accounts lacking the server-provisioned <code className="text-[#C9892E] font-bold">admin: true</code> custom claim are automatically blocked.
              </p>
            </div>
          </AdminCard>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl w-full mx-auto text-center py-2 text-[11px] font-mono text-[#8C8075]">
        Himalayan Harvest Honey • Enterprise Administration System
      </div>
    </div>
  );
};
