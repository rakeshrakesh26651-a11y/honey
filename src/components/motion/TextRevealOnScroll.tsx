import React, { useRef, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  animate,
  MotionValue,
} from 'framer-motion';

export interface TextRevealOnScrollProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  style?: React.CSSProperties;
  animateOnMount?: boolean;
}

interface WordProps {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word: React.FC<WordProps> = ({ word, progress, range }) => {
  // Smooth upward reveal (8px -> 0px) + subtle opacity transition (0.2 -> 1.0)
  // Matching the Framer reference motion profile
  const opacity = useTransform(progress, range, [0.2, 1]);
  const y = useTransform(progress, range, [8, 0]);

  return (
    <motion.span
      style={{ opacity, y, display: 'inline-block', willChange: 'opacity, transform' }}
    >
      {word}
    </motion.span>
  );
};

export const TextRevealOnScroll: React.FC<TextRevealOnScrollProps> = ({
  text,
  as: Component = 'h2',
  className = '',
  style = {},
  animateOnMount = false,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Track progress as element scrolls from 92% (entering near bottom) to 55% (upper-mid viewport)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 92%', 'start 55%'],
    layoutEffect: false,
  });

  const maxProgress = useMotionValue(0);

  // Progressive reveal: once revealed, words stay revealed without reverse flash
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest > maxProgress.get()) {
      maxProgress.set(latest);
    }
  });

  // Spring physics matching luxury editorial reference
  const progress = useSpring(maxProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.8,
  });

  // Check initial viewport position on mount
  useEffect(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const isAboveOrInUpperViewport = rect.top < window.innerHeight * 0.75;

    if (isAboveOrInUpperViewport || animateOnMount) {
      animate(maxProgress, 1, {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      });
    } else {
      const initialScroll = scrollYProgress.get();
      if (initialScroll > 0) {
        maxProgress.set(initialScroll);
      }
    }
  }, [animateOnMount, maxProgress, scrollYProgress]);

  // Respect prefers-reduced-motion: render plain static typography immediately
  if (shouldReduceMotion) {
    return (
      <Component className={className} style={style}>
        {text}
      </Component>
    );
  }

  // Handle multi-line strings (\n)
  const lines = text.split('\n');
  const allWords = text.trim().split(/\s+/).filter(Boolean);
  const totalWords = Math.max(allWords.length, 1);
  let globalWordIndex = 0;

  return (
    <Component
      ref={containerRef as any}
      className={className}
      style={style}
    >
      {lines.length > 1 ? (
        lines.map((line, lineIndex) => {
          const words = line.trim().split(/\s+/).filter(Boolean);

          return (
            <span key={lineIndex} className="block">
              {words.map((word, wordIndex) => {
                const start = Math.max(0, globalWordIndex / totalWords);
                const end = Math.min(1, (globalWordIndex + 1.25) / totalWords);
                const idx = globalWordIndex;
                globalWordIndex++;

                return (
                  <React.Fragment key={`${word}-${idx}`}>
                    <Word
                      word={word}
                      progress={progress}
                      range={[start, end]}
                    />
                    {wordIndex < words.length - 1 ? ' ' : null}
                  </React.Fragment>
                );
              })}
            </span>
          );
        })
      ) : (
        allWords.map((word, wordIndex) => {
          const start = Math.max(0, wordIndex / totalWords);
          const end = Math.min(1, (wordIndex + 1.25) / totalWords);

          return (
            <React.Fragment key={`${word}-${wordIndex}`}>
              <Word
                word={word}
                progress={progress}
                range={[start, end]}
              />
              {wordIndex < allWords.length - 1 ? ' ' : null}
            </React.Fragment>
          );
        })
      )}
    </Component>
  );
};
