import React from 'react';
import { motion } from 'framer-motion';

interface PolicyPageProps {
  onNavigateHome: () => void;
}

export const TermsAndConditions: React.FC<PolicyPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="w-full bg-[#FAF8F0] py-12 md:py-20">
      <div className="max-w-[880px] mx-auto px-5 sm:px-8">
        {/* Breadcrumb / Back Link */}
        <div className="mb-8">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 font-sans text-[14px] font-medium text-[#123C2D]/70 hover:text-[#123C2D] transition-colors cursor-pointer group"
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
          className="pb-8 mb-10 border-b border-[#D9D5C8]"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-4 h-[1.5px] bg-[#D6A83A] inline-block" />
            <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.12em] text-[#D6A83A] font-semibold">
              LEGAL & COMPLIANCE
            </span>
          </div>
          <h1 className="font-serif text-[32px] sm:text-[42px] md:text-[48px] font-semibold text-[#123C2D] leading-[1.15] tracking-[-0.01em] mb-3">
            Terms & Conditions
          </h1>
          <p className="font-sans text-[13px] sm:text-[14px] text-[#2A2118]/60">
            Last Updated: <span className="font-medium text-[#2A2118]/80">September 2026</span>
          </p>
        </motion.div>

        {/* Terms Content */}
        <div className="space-y-10 font-sans text-[15px] sm:text-[16px] text-[#2A2118]/85 leading-[1.75]">
          <p className="text-[17px] sm:text-[18px] text-[#123C2D] leading-[1.6] font-normal">
            Welcome to Himalayan Harvest Honey. These Terms & Conditions govern your access to and use of our website, ordering channels, and the purchase of our products.
          </p>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#123C2D] leading-snug">
              1. About Our Website
            </h2>
            <p>
              This website provides information about Himalayan Harvest Honey, our heritage, natural honey varieties, cultured ghee, lab testing certifications, and facilitates direct ordering.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#123C2D] leading-snug">
              2. Products & Information
            </h2>
            <p>
              We endeavor to describe and display our products, including honey and cultured ghee, as accurately as possible. Because our products are pure and naturally harvested, natural variations in aroma, color, texture, and crystallization may occur.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#123C2D] leading-snug">
              3. Orders
            </h2>
            <p>
              Orders placed through the website or our WhatsApp ordering channel constitute an offer to purchase the specified products. Order confirmation is subject to product availability and verification.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#123C2D] leading-snug">
              4. Pricing
            </h2>
            <p>
              All prices are listed in Indian Rupees (₹). We reserve the right to modify prices, promotional offers, and product availability at any time without prior notice.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#123C2D] leading-snug">
              5. Payment
            </h2>
            <p>
              Payments may be completed through authorized third-party payment gateways, UPI, bank transfers, or cash on delivery where offered. Payment transactions are processed under the respective provider’s security protocols.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#123C2D] leading-snug">
              6. Delivery
            </h2>
            <p>
              Products will be delivered to the delivery address provided by the customer at the time of placing the order.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 p-5 sm:p-6 rounded-[14px] bg-white border border-[#D9D5C8]">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#123C2D] leading-snug">
              7. Returns
            </h2>
            <div className="space-y-2">
              <p className="font-medium text-[#123C2D]">
                Return Period: <span className="text-[#C99528] font-bold">Within 24 hours of delivery</span>
              </p>
              <p>
                Customers may request a return within 24 hours of receiving the product. The product must be completely unopened with the bottle seal intact. Because honey is a food product, opened, used, or consumed products cannot be accepted.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 p-5 sm:p-6 rounded-[14px] bg-white border border-[#D9D5C8]">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#123C2D] leading-snug">
              8. Refunds
            </h2>
            <div className="space-y-2">
              <p className="font-medium text-[#123C2D]">
                Refund Processing: <span className="text-[#C99528] font-bold">Within 10 days</span> of acceptance of an eligible return.
              </p>
              <p>
                Applicable courier and shipping charges will be deducted from the refund amount for eligible returns.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#123C2D] leading-snug">
              9. Cancellation
            </h2>
            <p>
              Cancellation requests may be submitted by contacting us directly before the order has been dispatched.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#123C2D] leading-snug">
              10. Intellectual Property
            </h2>
            <p>
              All trademarks, logos, content, imagery, and text on this website are the property of Himalayan Harvest Honey and may not be reproduced without written permission.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#123C2D] leading-snug">
              11. Website Use
            </h2>
            <p>
              You agree to use this website solely for lawful purposes and not to engage in any activity that disrupts or interferes with its functionality or security.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#123C2D] leading-snug">
              12. Changes to These Terms
            </h2>
            <p>
              We reserve the right to revise these Terms & Conditions at any time. Any changes will be published directly on this page.
            </p>
          </section>

          {/* Section 13 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#123C2D] leading-snug">
              13. Contact
            </h2>
            <p>
              For inquiries regarding these Terms & Conditions, please reach out to:
            </p>
            <div className="mt-4 p-6 rounded-[16px] bg-white border border-[#D9D5C8] space-y-2">
              <p className="font-semibold text-[#123C2D]">Himalayan Harvest Honey</p>
              <p>
                Phone / WhatsApp:{' '}
                <a
                  href="https://wa.me/918124391725"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[#123C2D] hover:text-[#D6A83A] underline font-medium transition-colors"
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
                  className="text-[#123C2D] hover:text-[#D6A83A] underline font-medium transition-colors"
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
