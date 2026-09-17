import React from 'react';
import { motion } from 'framer-motion';

interface PolicyPageProps {
  onNavigateHome: () => void;
}

export const RefundPolicy: React.FC<PolicyPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="w-full bg-[#f7f2e7] py-12 md:py-20">
      <div className="max-w-[880px] mx-auto px-5 sm:px-8">
        {/* Breadcrumb / Back Link */}
        <div className="mb-8">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 font-sans text-[14px] font-medium text-[#1e1a16]/70 hover:text-[#1e1a16] transition-colors cursor-pointer group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>Back to Home</span>
          </button>
        </div>

        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pb-8 mb-10 border-b border-[#1e1a16]/10"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-4 h-[1.5px] bg-[#657044] inline-block" />
            <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.12em] text-[#657044] font-medium">
              CUSTOMER CARE & POLICIES
            </span>
          </div>
          <h1 className="font-serif text-[32px] sm:text-[42px] md:text-[48px] font-semibold text-[#1e1a16] leading-[1.15] tracking-[-0.01em] mb-3">
            Refund & Return Policy
          </h1>
          <p className="font-sans text-[13px] sm:text-[14px] text-[#1e1a16]/60">
            Last Updated: <span className="font-medium text-[#1e1a16]/80">September 2026</span>
          </p>
        </motion.div>

        {/* Policy Highlights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="p-6 rounded-[16px] bg-white border border-[#657044]/25 shadow-xs space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#657044] font-semibold block">
              RETURN WINDOW
            </span>
            <h2 className="font-serif text-[22px] font-semibold text-[#1e1a16]">
              24-Hour Return Request
            </h2>
            <p className="font-sans text-[14px] text-[#1e1a16]/80 leading-relaxed">
              Customers must request a return within 24 hours of receiving the product. Bottle must be unopened with seal intact.
            </p>
          </div>

          <div className="p-6 rounded-[16px] bg-white border border-[#657044]/25 shadow-xs space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#657044] font-semibold block">
              REFUND PROCESSING
            </span>
            <h2 className="font-serif text-[22px] font-semibold text-[#1e1a16]">
              Within 10 Days
            </h2>
            <p className="font-sans text-[14px] text-[#1e1a16]/80 leading-relaxed">
              Once an eligible return is accepted, the refund will be processed within 10 days (applicable courier charges deducted).
            </p>
          </div>
        </div>

        {/* Detailed Policy Sections */}
        <div className="space-y-10 font-sans text-[15px] sm:text-[16px] text-[#1e1a16]/85 leading-[1.75]">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#1e1a16] leading-snug">
              1. Return Window
            </h2>
            <p>
              Customers may request a return within <strong>24 hours</strong> of receiving their order.
            </p>
            <p>
              Return requests made after this period may not be accepted.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#1e1a16] leading-snug">
              2. Return Eligibility
            </h2>
            <p>To be eligible for a return:</p>
            <ul className="list-disc pl-6 space-y-1.5 marker:text-[#657044]">
              <li>The honey bottle must be unopened.</li>
              <li>The original bottle seal must remain intact.</li>
              <li>The product must not have been consumed or used.</li>
              <li>The product must be returned in its original condition.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 p-5 sm:p-6 rounded-[14px] bg-white border border-[#1e1a16]/10">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#1e1a16] leading-snug">
              3. Opened or Consumed Products
            </h2>
            <p>
              Because honey is a food product, we cannot accept returns of products where the bottle has been opened, the seal has been broken/tampered with, or the product has been consumed.
            </p>
            <p className="font-medium text-[#1e1a16]">
              Such products are not eligible for a refund.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#1e1a16] leading-snug">
              4. Refunds
            </h2>
            <p>
              Once an eligible return is accepted, the refund will be processed <strong>within 10 days</strong>.
            </p>
            <p>
              The actual time for the refunded amount to appear in the customer's bank account or payment method may depend on the relevant payment provider or bank.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#1e1a16] leading-snug">
              5. Courier / Shipping Charges
            </h2>
            <p>
              Applicable courier or shipping charges will be deducted from the refund amount for eligible returns.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#1e1a16] leading-snug">
              6. How to Request a Return
            </h2>
            <p>
              To request a return, contact Himalayan Harvest Honey within 24 hours of receiving your order.
            </p>
            <p>
              Please provide your order details and the necessary information regarding the return request.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 pt-2">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#1e1a16] leading-snug">
              7. Contact Us
            </h2>
            <div className="p-6 sm:p-8 rounded-[16px] bg-white border border-[#1e1a16]/10 space-y-2">
              <p className="font-semibold text-[#1e1a16]">Himalayan Harvest Honey</p>
              <p>
                Phone / WhatsApp:{' '}
                <a
                  href="https://wa.me/918124391725?text=Hello%20Himalayan%20Harvest%20Honey!%20%F0%9F%91%8B%0A%0AI%20have%20a%20query%20regarding%20returns%20and%20refunds."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[#657044] hover:underline font-medium"
                >
                  +91 81243 91725
                </a>
              </p>
              <p>
                Instagram:{' '}
                <a
                  href="https://instagram.com/himalayanharvesthoney"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#657044] hover:underline font-medium"
                >
                  @himalayanharvesthoney
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
