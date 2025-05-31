import { ReactNode } from "react";
import { HomeIcon, MagazineIcon, DawahIcon, LibraryIcon, ContactIcon } from './Icons';

interface NavLink {
  href: string;
  icon: ReactNode;
  text: string;
  isActive: boolean;
}

interface NavLinkParams {
  locale: string;
  pathname: string;
  messages: {
    home: string;
    magazine: string;
    dawah: string;
    library: string;
    contact: string;
  }
}

/**
 * Generate navigation links based on current path and locale
 */
export const buildNavLinks = ({ locale, pathname, messages }: NavLinkParams): NavLink[] => {
  return [
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
};
