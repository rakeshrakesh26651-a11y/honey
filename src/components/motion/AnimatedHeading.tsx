import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface AnimatedHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div';
  className?: string;
  delay?: number;
  stagger?: number;
  animateOnMount?: boolean;
}

/**
 * OLIO-Style Masked Typography Animation
 * Each line is revealed smoothly from behind an overflow-hidden clip container.
 * Uses high-end editorial cubic-bezier easing with zero bounce.
 */
export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  text,
  as: Component = 'h2',
  className = '',
  delay = 0.05,
  stagger = 0.08,
  animateOnMount = false,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const lines = text.split('\n');

  if (shouldReduceMotion) {
    return <Component className={className}>{text}</Component>;
  }

  // If animateOnMount is true OR if it's the main page h1, trigger animation on mount
  const isMountAnimation = animateOnMount || Component === 'h1';

  return (
    <Component className={className}>
      {lines.map((line, index) => (
        <span
          key={`${line}-${index}`}
          className="block overflow-hidden leading-[1.08] py-0.5"
        >
          <motion.span
            className="block"
            initial={{ y: '110%', opacity: 0 }}
            {...(isMountAnimation
              ? { animate: { y: '0%', opacity: 1 } }
              : { whileInView: { y: '0%', opacity: 1 }, viewport: { once: true, amount: 0 } }
            )}
            transition={{
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1], // Expo-style luxury easing
              delay: delay + index * stagger,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Component>
  );
};
