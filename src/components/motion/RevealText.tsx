import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface RevealTextProps {
  children: React.ReactNode;
  as?: 'p' | 'span' | 'div' | 'h4' | 'h5';
  className?: string;
  delay?: number;
  y?: number;
}

/**
 * Editorial Subtitle and Paragraph Motion Reveal
 * Subtle vertical slide with opacity fade
 */
export const RevealText: React.FC<RevealTextProps> = ({
  children,
  as: Component = 'p',
  className = '',
  delay = 0.25,
  y = 22,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
