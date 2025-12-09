"use client";
import { useState, useEffect } from "react";
import ArticleForm from "../ArticleForm";
import { Messages } from "@/types/messages";

function AddArticle({ params }: { params: Promise<{ locale: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{
    locale: string;
  } | null>(null);
  const [messages, setMessages] = useState<Messages | null>(null);

  useEffect(() => {
    async function loadData() {
      const { locale } = await params;
      const messagesData = (await import(`@/locales/${locale}.json`)).default;
      setResolvedParams({ locale });
      setMessages(messagesData);
    }
    loadData();
  }, [params]);

  if (!resolvedParams || !messages) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {messages?.common?.loading || 'Loading...'}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10 text-white"
            >
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {messages.articles.addArticle}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {messages.articles.addArticleDescription || "شارك أفكارك ومعرفتك مع المجتمع من خلال كتابة مقال جديد"}
          </p>
        </div>

        {/* Form Section */}
        <ArticleForm method="add" messages={messages} />
      </div>
    </div>
  );
}
export default AddArticle;
