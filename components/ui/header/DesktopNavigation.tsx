"use client";

import Link from "next/link";
import styles from '../Header.module.css';

interface NavigationLink {
  href: string;
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
}

interface DesktopNavigationProps {
  navLinks: NavigationLink[];
  locale: string;
  oppositeLocale: string;
  pathname: string;
  isArabic: boolean;
  messages: {
    switchLanguage: string;
  };
}

const DesktopNavigation = ({ 
  navLinks, 
  locale, 
  oppositeLocale, 
  pathname,
  isArabic,
  messages 
}: DesktopNavigationProps) => {
  return (
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
      <LanguageSwitch 
        oppositeLocale={oppositeLocale}
        pathname={pathname}
        isArabic={isArabic}
        switchText={messages.switchLanguage}
      />
    </nav>
  );
};

interface LanguageSwitchProps {
  oppositeLocale: string;
  pathname: string;
  isArabic: boolean;
  switchText: string;
  isMobile?: boolean;
}

export const LanguageSwitch = ({
  oppositeLocale,
  pathname,
  isArabic,
  switchText,
  isMobile = false
}: LanguageSwitchProps) => {
  const GlobeIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd"></path>
    </svg>
  );

  if (isMobile) {
    return (
      <Link
        href={`/${oppositeLocale}${pathname.substring(3) || ""}`}
        className="md:mr-3 rtl:md:mr-0 rtl:md:ml-3 mr-2 rtl:mr-0 rtl:ml-2 flex items-center justify-center w-10 h-10 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
        aria-label={switchText}
      >
        <GlobeIcon />
      </Link>
    );
  }

  return (
    <Link
      href={`/${oppositeLocale}${pathname.substring(3) || ""}`}
      className="ml-4 rtl:ml-0 rtl:mr-4 flex items-center px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors shadow-sm"
    >
      <span className={isArabic ? "ml-2" : "mr-2"}>
        <GlobeIcon />
      </span>
      <span className="whitespace-nowrap">{switchText}</span>
    </Link>
  );
};

export default DesktopNavigation;
