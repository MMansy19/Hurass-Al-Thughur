"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from './Header.module.css';

// Import custom hooks
import useScrollHeader from './hooks/useScrollHeader';

// Import components
import Logo from "./header/Logo";
import DesktopNavigation from "./header/DesktopNavigation";
import MobileMenu from "./header/MobileMenu";

// Import utilities
import { buildNavLinks } from "./header/navUtils";

interface HeaderProps {
  locale: string;
  messages: {
    language: string;
    switchLanguage: string;
    home: string;
    magazine: string;
    dawah: string;
    library: string;
    contact: string;
    siteName: string;
  };
}

const Header = ({ locale, messages }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrolled, headerHeight } = useScrollHeader();
  const isArabic = locale === "ar";
  const oppositeLocale = isArabic ? "en" : "ar";
  const pathname = usePathname();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);
    // Generate navigation links
  const navLinks = buildNavLinks({ locale, pathname, messages });
  return (
    <header 
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        scrolled ? `bg-white/95 shadow-md py-2 ${styles.headerScrolled}` : "bg-white/90 py-3"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="container mx-auto md:px-4 px-2">
        <div className="flex items-center justify-between">          
          {/* Logo */}
          <Logo 
            locale={locale} 
            isArabic={isArabic} 
            messages={{ siteName: messages.siteName }}
          />
            {/* Desktop Navigation */}
          <DesktopNavigation 
            navLinks={navLinks} 
            oppositeLocale={oppositeLocale}
            pathname={pathname}
            isArabic={isArabic}
            messages={messages}
          />
          
          {/* Mobile Navigation */}
          <MobileMenu 
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            navLinks={navLinks}
            headerHeight={headerHeight}
            isArabic={isArabic}
            oppositeLocale={oppositeLocale}
            pathname={pathname}
            messages={messages}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
