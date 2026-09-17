import React from 'react';
import { motion } from 'framer-motion';

interface PolicyPageProps {
  onNavigateHome: () => void;
}

export const PrivacyPolicy: React.FC<PolicyPageProps> = ({ onNavigateHome }) => {
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
              LEGAL & COMPLIANCE
            </span>
          </div>
          <h1 className="font-serif text-[32px] sm:text-[42px] md:text-[48px] font-semibold text-[#1e1a16] leading-[1.15] tracking-[-0.01em] mb-3">
            Privacy Policy
          </h1>
          <p className="font-sans text-[13px] sm:text-[14px] text-[#1e1a16]/60">
            Last Updated: <span className="font-medium text-[#1e1a16]/80">September 2026</span>
          </p>
        </motion.div>

        {/* Policy Content */}
        <div className="space-y-10 font-sans text-[15px] sm:text-[16px] text-[#1e1a16]/85 leading-[1.75]">
          <p className="text-[17px] sm:text-[18px] text-[#1e1a16] leading-[1.6] font-normal">
            Himalayan Harvest Honey respects your privacy and is committed to protecting the personal information you provide when using our website.
          </p>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#1e1a16] leading-snug">
              1. Information We May Collect
            </h2>
            <p>We may collect:</p>
            <ul className="list-disc pl-6 space-y-1.5 marker:text-[#657044]">
              <li>Name</li>
              <li>Mobile/phone number</li>
              <li>Email address, where provided</li>
              <li>Delivery address</li>
              <li>Order and product information</li>
              <li>Payment-related transaction information</li>
              <li>Information voluntarily provided when contacting us</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#1e1a16] leading-snug">
              2. How We Use Your Information
            </h2>
            <p>Information may be used to:</p>
            <ul className="list-disc pl-6 space-y-1.5 marker:text-[#657044]">
              <li>Process and fulfil orders</li>
              <li>Arrange delivery</li>
              <li>Contact you regarding your order</li>
              <li>Handle returns, cancellations and refunds</li>
              <li>Provide customer support</li>
              <li>Maintain website security</li>
              <li>Improve our website and services where applicable</li>
              <li>Meet legal or regulatory requirements</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#1e1a16] leading-snug">
              3. Payment Information
            </h2>
            <p>
              Online payments may be processed through a third-party payment service provider.
            </p>
            <p>
              The website should not store customers' complete card numbers, CVV, UPI PINs, banking passwords or similar sensitive payment credentials.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#1e1a16] leading-snug">
              4. WhatsApp & Communication
            </h2>
            <p>
              If customers contact or place an order through WhatsApp, information shared through WhatsApp may be processed according to WhatsApp/Meta's applicable terms and privacy policies.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#1e1a16] leading-snug">
              5. Cookies
            </h2>
            <p>
              The website may use cookies or similar technologies for essential functionality, security, performance and analytics where applicable.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#1e1a16] leading-snug">
              6. Sharing Information
            </h2>
            <p>Relevant information may be shared with service providers when necessary to:</p>
            <ul className="list-disc pl-6 space-y-1.5 marker:text-[#657044]">
              <li>Fulfil orders</li>
              <li>Deliver products</li>
              <li>Process payments</li>
              <li>Provide technology services</li>
              <li>Provide customer support</li>
              <li>Meet legal requirements</li>
            </ul>
            <p className="font-medium text-[#1e1a16] pt-1">
              We do not intend to sell customers' personal information.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#1e1a16] leading-snug">
              7. Data Security
            </h2>
            <p>
              Reasonable measures are taken to protect personal information from unauthorized access, misuse, alteration or disclosure.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#1e1a16] leading-snug">
              8. Data Retention
            </h2>
            <p>
              Information may be retained as reasonably necessary for order fulfilment, customer support, business records, legal obligations and dispute resolution.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#1e1a16] leading-snug">
              9. Privacy Requests
            </h2>
            <p>
              Customers may contact Himalayan Harvest Honey regarding applicable privacy-related requests.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#1e1a16] leading-snug">
              10. Changes
            </h2>
            <p>
              This Privacy Policy may be updated from time to time. The latest version will be published on this page.
            </p>
          </section>

          {/* Contact Box */}
          <div className="mt-12 p-6 sm:p-8 rounded-[16px] bg-white border border-[#1e1a16]/10 space-y-3">
            <h3 className="font-serif text-[20px] font-semibold text-[#1e1a16]">
              Contact Us
            </h3>
            <p className="text-[#1e1a16]/80">
              For any questions or requests concerning this Privacy Policy, please contact:
            </p>
            <div className="space-y-1 font-sans text-[15px] pt-1">
              <p className="font-semibold text-[#1e1a16]">Himalayan Harvest Honey</p>
              <p>
                Phone / WhatsApp:{' '}
                <a
                  href="https://wa.me/918124391725"
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
          </div>
        </div>
      </div>
    </div>
  );
};
