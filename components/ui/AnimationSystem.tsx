"use client";

import React, { memo, useEffect, useRef, useState, useMemo } from "react";
import { useInView } from "react-intersection-observer";

// Animation configuration types
interface AnimationConfig {
    initial?: Record<string, any>;
    animate?: Record<string, any>;
    hover?: Record<string, any>;
    transition?: Record<string, any>;
    scale?: number | number[];
    y?: number | number[];
    x?: number | number[];
    opacity?: number | number[];
    rotate?: number | number[];
    rotateY?: number | number[];
    boxShadow?: string | string[];
}

// Enhanced animation configurations
export const animationPresets: Record<string, AnimationConfig> = {
    // Entrance animations
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.6, ease: "easeOut" },
    },
    slideInUp: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, ease: "easeOut" },
    },
    slideInDown: {
        initial: { opacity: 0, y: -30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, ease: "easeOut" },
    },
    slideInLeft: {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.7, ease: "easeOut" },
    },
    slideInRight: {
        initial: { opacity: 0, x: 30 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.7, ease: "easeOut" },
    },
    scaleIn: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.6, ease: "easeOut" },
    },
    rotateIn: {
        initial: { opacity: 0, rotate: -10 },
        animate: { opacity: 1, rotate: 0 },
        transition: { duration: 0.8, ease: "easeOut" },
    },
    // Complex entrance animations
    bounceIn: {
        initial: { opacity: 0, scale: 0.3 },
        animate: { opacity: 1, scale: 1 },
        transition: {
            duration: 0.8,
            ease: [0.68, -0.55, 0.265, 1.55],
        },
    },
    flipIn: {
        initial: { opacity: 0, rotateY: -90 },
        animate: { opacity: 1, rotateY: 0 },
        transition: { duration: 0.8, ease: "easeOut" },
    }, // Hover animations
    hover: {
        initial: {},
        animate: {},
        hover: {
            scale: 1.05,
            transition: { duration: 0.2, ease: "easeOut" },
        },
    },
    hoverLift: {
        initial: {},
        animate: {},
        hover: {
            y: -8,
            scale: 1.03,
            transition: { duration: 0.2, ease: "easeOut" },
        },
    },
    hoverGlow: {
        initial: {},
        animate: {},
        hover: {
            boxShadow: "0 0 25px rgba(5, 150, 105, 0.4)",
            transition: { duration: 0.3, ease: "easeOut" },
        },
    },
    // Loading animations
    pulse: {
        initial: {},
        animate: {
            scale: [1, 1.05, 1],
        },
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
    breathe: {
        initial: {},
        animate: {
            scale: [1, 1.02, 1],
            opacity: [0.8, 1, 0.8],
        },
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

// Animation duration presets
export const durations = {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    slower: 0.8,
};

// Easing presets
export const easings = {
    easeInOut: [0.4, 0, 0.2, 1],
    easeOut: [0, 0, 0.2, 1],
    easeIn: [0.4, 0, 1, 1],
    spring: [0.68, -0.55, 0.265, 1.55],
    bounce: [0.175, 0.885, 0.32, 1.275],
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
    "aria-label"?: string;
}

export const Motion = memo<MotionProps>(
    ({
        children,
        preset = "fadeIn",
        custom,
        delay = 0,
        duration,
        triggerOnce = true,
        threshold = 0.1,
        className = "",
        style = {},
        onClick,
        role,
        "aria-label": ariaLabel,
    }) => {
        const [isVisible, setIsVisible] = useState(false);
        const [isHovered, setIsHovered] = useState(false);
        const elementRef = useRef<HTMLDivElement>(null);

        const { ref: inViewRef, inView } = useInView({
            threshold,
            triggerOnce,
        });

        useEffect(() => {
            if (inView && !isVisible) {
                setTimeout(() => setIsVisible(true), delay * 1000);
            }
        }, [inView, delay, isVisible]);
        const animation = useMemo(() => {
            const baseAnimation = custom || animationPresets[preset];
            if (!baseAnimation) {
                return {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { duration: 0.6, ease: "easeOut", delay },
                };
            }

            const modifiedAnimation = {
                ...baseAnimation,
                transition: {
                    ...baseAnimation.transition,
                    ...(duration && { duration }),
                    delay,
                },
            };
            return modifiedAnimation;
        }, [preset, custom, duration, delay]);

        const motionStyle = useMemo(() => {
            const baseStyle = {
                ...style,
                transition: `all ${animation.transition?.duration || 0.3}s ${Array.isArray(animation.transition?.ease)
                        ? `cubic-bezier(${animation.transition.ease.join(",")})`
                        : animation.transition?.ease || "ease-out"
                    }`,
                transform: "none",
                opacity: 1,
                ...style,
            };

            if (!isVisible) {
                return {
                    ...baseStyle,
                    ...animation.initial,
                    transition: "none",
                };
            }

            let finalStyle = {
                ...baseStyle,
                ...animation.animate,
            };

            if (isHovered && animation.hover) {
                finalStyle = {
                    ...finalStyle,
                    ...animation.hover,
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
    },
);

Motion.displayName = "Motion";

// StaggerContainer component for staggered animations
interface StaggerContainerProps {
    children: React.ReactNode;
    staggerDelay?: number;
    className?: string;
}

export const StaggerContainer = memo<StaggerContainerProps>(
    ({ children, staggerDelay = 100, className = "" }) => {
        return (
            <div className={className}>
                {React.Children.map(children, (child, index) => (
                    <Motion key={index} preset="slideInUp" delay={index * staggerDelay}>
                        {child}
                    </Motion>
                ))}
            </div>
        );
    },
);

StaggerContainer.displayName = "StaggerContainer";









// CSS-in-JS animation utilities
export const createKeyframes = (
    name: string,
    keyframes: Record<string, any>,
) => {
    if (typeof document === "undefined") return "";

    const style = document.createElement("style");
    style.textContent = `
    @keyframes ${name} {
      ${Object.entries(keyframes)
            .map(
                ([key, value]) => `
        ${key} {
          ${Object.entries(value)
                        .map(([prop, val]) => `${prop}: ${val};`)
                        .join("")}
        }
      `,
            )
            .join("")}
    }
  `;
    document.head.appendChild(style);
    return name;
};

// Animation performance utilities
export const useReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return prefersReducedMotion;
};

// Export animation system
export default {
    Motion,
    StaggerContainer,
    animationPresets,
    durations,
    easings,
    createKeyframes,
    useReducedMotion,
};
