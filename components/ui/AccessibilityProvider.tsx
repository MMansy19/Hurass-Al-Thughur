"use client";

import React, { createContext, useContext, useRef, useEffect, ReactNode } from 'react';

interface AccessibilityContextType {
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  focusElement: (elementId: string) => void;
  trapFocus: (container: HTMLElement) => () => void;
  announcePageChange: (pageName: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const announceRef = useRef<HTMLDivElement>(null);

  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announceRef.current) {
      // Clear previous announcement
      announceRef.current.textContent = '';
      
      // Set the priority
      announceRef.current.setAttribute('aria-live', priority);
      
      // Add the announcement after a small delay to ensure it's picked up
      setTimeout(() => {
        if (announceRef.current) {
          announceRef.current.textContent = message;
        }
      }, 100);
    }
  };

  const focusElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
      // Scroll into view if necessary
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    // Focus the first element
    if (firstElement) {
      firstElement.focus();
    }

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  };

  const announcePageChange = (pageName: string) => {
    announceToScreenReader(`Navigated to ${pageName} page`, 'assertive');
  };

  const value: AccessibilityContextType = {
    announceToScreenReader,
    focusElement,
    trapFocus,
    announcePageChange,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      {/* Screen reader announcement area */}
      <div
        ref={announceRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        role="status"
      />
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

// Utility hook for managing focus
export function useFocusManagement() {
  const focusHistoryRef = useRef<HTMLElement[]>([]);

  const pushFocus = (element: HTMLElement) => {
    if (document.activeElement instanceof HTMLElement) {
      focusHistoryRef.current.push(document.activeElement);
    }
    element.focus();
  };

  const popFocus = () => {
    const lastFocused = focusHistoryRef.current.pop();
    if (lastFocused) {
      lastFocused.focus();
    }
  };

  const clearFocusHistory = () => {
    focusHistoryRef.current = [];
  };

  return { pushFocus, popFocus, clearFocusHistory };
}

// Hook for skip links
export function useSkipLinks() {
  useEffect(() => {
    const skipLinks = document.querySelectorAll('[data-skip-link]');
    
    skipLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href')?.substring(1);
        if (targetId) {
          const target = document.getElementById(targetId);
          if (target) {
            target.focus();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }, []);
}
