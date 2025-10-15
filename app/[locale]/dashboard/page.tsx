"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { loadSignedInUser, loadMessages, loadArticles } from "./utils";
import { ArticleInterface } from "@/types/articles";
import DeleteArticleButton from "./DeleteArticleButton";
import { Messages } from "@/types/messages";
import { User } from "@supabase/supabase-js";

function Dashboard() {
  const [messages, setMessages] = useState<Messages>({} as Messages);
  const [user, setUser] = useState<User | null>(null);
  const [articles, setArticles] = useState<ArticleInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const params = useParams();
  const { locale } = params;

  useEffect(() => {
    if (typeof locale === "string") {
      loadMessages(locale, setMessages);
    }

    loadSignedInUser(setUser);
    if (user?.id) {
      loadArticles(user.id, setArticles, setLoading);
    } else {
      setLoading(false);
    }
  }, [locale, user]);

  if (loading) {
    return (
      <p className="text-center font-bold text-2xl">
        {messages?.common?.loading}
      </p>
    );
  }
  if (!user) {
    return (
      <div className="text-center">
        <p className="font-bold text-2xl mb-8">
          {messages?.common?.notSignedIn}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href={`/${locale}/signin`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors min-w-32"
          >
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
            {messages?.auth?.signin}
          </Link>
          <Link
            href={`/${locale}/signup`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors min-w-32"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
            </svg>
            {messages?.auth?.signup}
          </Link>
        </div>
        <p className="text-gray-600 mt-4 text-sm">
          {messages?.auth?.dontHaveAccount}
        </p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <>
        <Link
          href={`/${locale}/articles/add`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
          {messages.articles.addNewArticle}
        </Link>
        <p className="text-center font-bold text-2xl mt-10">
          {messages?.articles?.noArticlesYet}
        </p>
      </>
    );
  }

  return (
    <div>
      <Link
        href={`/${locale}/articles/add`}
        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
            clipRule="evenodd"
          />
        </svg>
        {messages.articles.addNewArticle}
      </Link>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {articles?.map((article: ArticleInterface) => (
          <div
            key={article.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
          >
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
                <Link
                  href={`/${locale}/articles/${article.id}`}
                  className="block w-full sm:px-4 px-2 py-2 text-center bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                >
                  {messages.common.view}
                </Link>
                <Link
                  href={`/${locale}/articles/edit/${article.id}`}
                  className="block w-full sm:px-4 px-2 py-2 text-center bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                >
                  {messages.common.edit}
                </Link>
                <DeleteArticleButton
                  articleId={article.id}
                  messages={messages}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Dashboard;
