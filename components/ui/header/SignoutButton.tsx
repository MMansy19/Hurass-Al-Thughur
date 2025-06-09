'use client';

import { supabase } from '@/supabase/initializing';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function SignoutButton() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Getting the locale from the URL parameters
  const params = useParams<{ locale: string }>();
  const { locale } = params;

  // Using the Next.js router to navigate
  const router = useRouter();

  async function handleClick() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(`Error signing out: ${error.message}`);
    } else {
      alert('Signed out successfully');
      router.push(`/${locale}`);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setIsSignedIn(true);
      } else if (event === 'SIGNED_OUT') {
        setIsSignedIn(false);
      }
    });

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!isSignedIn) {
    return null;
  }

  return (
    <button onClick={handleClick} className=" flex items-center justify-center w-10 h-10 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
        <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
      </svg>
    </button>
  );
}
export default SignoutButton;
