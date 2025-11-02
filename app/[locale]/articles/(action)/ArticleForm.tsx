"use client";

import { supabase } from "@/supabase/initializing";
import { ArticleInterface } from "@/types/articles";
import { useParams } from "next/navigation";
import { useState } from "react";
import Editor from "react-simple-wysiwyg";
import { Messages } from "@/types/messages";
import toast from "react-hot-toast";

interface AddArticleFormProps {
  method: "add" | "edit";
  initialData?: ArticleInterface | null;
  messages: Messages;
}

function ArticleForm({ method, initialData, messages }: AddArticleFormProps) {
  const params = useParams();
  const { locale, articleId }: { locale?: string; articleId?: string } = params;

  const user = window.localStorage.getItem("user");

  let user_id = "";
  let user_name = "مجهول";

  if (user) {
    if (JSON.parse(user).id) {
      user_id = JSON.parse(user).id;
    }

    if (JSON.parse(user).user_metadata.name) {
      user_name = JSON.parse(user).user_metadata.name;
    }
  }

  const [formData, setFormData] = useState(
    initialData || {
      lang: locale || "ar",
      author: user_name,
      title: "",
      excerpt: "",
      content: "",
      user_id,
      approved: false,
    },
  );

  if (locale !== "ar" && locale !== "en") {
    return <h1>Error Page.</h1>;
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleEditorChange(e: { target: { value: string } }) {
    const { value } = e.target;

    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
  }

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !formData.author ||
      !formData.title ||
      !formData.excerpt ||
      !formData.content
    ) {
      toast.error(messages.errors?.fillAllFields || "يرجى ملء جميع الحقول.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (method === "add") {
        const { error } = await supabase
          .from("articles")
          .insert([formData])
          .select();

        if (error) {
          toast.error(messages.errors?.addFailed || "فشل في إضافة المقال!");
          return;
        } else {
          toast.success(messages.success?.addSuccess || "تم إضافة المقال بنجاح!");

          setFormData({
            lang: locale || "ar",
            author: user_name,
            title: "",
            excerpt: "",
            content: "",
            user_id,
            approved: false,
          });
        }
      } else if (method === "edit") {
        const { error } = await supabase
          .from("articles")
          .update(formData)
          .eq("id", articleId);

        if (error) {
          toast.error(messages.errors?.editFailed || "فشل في تحديث المقال!");
          return;
        } else {
          toast.success(messages.success?.editSuccess || "تم تحديث المقال بنجاح!");
        }
      }
    } catch (error) {
      toast.error(messages.errors?.generalError || "حدث خطأ غير متوقع!");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
      >
        {/* Language Selection */}
        <div className="space-y-2">
          <label
            htmlFor="lang"
            className="flex items-center text-sm font-semibold text-gray-700 mb-2"
          >
            <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            {messages.articles.articleLang}
          </label>
          <select
            name="lang"
            id="lang"
            value={formData.lang}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50"
          >
            <option value="ar">🇸🇦 عربي</option>
            <option value="en">🇺🇸 English</option>
          </select>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="flex items-center text-sm font-semibold text-gray-700 mb-2"
          >
            <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {messages.articles.title}
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder={messages.articles.titlePlaceholder || "اكتب عنوان المقال..."}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            dir="auto"
          />
        </div>

        {/* Author */}
        <div className="space-y-2">
          <label
            htmlFor="author"
            className="flex items-center text-sm font-semibold text-gray-700 mb-2"
          >
            <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {messages.articles.author || "المؤلف"}
          </label>
          <input
            id="author"
            name="author"
            type="text"
            value={formData.author}
            onChange={handleChange}
            placeholder={messages.articles.authorPlaceholder || "اسم المؤلف..."}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50"
            dir="auto"
          />
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <label
            htmlFor="excerpt"
            className="flex items-center text-sm font-semibold text-gray-700 mb-2"
          >
            <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {messages.articles.excerpt}
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder={messages.articles.excerptPlaceholder || "اكتب ملخص قصير للمقال..."}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none"
            dir="auto"
          />
          <p className="text-xs text-gray-500">
            {messages.articles.excerptHelper || "ملخص قصير يظهر في قائمة المقالات"}
          </p>
        </div>

        {/* Content Editor */}
        <div className="space-y-2">
          <label
            htmlFor="content"
            className="flex items-center text-sm font-semibold text-gray-700 mb-2"
          >
            <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {messages.articles.content}
          </label>
          <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500">
            <Editor
              id="content"
              name="content"
              value={formData.content}
              onChange={handleEditorChange}
              className="min-h-80"
            />
          </div>
          <p className="text-xs text-gray-500">
            {messages.articles.contentHelper || "محتوى المقال الرئيسي"}
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {method === "edit" 
              ? (messages.articles.editingArticle || "تعديل المقال")
              : (messages.articles.creatingArticle || "إنشاء مقال جديد")
            }
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {messages.common.sending || "جاري الإرسال..."}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                {messages.common.send}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
export default ArticleForm;
