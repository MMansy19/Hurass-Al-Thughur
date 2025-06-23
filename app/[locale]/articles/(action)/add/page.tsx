"use client";
import ArticleForm from "../ArticleForm";


import { useState, useEffect } from "react";
import ArticleForm from "../ArticleForm";
import PasswordDialog from "@/components/ui/PasswordDialog";

function AddArticle({ params }: { params: Promise<{ locale: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{
    locale: string;
  } | null>(null);
  const [messages, setMessages] = useState<any>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { locale } = await params;
      const messagesData = (await import(`@/locales/${locale}.json`)).default;
      setResolvedParams({ locale });
      setMessages(messagesData);
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

  if (!resolvedParams || !messages) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
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
            {messages.articles.addArticle}
          </h1>
        </div>
      </section>

      <section>
        <div className="container mx-auto sm:px-4 px-2">
          <ArticleForm method="add" messages={messages} />
        </div>
      </section>
    </div>
  );
}
export default AddArticle;
