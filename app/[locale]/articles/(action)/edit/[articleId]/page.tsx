"use client";

import { useState, useEffect } from "react";
import { ArticleInterface } from "@/types/articles";
import ArticleForm from "../../ArticleForm";
import { supabase } from "@/supabase/initializing";
import PasswordDialog from "@/components/ui/PasswordDialog";

function EditArticle({
  params,
}: {
  params: Promise<{ locale: string; articleId: string }>;
}) {
  const [resolvedParams, setResolvedParams] = useState<{
    locale: string;
    articleId: string;
  } | null>(null);
  const [messages, setMessages] = useState<any>(null);
  const [article, setArticle] = useState<ArticleInterface | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const { locale, articleId } = await params;
        const messagesData = (await import(`@/locales/${locale}.json`)).default;

        // Fetch article data
        const { data: articleData, error } = await supabase
          .from("articles")
          .select("*")
          .eq("id", articleId)
          .single();

        if (error || !articleData) {
          setError("Article not found");
        } else {
          setArticle(articleData);
        }

        setResolvedParams({ locale, articleId });
        setMessages(messagesData);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params]);

  const handlePasswordSuccess = () => {
    setIsAuthorized(true);
    setShowPasswordDialog(false);
  };

  const handlePasswordClose = () => {
    // Redirect back to articles page if user cancels
    if (resolvedParams) {
      window.location.href = `/${resolvedParams.locale}/articles`;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error || !resolvedParams || !messages) {
    return (
      <div className="max-w-4xl mx-auto mt-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <h1 className="text-xl font-semibold text-red-800">
            {error || "Failed to load page"}
          </h1>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto mt-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <h1 className="text-xl font-semibold text-red-800">
            {messages?.errors?.articleNotFound ||
              "عذرًا؛ لا يوجد مقال بهذا الـid."}
          </h1>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <PasswordDialog
        isOpen={showPasswordDialog}
        onClose={handlePasswordClose}
        onSuccess={handlePasswordSuccess}
        title={messages.auth.adminPasswordRequired}
        description={messages.auth.enterAdminPassword}
        messages={{
          password: messages.auth.password,
          cancel: messages.common.cancel,
          confirm: messages.common.confirm,
          incorrectPassword: messages.auth.incorrectPassword,
        }}
      />
    );
  }

  return (
    <div className="space-y-12">
      <section className="bg-emerald-700 text-white py-10 rounded-lg">
        <div className="container mx-auto sm:px-4 px-2 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">
            {messages.articles.editArticle}
          </h1>
        </div>
      </section>

      <section>
        <div className="container mx-auto sm:px-4 px-2">
          <ArticleForm
            method="edit"
            initialData={article}
            messages={messages}
          />
        </div>
      </section>
    </div>
  );
}
export default EditArticle;
