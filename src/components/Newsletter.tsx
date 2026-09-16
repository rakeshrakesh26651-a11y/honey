import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <section id="newsletter" className="w-full bg-[#657044] py-20 lg:py-24 text-white">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[640px] mx-auto space-y-4"
        >
          <h2 className="font-serif text-[32px] md:text-[48px] font-semibold text-white leading-[1.1] tracking-[-0.01em]">
            Get the next harvest.
          </h2>

          <p className="font-sans text-[16px] font-normal text-white/90 leading-[1.6] max-w-[520px] mx-auto">
            Be the first to hear about new honey varieties, small mountain batches, and updates from Himalayan Harvest.
          </p>

          {/* Form matching 326px input pill and 142px button pill */}
          <div className="pt-4">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block px-8 py-3.5 rounded-full bg-white text-[#1e1a16] font-sans font-medium text-[15px] shadow-sm"
              >
                You're on the list! Welcome to Himalayan Harvest. 🍯
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-[480px] mx-auto"
              >
                <div className="w-full sm:w-[326px] h-[48px] px-6 rounded-full bg-white flex items-center shadow-xs">
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-[#1e1a16] font-sans text-[15px] outline-none placeholder-[#1e1a16]/50"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto h-[48px] px-7 rounded-full bg-white hover:bg-[#f7f2e7] text-[#1e1a16] font-sans text-[15px] font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xs whitespace-nowrap cursor-pointer"
                >
                  Join the list
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
