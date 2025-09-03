'use client';

import { useState } from 'react';
import { ArticleInterface } from '@/types/articles';
import { EnhancedArticleCard } from '@/components/ui/ArticleComponents';
import { ArticleFilters } from '@/components/ui/ArticleFilters';

interface ArticlesClientProps {
  articles: ArticleInterface[];
  locale: string;
  messages: any;
}

export function ArticlesClient({ articles, locale, messages }: ArticlesClientProps) {
  const [filteredArticles, setFilteredArticles] = useState<ArticleInterface[]>(articles);

  const handleFilteredArticlesChange = (filtered: ArticleInterface[]) => {
    setFilteredArticles(filtered);
  };

  return (
    <>
      {/* Filters Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto sm:px-4 px-2">
          <ArticleFilters
            articles={articles}
            locale={locale}
            messages={messages}
            onFilteredArticlesChange={handleFilteredArticlesChange}
          />
        </div>
      </section>

      {/* Enhanced Articles Grid */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
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
    </>
  );
}
