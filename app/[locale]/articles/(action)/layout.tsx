'use client';

import { supabase } from '@/supabase/initializing';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function layout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
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
      } else {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  if (loading) {
    return <p className="text-emerald-700 text-4xl font-bold text-center py-20">{locale === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}</p>;
  }

  return <>{children}</>;
}
export default layout;
