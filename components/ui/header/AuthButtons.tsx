"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import toast from "react-hot-toast";

interface AuthButtonsProps {
  messages: {
    signin: string;
    signup: string;
  };
  isMobile?: boolean;
}

function AuthButtons({ messages, isMobile = false }: AuthButtonsProps) {
  const { user, loading, signOut } = useAuth();

  const params = useParams<{ locale: string }>();
  const { locale } = params;
  const router = useRouter();

  async function handleSignOut() {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push(`/${locale}`);
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error("Error signing out. Please try again.");
    }
  }

  if (loading) {
    return <div className="w-20 h-10"></div>;
  }
  
  if (user) {
    return (
      <button
        onClick={handleSignOut}
        className={`flex items-center justify-center transition-colors ${
          isMobile
            ? "w-8 h-8 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            : "w-10 h-10 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
        }`}
        title="Sign Out"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={isMobile ? "w-4 h-4" : "w-5 h-5"}
        >
          <path
            fillRule="evenodd"
            d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );
  }
  if (isMobile) {
    return (
      <div className="flex items-center gap-1">
        <Link
          href={`/${locale}/signin`}
          className="w-10 h-10 flex items-center justify-center text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors"
          title={messages.signin}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm13.28 4.72a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 0 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h9.44l-1.72-1.72a.75.75 0 0 1 1.06-1.06l3 3Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
        <Link
          href={`/${locale}/signup`}
          className="w-8 h-8 md:flex hidden items-center justify-center bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          title={messages.signup}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <Link
        href={`/${locale}/signin`}
        className="px-3 py-2 text-emerald-700 hover:text-emerald-800 font-medium hover:bg-emerald-50 transition-colors rounded-md"
      >
        {messages.signin}
      </Link>
      <Link
        href={`/${locale}/signup`}
        className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium"
      >
        {messages.signup}
      </Link>
    </div>
  );
}

export default AuthButtons;
