'use client';

import React, { memo, useEffect, useRef, useState, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

// Enhanced animation configurations
export const animationPresets = {
  // Entrance animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6, ease: 'easeOut' }
  },
  slideInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: 'easeOut' }
  },
  slideInDown: {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: 'easeOut' }
  },
  slideInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: 'easeOut' }
  },
  slideInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: 'easeOut' }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: 'easeOut' }
  },
  rotateIn: {
    initial: { opacity: 0, rotate: -10 },
    animate: { opacity: 1, rotate: 0 },
    transition: { duration: 0.8, ease: 'easeOut' }
  },
  // Complex entrance animations
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: 0.8,
      ease: [0.68, -0.55, 0.265, 1.55]
    }
  },
  flipIn: {
    initial: { opacity: 0, rotateY: -90 },
    animate: { opacity: 1, rotateY: 0 },
    transition: { duration: 0.8, ease: 'easeOut' }
  },
  // Hover animations
  hover: {
    scale: 1.05,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  hoverLift: {
    y: -8,
    scale: 1.03,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  hoverGlow: {
    boxShadow: '0 0 25px rgba(5, 150, 105, 0.4)',
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  // Loading animations
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  },
  breathe: {
    scale: [1, 1.02, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Animation duration presets
export const durations = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8
};

// Easing presets
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  spring: [0.68, -0.55, 0.265, 1.55],
  bounce: [0.175, 0.885, 0.32, 1.275]
};

// Enhanced Motion Component with Intersection Observer
interface MotionProps {
  children: React.ReactNode;
  preset?: keyof typeof animationPresets;
  custom?: {
    initial?: any;
    animate?: any;
    hover?: any;
    transition?: any;
  };
  delay?: number;
  duration?: number;
  triggerOnce?: boolean;
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  role?: string;
  'aria-label'?: string;
}

export const Motion = memo<MotionProps>(({
  children,
  preset = 'fadeIn',
  custom,
  delay = 0,
  duration,
  triggerOnce = true,
  threshold = 0.1,
  className = '',
  style = {},
  onClick,
  role,
  'aria-label': ariaLabel
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const { ref: inViewRef, inView } = useInView({
    threshold,
    triggerOnce
  });

  useEffect(() => {
    if (inView && !isVisible) {
      setTimeout(() => setIsVisible(true), delay * 1000);
    }
  }, [inView, delay, isVisible]);

  const animation = useMemo(() => {
    const baseAnimation = custom || animationPresets[preset];
    const modifiedAnimation = {
      ...baseAnimation,
      transition: {
        ...baseAnimation.transition,
        ...(duration && { duration }),
        delay
      }
    };
    return modifiedAnimation;
  }, [preset, custom, duration, delay]);

  const motionStyle = useMemo(() => {
    const baseStyle = {
      ...style,
      transition: `all ${animation.transition?.duration || 0.3}s ${
        Array.isArray(animation.transition?.ease) 
          ? `cubic-bezier(${animation.transition.ease.join(',')})` 
          : animation.transition?.ease || 'ease-out'
      }`,
      transform: 'none',
      opacity: 1,
      ...style
    };

    if (!isVisible) {
      return {
        ...baseStyle,
        ...animation.initial,
        transition: 'none'
      };
    }

    let finalStyle = {
      ...baseStyle,
      ...animation.animate
    };

    if (isHovered && animation.hover) {
      finalStyle = {
        ...finalStyle,
        ...animation.hover
      };
    }

    return finalStyle;
  }, [isVisible, isHovered, animation, style]);

  const setRefs = (el: HTMLDivElement | null) => {
    elementRef.current = el;
    inViewRef(el);
  };

  return (
    <div
      ref={setRefs}
      className={className}
      style={motionStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
});

Motion.displayName = 'Motion';

// Stagger animation for lists
interface StaggerProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
  preset?: keyof typeof animationPresets;
}

export const Stagger = memo<StaggerProps>(({
  children,
  staggerDelay = 0.1,
  className = '',
  preset = 'slideInUp'
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <Motion
          key={index}
          preset={preset}
          delay={index * staggerDelay}
          triggerOnce={true}
        >
          {child}
        </Motion>
      ))}
    </div>
  );
});

Stagger.displayName = 'Stagger';

// Page transition wrapper
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition = memo<PageTransitionProps>(({
  children,
  className = ''
}) => {
  return (
    <Motion
      preset="fadeIn"
      duration={0.4}
      className={className}
    >
      {children}
    </Motion>
  );
});

PageTransition.displayName = 'PageTransition';

// Loading animation with multiple states
interface LoadingAnimationProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'wave';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const LoadingAnimation = memo<LoadingAnimationProps>(({
  type = 'spinner',
  size = 'md',
  color = '#059669',
  className = ''
}) => {
  const sizeMap = {
    sm: { size: 20, strokeWidth: 2 },
    md: { size: 32, strokeWidth: 3 },
    lg: { size: 48, strokeWidth: 4 }
  };

  const { size: svgSize, strokeWidth } = sizeMap[size];

  if (type === 'spinner') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 24 24"
          fill="none"
          className="animate-spin"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke={`${color}20`}
            strokeWidth={strokeWidth}
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  if (type === 'dots') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              backgroundColor: color,
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1.4s'
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div
        className={`w-4 h-4 rounded-full animate-ping ${className}`}
        style={{ backgroundColor: color }}
      />
    );
  }

  if (type === 'wave') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-1 bg-current rounded-full animate-pulse"
            style={{
              height: '16px',
              backgroundColor: color,
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.9s'
            }}
          />
        ))}
      </div>
    );
  }

  return null;
});

