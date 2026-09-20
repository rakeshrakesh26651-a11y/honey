import React from 'react';
import { TextRevealOnScroll } from './TextRevealOnScroll';

interface AnimatedHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div';
  className?: string;
  delay?: number;
  stagger?: number;
  animateOnMount?: boolean;
}

/**
 * Editorial Text Reveal on Scroll Component
 * Recreates the Framer scroll-driven progressive word reveal.
 */
export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  text,
  as = 'h2',
  className = '',
  animateOnMount = false,
}) => {
  return (
    <TextRevealOnScroll
      text={text}
      as={as}
      className={className}
      animateOnMount={animateOnMount}
    />
  );
};
