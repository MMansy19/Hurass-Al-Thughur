'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArticleInterface } from '@/types/articles';
import { EnhancedArticleCard } from '@/components/ui/ArticleComponents';
import { ArticleFilters } from '@/components/ui/ArticleFilters';
import { useAuth } from '@/components/auth/AuthProvider';

interface ArticlesClientProps {
  articles: ArticleInterface[];
  locale: string;
  messages: any;
}

export function ArticlesClient({ articles, locale, messages }: ArticlesClientProps) {
  const [filteredArticles, setFilteredArticles] = useState<ArticleInterface[]>(articles);
  const { user } = useAuth();

  const handleFilteredArticlesChange = (filtered: ArticleInterface[]) => {
    setFilteredArticles(filtered);
  };

  return (
    <>
      {/* Filters Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto sm:px-4 px-2">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <ArticleFilters
                articles={articles}
                locale={locale}
                messages={messages}
                onFilteredArticlesChange={handleFilteredArticlesChange}
              />
            </div>
            
            {/* Publish Article Button - Only show for authenticated users */}
            {user && (
              <div className="flex-shrink-0">
                <Link
                  href={`/${locale}/articles/add`}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                  >
                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                  </svg>
                  <span className="whitespace-nowrap">
                    {locale === 'ar' ? 'انشر مقالا' : 'Publish Article'}
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Articles Grid */}
      <section className="py-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto sm:px-4 px-2">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {messages.articles.noMatchingArticles || 'No matching articles found'}
                </h3>
                <p className="mt-2 text-gray-500">
                  {messages.articles.noMatchingArticlesDescription || 
                    'Try adjusting your search criteria or clearing the filters.'}
                </p>
                
                {/* Call-to-action for adding articles */}
                {user && (
                  <div className="mt-6">
                    <Link
                      href={`/${locale}/articles/add`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {locale === 'ar' ? 'انشر مقالا' : 'Publish Article'}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-8 md:gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article, index) => (
                <EnhancedArticleCard
                  key={article.id}
                  article={article}
                  locale={locale}
                  messages={messages}
                  delay={index * 100}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Floating Action Button for Mobile - Only for authenticated users */}
      {user && (
        <div className="fixed bottom-6 right-6 z-50 lg:hidden">
          <Link
            href={`/${locale}/articles/add`}
            className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
            title={locale === 'ar' ? 'انشر مقالا' : 'Publish Article'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 group-hover:scale-110 transition-transform"
            >
              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
            </svg>
          </Link>
        </div>
      )}
    </>
  );
}
