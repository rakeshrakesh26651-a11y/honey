import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

export type SplitTextTag =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'div';

export interface SplitTextProps {
  text?: string;
  children?: React.ReactNode;
  as?: SplitTextTag;
  className?: string;
  wordClassName?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  translateY?: number;
  ease?: [number, number, number, number] | string;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
  style?: React.CSSProperties;
}

const motionTags: Record<SplitTextTag, typeof motion.div> = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  p: motion.p,
  span: motion.span,
  div: motion.div,
};

/**
 * SplitText
 *
 * High-performance, accessible text reveal component that splits copy by words
 * and smoothly animates opacity and vertical translation using Framer Motion.
 *
 * - Words split cleanly with natural HTML wrapping
 * - Opacity 0 -> 1
 * - translateY 24px -> 0
 * - Duration: 0.7s
 * - Stagger: 0.04s
 * - Smooth luxury ease-out
 * - Viewport trigger with once: true
 * - Full prefers-reduced-motion support
 * - Zero WebGL, canvas, distortion, 3D, or mouse tracking
 */
export const SplitText: React.FC<SplitTextProps> = ({
  text,
  children,
  as = 'div',
  className = '',
  wordClassName = '',
  delay = 0,
  duration = 0.7,
  stagger = 0.04,
  translateY = 24,
  ease = [0.16, 1, 0.3, 1],
  once = true,
  threshold = 0.2,
  rootMargin,
  style,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const rawText = text ?? (typeof children === 'string' ? children : '');

  // Respect user preference for reduced motion
  if (shouldReduceMotion) {
    const FallbackTag = as;
    return (
      <FallbackTag className={className} style={style}>
        {rawText || children}
      </FallbackTag>
    );
  }

  if (!rawText && !children) {
    return null;
  }

  // Fall back to children directly if complex non-string children are passed without text
  if (!rawText && children) {
    const FallbackTag = as;
    return (
      <FallbackTag className={className} style={style}>
        {children}
      </FallbackTag>
    );
  }

  const MotionComponent = motionTags[as] || motion.div;

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: translateY,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: ease as any,
      },
    },
  };

  const lines = rawText.split('\n');

  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      viewport={{
        once,
        amount: threshold,
        margin: rootMargin,
      }}
      variants={containerVariants}
      className={className}
      style={style}
    >
      {lines.length > 1
        ? lines.map((line, lineIdx) => {
            const lineWords = line.trim().split(/\s+/).filter(Boolean);
            return (
              <span key={lineIdx} className="block">
                {lineWords.map((word, wordIdx) => (
                  <React.Fragment key={`${word}-${wordIdx}`}>
                    <motion.span
                      variants={wordVariants}
                      className={`inline-block ${wordClassName}`.trim()}
                    >
                      {word}
                    </motion.span>
                    {wordIdx < lineWords.length - 1 && ' '}
                  </React.Fragment>
                ))}
              </span>
            );
          })
        : rawText
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map((word, wordIdx, arr) => (
              <React.Fragment key={`${word}-${wordIdx}`}>
                <motion.span
                  variants={wordVariants}
                  className={`inline-block ${wordClassName}`.trim()}
                >
                  {word}
                </motion.span>
                {wordIdx < arr.length - 1 && ' '}
              </React.Fragment>
            ))}
    </MotionComponent>
  );
};

export default SplitText;
