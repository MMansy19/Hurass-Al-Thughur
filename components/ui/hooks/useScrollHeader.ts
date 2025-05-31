"use client";

import { useState, useEffect } from "react";

interface ScrollState {
  scrolled: boolean;
  headerHeight: number;
}

export const useScrollHeader = (initialHeight = 65, scrolledHeight = 57, scrollThreshold = 10): ScrollState => {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrolled: false,
    headerHeight: initialHeight
  });

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > scrollThreshold;
      
      setScrollState({
        scrolled: isScrolled,
        headerHeight: isScrolled ? scrolledHeight : initialHeight
      });
    };
    
    // Set initial state based on scroll position
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    
    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [initialHeight, scrolledHeight, scrollThreshold]);

  return scrollState;
};

export default useScrollHeader;
