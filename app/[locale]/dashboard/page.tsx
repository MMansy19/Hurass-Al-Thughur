'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { loadSignedInUser, loadMessages, loadArticles } from './utils';
import { ArticleInterface } from '@/types/articles';
import DeleteArticleButton from './DeleteArticleButton';

function page() {
  const [messages, setMessages] = useState<any>({});
  const [user, setUser] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const params = useParams();
  const { locale } = params;

  useEffect(() => {
    if (typeof locale === 'string') {
      loadMessages(locale, setMessages);
    }

    loadSignedInUser(setUser);
    loadArticles(user?.id, setArticles, setLoading);
  }, [locale, user]);

  if (loading) {
    return <p className="text-center font-bold text-2xl">{messages?.common?.loading}</p>;
  }

  if (articles.length === 0) {
    return (
      <>
        <Link href={`/${locale}/articles/add`} className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
          {messages?.articles?.addNewArticle}
        </Link>
        <p className="text-center font-bold text-2xl">{messages?.articles?.noArticlesYet}</p>;
      </>
    );
  }

  return (
    <div>
      <Link href={`/${locale}/articles/add`} className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
        {messages?.articles?.addNewArticle}
      </Link>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {articles?.map((article: ArticleInterface) => (
          <div key={article.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
            <div className="p-4 flex flex-col h-full">
              <div className="flex items-center mb-3">
                <h3 className="font-medium text-lg" dir="auto">
                  {article.title}
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-3 flex-grow" dir="auto">
                {article.excerpt}
              </p>
              <div className="mt-auto pt-4 flex items-center gap-4">
                <Link href={`/${locale}/articles/${article.id}`} className="block w-full sm:px-4 px-2 py-2 text-center bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
                  {messages.common.view}
                </Link>
                <Link href={`/${locale}/articles/edit/${article.id}`} className="block w-full sm:px-4 px-2 py-2 text-center bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
                  {messages.common.edit}
                </Link>
                <DeleteArticleButton articleId={article.id} messages={messages} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default page;
