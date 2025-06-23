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
  pathname: string;
  messages: {
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
    <>
      {' '}
      {/* Mobile Menu Button */}
      <div className="flex gap-2 items-center xl:hidden">
        <Link href={`${oppositeLocale === 'en' ? '/ar/dashboard' : '/en/dashboard'}`} className="flex items-center justify-center transition-colors w-8 h-8 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
          </svg>
        </Link>
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
