'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { loadSignedInUser, loadMessages } from './utils';

function page() {
  const [messages, setMessages] = useState<any>({});
  const [user, setUser] = useState<any>(null);

  const params = useParams();
  const { locale } = params;

  useEffect(() => {
    if (typeof locale === 'string') {
      loadMessages(locale, setMessages);
    }

    loadSignedInUser(setUser);
  }, [locale]);

  return (
    <div>
      <Link href={`/${locale}/articles/add`} className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
        {messages?.articles?.addNewArticle}
      </Link>
    </div>
  );
}
export default page;
