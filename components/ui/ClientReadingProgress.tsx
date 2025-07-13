"use client";

import { useEffect, useState } from "react";

interface ReadingProgressProps {
  target?: string;
}

export default function ClientReadingProgress({
  target = "article",
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const element = document.getElementById(target);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;

      const elementTop = rect.top;
      const elementBottom = rect.bottom;

      // Calculate how much of the element has been scrolled through
      let scrolled = 0;

      if (elementTop <= 0 && elementBottom >= windowHeight) {
        // Element is larger than viewport and currently spans the viewport
        scrolled = Math.abs(elementTop) / (elementHeight - windowHeight);
      } else if (elementTop <= 0 && elementBottom < windowHeight) {
        // Element top is above viewport, bottom is in viewport
        scrolled = 1;
      } else if (elementTop > 0) {
        // Element hasn't entered viewport yet
        scrolled = 0;
      }

      setProgress(Math.min(scrolled * 100, 100));
    };

    const handleScroll = () => {
      requestAnimationFrame(updateProgress);
    };

    window.addEventListener("scroll", handleScroll);
    updateProgress(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [target]);

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 z-50 transition-all duration-300 ease-out"
      style={{ width: `${progress}%` }}
    />
  );
}
