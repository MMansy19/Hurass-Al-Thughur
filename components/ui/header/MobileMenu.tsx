'use client';

import Link from 'next/link';
import { LanguageSwitch } from './DesktopNavigation';
import styles from '../Header.module.css';
import AuthButtons from './AuthButtons';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  navLinks: Array<{
    href: string;
    icon: React.ReactNode;
    text: string;
    isActive: boolean;
  }>;
  headerHeight: number;
  isArabic: boolean;
  oppositeLocale: string;
  pathname: string;  messages: {
    switchLanguage: string;
    signin: string;
    signup: string;
  };
}

const MobileMenu = ({ isMenuOpen, setIsMenuOpen, navLinks, headerHeight, isArabic, oppositeLocale, pathname, messages }: MobileMenuProps) => {
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

  return (
    <>      {/* Mobile Menu Button */}
      <div className="flex gap-2 items-center xl:hidden">
        <AuthButtons messages={{ signin: messages.signin, signup: messages.signup }} isMobile={true} />
        <LanguageSwitch oppositeLocale={oppositeLocale} pathname={pathname} isArabic={isArabic} switchText={messages.switchLanguage} isMobile={true} />

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="rtl:p-2 p-1 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" aria-expanded={isMenuOpen} aria-controls="mobile-menu" aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}>
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div id="mobile-menu" className={`fixed inset-x-0 bottom-0 z-40 bg-white ${styles.mobileMenu} ${isMenuOpen ? 'translate-x-0' : isArabic ? 'translate-x-full' : '-translate-x-full'}`} style={{ top: `${headerHeight}px`, height: `calc(100vh - ${headerHeight}px)` }}>
        <div className="sm:px-4 px-2 py-6 space-y-1 h-full overflow-y-auto">
          {navLinks.map((link, index) => (
            <Link key={index} href={link.href} className={`flex items-center py-4 sm:px-4 px-2 rounded-lg ${link.isActive ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setIsMenuOpen(false)}>
              <span className={`mr-3 rtl:ml-3 ${link.isActive ? 'text-white' : 'text-emerald-600'}`}>{link.icon}</span>
              <span className="text-lg">{link.text}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && <div className="fixed inset-0 bg-black/30 z-30" style={{ top: `${headerHeight}px` }} onClick={() => setIsMenuOpen(false)} aria-hidden="true" />}
    </>
  );
};

export default MobileMenu;
