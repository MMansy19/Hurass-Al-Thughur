"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import { useAccessibility } from './AccessibilityProvider';

interface SkipLinksProps {
  links: Array<{
    href: string;
    label: string;
  }>;
}

export function SkipLinks({ links }: SkipLinksProps) {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <nav aria-label="Skip links" className="fixed top-0 left-0 z-[100] bg-emerald-600 text-white p-2 rounded-br-md">
        <ul className="flex flex-col gap-1">
          {links.map((link, index) => (
            <li key={index}>
              <a
                href={link.href}
                data-skip-link
                className="block px-3 py-2 bg-emerald-700 hover:bg-emerald-800 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function LoadingSpinner({ size = 'md', label = 'Loading...' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center" role="status" aria-label={label}>
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-emerald-600 ${sizeClasses[size]}`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

interface VisuallyHiddenProps {
  children: ReactNode;
  focusable?: boolean;
}

export function VisuallyHidden({ children, focusable = false }: VisuallyHiddenProps) {
  return (
    <span className={focusable ? "sr-only focus:not-sr-only" : "sr-only"}>
      {children}
    </span>
  );
}

interface FocusTrapProps {
  children: ReactNode;
  active: boolean;
  restoreFocus?: boolean;
}

export function FocusTrap({ children, active, restoreFocus = true }: FocusTrapProps) {
  const [previouslyFocused, setPreviouslyFocused] = useState<HTMLElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { trapFocus } = useAccessibility();

  useEffect(() => {
    if (!active) return;

    // Store the previously focused element
    if (restoreFocus && document.activeElement instanceof HTMLElement) {
      setPreviouslyFocused(document.activeElement);
    }

    // Set up focus trap
    let cleanup: (() => void) | undefined;
    if (containerRef.current) {
      cleanup = trapFocus(containerRef.current);
    }

    return () => {
      cleanup?.();
      // Restore focus when trap is deactivated
      if (restoreFocus && previouslyFocused) {
        previouslyFocused.focus();
      }
    };
  }, [active, restoreFocus, previouslyFocused, trapFocus]);

  return (
    <div ref={containerRef} data-focus-trap={active}>
      {children}
    </div>
  );
}

interface AnnouncementProps {
  message: string;
  priority?: 'polite' | 'assertive';
  clear?: boolean;
}

export function Announcement({ message, priority = 'polite', clear = false }: AnnouncementProps) {
  const { announceToScreenReader } = useAccessibility();

  useEffect(() => {
    if (message) {
      announceToScreenReader(message, priority);
    }
  }, [message, priority, announceToScreenReader]);

  // This component doesn't render anything visible
  return null;
}

interface KeyboardNavigationProps {
  children: ReactNode;
  onEscape?: () => void;
  onEnter?: () => void;
  className?: string;
}

export function KeyboardNavigation({ 
  children, 
  onEscape, 
  onEnter, 
  className = '' 
}: KeyboardNavigationProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        if (onEscape) {
          e.preventDefault();
          onEscape();
        }
        break;
      case 'Enter':
        if (onEnter) {
          e.preventDefault();
          onEnter();
        }
        break;
    }
  };

  return (
    <div className={className} onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
}

interface AriaExpandableProps {
  children: ReactNode;
  expanded: boolean;
  onToggle: () => void;
  label: string;
  className?: string;
}

export function AriaExpandable({ 
  children, 
  expanded, 
  onToggle, 
  label, 
  className = '' 
}: AriaExpandableProps) {
  const buttonId = React.useId();
  const contentId = React.useId();

  return (
    <div className={className}>
      <button
        id={buttonId}
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <span>{label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        className={`transition-all duration-200 overflow-hidden ${
          expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-3">
          {children}
        </div>
      </div>
    </div>
  );
}

interface ProgressIndicatorProps {
  value: number;
  max: number;
  label: string;
  showPercentage?: boolean;
}

export function ProgressIndicator({ 
  value, 
  max, 
  label, 
  showPercentage = true 
}: ProgressIndicatorProps) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {showPercentage && (
          <span className="text-sm text-gray-500">{percentage}%</span>
        )}
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${label}: ${percentage}% complete`}
        className="w-full bg-gray-200 rounded-full h-2"
      >
        <div
          className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
