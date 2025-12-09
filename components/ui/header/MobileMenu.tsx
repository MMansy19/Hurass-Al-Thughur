"use client";

import Link from "next/link";
import { LanguageSwitch } from "./DesktopNavigation";
import styles from "../Header.module.css";
import AuthButtons from "./AuthButtons";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface MobileMenuProps {
  isMenuOpen: boolean;
  locale: string;
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
    dashboard?: string;
  };
}

const MobileMenu = ({
  isMenuOpen,
  setIsMenuOpen,
  navLinks,
  headerHeight,
  isArabic,
  oppositeLocale,
  pathname,
  messages,
  locale,
}: MobileMenuProps) => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push(`/${locale}`);
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Error signing out. Please try again.");
    }
  }
  const MenuIcon = () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16m-7 6h7"
      />
    </svg>
  );

  const CloseIcon = () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  return (
    <>
      {" "}
      {/* Mobile Menu Button */}
      <div className="flex gap-2 items-center xl:hidden">
        <AuthButtons
          messages={{ 
            signin: messages.signin, 
            signup: messages.signup,
            ...(messages.dashboard && { dashboard: messages.dashboard })
          }}
          isMobile={true}
        />
        <LanguageSwitch
          oppositeLocale={oppositeLocale}
          pathname={pathname}
          isArabic={isArabic}
          switchText={messages.switchLanguage}
          isMobile={true}
        />

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rtl:p-2 p-1 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      {/* Mobile Navigation Menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 z-40 bg-white ${styles.mobileMenu} ${isMenuOpen ? "translate-x-0" : isArabic ? "translate-x-full" : "-translate-x-full"}`}
        style={{
          top: `${headerHeight}px`,
          height: `calc(100vh - ${headerHeight}px)`,
        }}
      >
        <div className="sm:px-4 px-2 py-6 space-y-1 h-full overflow-y-auto">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={`flex items-center py-4 sm:px-4 px-2 rounded-lg ${link.isActive ? "bg-emerald-600 text-white" : "text-gray-700 hover:bg-gray-50"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span
                className={`mx-3 rtl:ml-3 ${link.isActive ? "text-white" : "text-emerald-600"}`}
              >
                {link.icon}
              </span>
              <span className="text-lg">{link.text}</span>
            </Link>
          ))}

          {/* Auth Buttons in Mobile Menu */}
          <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
            {user ? (
              // Show user info and sign out button for logged-in users
              <div className="space-y-2">
                <div className="flex items-center py-2 sm:px-4 px-2 rounded-lg bg-emerald-50">
                  <span className="mx-3 rtl:ml-3 text-emerald-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="text-lg font-medium text-emerald-800">
                    {user.user_metadata?.name || user.email?.split('@')[0]}
                  </span>
                </div>
                
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center py-4 sm:px-4 px-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <span className="mx-3 rtl:ml-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="text-lg">
                    {locale === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
                  </span>
                </button>
              </div>
            ) : (
              // Show login and register links for non-authenticated users
              <>
                <Link
                  href={`/${locale}/signin`}
                  className="flex items-center py-4 sm:px-4 px-2 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mx-3 rtl:ml-3 text-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="text-lg">{messages.signin}</span>
                </Link>
                <Link
                  href={`/${locale}/signup`}
                  className="flex items-center py-4 sm:px-4 px-2 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mx-3 rtl:ml-3 text-emerald-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
                    </svg>
                  </span>
                  <span className="text-lg">{messages.signup}</span>
                </Link>
              </>
            )}
          </div>
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
    </>
  );
};

export default MobileMenu;
