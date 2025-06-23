"use client";

import { ArticleInterface } from "@/types/articles";
import ArticleForm from "../../ArticleForm";
import { supabase } from "@/supabase/initializing";
import { useState, useEffect } from "react";
import PasswordDialog from "@/components/ui/PasswordDialog";
import { Messages } from "@/types/messages";

function EditArticle({
  params,
}: {
  params: Promise<{ locale: string; articleId: string }>;
}) {
  const [messages, setMessages] = useState<Messages | null>(null);
  const [article, setArticle] = useState<ArticleInterface | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const resolvedParamsResult = await params;

      const { locale, articleId } = resolvedParamsResult;
      const importedMessages = (await import(`@/locales/${locale}.json`))
        .default;
      setMessages(importedMessages);

      const { data: articleData }: { data: ArticleInterface | null } =
        await supabase
          .from("articles")
          .select("*")
          .eq("id", articleId)
          .single();

      setArticle(articleData);
      setLoading(false);
    }

    loadData();
  }, [params]);

  const handlePasswordClose = () => {
    setShowPasswordDialog(false);
  };

  const handlePasswordSuccess = () => {
    setIsAuthorized(true);
    setShowPasswordDialog(false);
  };

  if (loading || !messages) {
    return (
      <div className="max-w-4xl mx-auto mt-8 text-center">
        <p className="text-lg">Loading...</p>
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
            {messages.articles?.editArticle || "Edit Article"}
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
