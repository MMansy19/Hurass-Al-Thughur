"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from './Header.module.css';

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
  };
}

// Icons as separate components for better organization
const HomeIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
  </svg>
);

const MagazineIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
  </svg>
);

const DawahIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
  </svg>
);

const LibraryIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
  </svg>
);

const ContactIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd"></path>
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Header = ({ locale, messages }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(65);
  const isArabic = locale === "ar";
  const oppositeLocale = isArabic ? "en" : "ar";
  const pathname = usePathname();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);
  
  // Add scroll effect and measure header height
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
        setHeaderHeight(57); // Scrolled header height
      } else {
        setScrolled(false);
        setHeaderHeight(65); // Default header height
      }
    };
    
    // Initial header measurement
    setHeaderHeight(window.scrollY > 10 ? 57 : 65);
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // Navigation links data
  const navLinks = [
    { 
      href: `/${locale}`, 
      icon: <HomeIcon />, 
      text: messages.home,
      isActive: pathname === `/${locale}` || pathname === '/'
    },
    { 
      href: `/${locale}/magazine`, 
      icon: <MagazineIcon />, 
      text: messages.magazine,
      isActive: pathname.includes('/magazine')
    },
    { 
      href: `/${locale}/dawah`, 
      icon: <DawahIcon />, 
      text: messages.dawah,
      isActive: pathname.includes('/dawah')
    },
    { 
      href: `/${locale}/library`, 
      icon: <LibraryIcon />, 
      text: messages.library,
      isActive: pathname.includes('/library')
    },
    { 
      href: `/${locale}/contact`, 
      icon: <ContactIcon />, 
      text: messages.contact,
      isActive: pathname.includes('/contact')
    },
  ];

  return (
  <header 
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        scrolled ? `bg-white/95 shadow-md py-2 ${styles.headerScrolled}` : "bg-white/90 py-3"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}          
          <Link href={`/${locale}`} className={`flex items-center group ${styles.logoAnimation}`}>
            <div className="relative overflow-hidden rounded-full border-2 border-emerald-500 mr-3 rtl:mr-0 rtl:ml-3">
              <Image
                src="/images/logo.jpg"
                alt="Hurass Al-Thughur Logo"
                width={45}
                height={45}
                className="transition-transform group-hover:scale-110 duration-300"
                priority
              />
            </div>
            <span className={`font-bold text-xl sm:text-2xl text-emerald-700 group-hover:text-emerald-800 transition-colors ${
              scrolled ? "" : ""
            }`}>
              {isArabic ? "حُراس الثغور" : "Hurass Al-Thughur"}
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-between flex-grow mx-6">
            <ul className="flex items-center space-x-1 rtl:space-x-reverse lg:space-x-2">
              {navLinks.map((link, index) => (
                <li key={index}>              
                <Link
                    href={link.href}
                    className={`px-3 py-2 rounded-md flex items-center transition-all group ${styles.navItem}
                      ${link.isActive
                        ? `bg-emerald-600 text-white ${styles.activeNavItem}` 
                        : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                  >
                    <span className={`${isArabic ? "ml-2" : "mr-2"} ${link.isActive ? "text-white" : "text-emerald-600 group-hover:text-emerald-700"}`}>
                      {link.icon}
                    </span>
                    <span className="whitespace-nowrap">{link.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Language Switch - Desktop */}
            <Link
              href={`/${oppositeLocale}${pathname.substring(3) || ""}`}
              className="ml-4 rtl:ml-0 rtl:mr-4 flex items-center px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <span className={isArabic ? "ml-2" : "mr-2"}>
                <GlobeIcon />
              </span>
              <span className="whitespace-nowrap">{messages.switchLanguage}</span>
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Link
              href={`/${oppositeLocale}${pathname.substring(3) || ""}`}
              className="mr-3 rtl:mr-0 rtl:ml-3 flex items-center justify-center w-10 h-10 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              aria-label={messages.switchLanguage}
            >
              <GlobeIcon />
            </Link>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>      {/* Mobile Navigation Menu */}        
      <div 
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 z-40 bg-white ${styles.mobileMenu} ${
          isMenuOpen 
            ? "translate-x-0" 
            : isArabic 
              ? "translate-x-full" 
              : "-translate-x-full"
        }`}
        style={{ top: `${headerHeight}px`, height: `calc(100vh - ${headerHeight}px)` }}
      >
        <div className="px-4 py-6 space-y-1 h-full overflow-y-auto">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={`flex items-center py-4 px-4 rounded-lg ${
                link.isActive
                  ? "bg-emerald-600 text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className={`${isArabic ? "ml-3" : "mr-3"} ${link.isActive ? "text-white" : "text-emerald-600"}`}>
                {link.icon}
              </span>
              <span className="text-lg">{link.text}</span>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30"
          style={{ top: `${headerHeight}px` }}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
};

export default Header;