LoadingAnimation.displayName = 'LoadingAnimation';

// Parallax scroll effect
interface ParallaxProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export const Parallax = memo<ParallaxProps>(({
  children,
  offset = 0.5,
  className = ''
}) => {
  const [scrollY, setScrollY] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const transform = useMemo(() => {
    return `translateY(${scrollY * offset}px)`;
  }, [scrollY, offset]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{ transform }}
    >
      {children}
    </div>
  );
});

Parallax.displayName = 'Parallax';

// Morphing button with animation states
interface MorphingButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  onClick?: () => void;
  className?: string;
  loadingText?: string;
  successText?: string;
  errorText?: string;
}

export const MorphingButton = memo<MorphingButtonProps>(({
  children,
  loading = false,
  success = false,
  error = false,
  onClick,
  className = '',
  loadingText = 'Loading...',
  successText = 'Success!',
  errorText = 'Error!'
}) => {
  const getContent = () => {
    if (loading) return loadingText;
    if (success) return successText;
    if (error) return errorText;
    return children;
  };

  const getVariant = () => {
    if (loading) return 'loading';
    if (success) return 'success';
    if (error) return 'error';
    return 'default';
  };

  const variantStyles = {
    default: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    loading: 'bg-blue-500 text-white cursor-not-allowed',
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white'
  };

  return (
    <Motion
      preset="scaleIn"
      custom={{
        animate: { scale: 1 },
        hover: !loading ? { scale: 1.05 } : undefined
      }}
    >
      <button
        onClick={!loading ? onClick : undefined}
        disabled={loading}
        className={`
          px-6 py-3 rounded-lg font-medium transition-all duration-300
          transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2
          ${variantStyles[getVariant()]}
          ${className}
        `}
      >
        <div className="flex items-center justify-center space-x-2">
          {loading && <LoadingAnimation type="spinner" size="sm" color="white" />}
          <span>{getContent()}</span>
        </div>
      </button>
    </Motion>
  );
});

MorphingButton.displayName = 'MorphingButton';

// CSS-in-JS animation utilities
export const createKeyframes = (name: string, keyframes: Record<string, any>) => {
  if (typeof document === 'undefined') return '';
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ${name} {
      ${Object.entries(keyframes).map(([key, value]) => `
        ${key} {
          ${Object.entries(value).map(([prop, val]) => `${prop}: ${val};`).join('')}
        }
      `).join('')}
    }
  `;
  document.head.appendChild(style);
  return name;
};

// Animation performance utilities
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Export animation system
export default {
  Motion,
  Stagger,
  PageTransition,
  LoadingAnimation,
  Parallax,
  MorphingButton,
  animationPresets,
  durations,
  easings,
  createKeyframes,
  useReducedMotion
};
