'use client';

import { supabase } from '@/supabase/initializing';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

function layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Getting the locale from the URL parameters
  const params = useParams<{ locale: string }>();
  const { locale } = params;

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push(`/${locale}/signin`);
      }
    }

    checkSession();
  }, []);

  return <>{children}</>;
}
export default layout;
