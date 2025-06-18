'use client';

import { supabase } from '@/supabase/initializing';
import { ArticleInterface } from '@/types/articles';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Editor from 'react-simple-wysiwyg';
import { useCanEditArticle } from '@/components/ui/hooks/useCanEditArticle';

interface AddArticleFormProps {
  method: 'add' | 'edit';
  initialData?: ArticleInterface | null;
  messages: Record<string, any>;
}

function ArticleForm({ method, initialData, messages }: AddArticleFormProps) {
  const params = useParams();
  const router = useRouter();
  const { locale, articleId }: { locale?: string; articleId?: string } = params;
    // Check edit permission for edit mode
  const { canEdit, loading: authLoading, user } = useCanEditArticle(articleId || '');
  
  const [formData, setFormData] = useState(
    initialData || {
      lang: locale || 'ar',
      author: '',
      title: '',
      excerpt: '',
      content: '',
    }
  );

  useEffect(() => {
    // Redirect if user is not signed in for add mode
    async function checkAuthForAdd() {
      if (method === 'add') {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push(`/${locale}/signin`);
        }
      }
    }
    checkAuthForAdd();
  }, [method, router, locale]);

  // Redirect if user is not signed in
  useEffect(() => {
    if (!authLoading && method === 'edit' && !user) {
      router.push(`/${locale}/signin`);
    }
  }, [authLoading, method, user, router, locale]);

  // Show loading while checking authorization for edit mode
  if (method === 'edit' && authLoading) {
    return (
      <div className="max-w-4xl mx-auto mt-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show unauthorized message if user cannot edit
  if (method === 'edit' && !canEdit) {
    return (
      <div className="max-w-4xl mx-auto mt-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            {messages?.errors?.unauthorizedEdit || 'Unauthorized'}
          </h2>
          <p className="text-red-600 mb-4">
            {messages?.errors?.cannotEditArticle || 'You can only edit articles that you created.'}
          </p>
          <button
            onClick={() => router.push(`/${locale}/articles`)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            {messages?.common?.goBack || 'Go Back'}
          </button>
        </div>
      </div>
    );
  }

  if (locale !== 'ar' && locale !== 'en') {
    return <h1>Error Page.</h1>;
  }

  function handleChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) {
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
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formData.author || !formData.title || !formData.excerpt || !formData.content) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      if (method === 'add') {
        // Get current user for adding articles
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          alert('You must be signed in to create articles.');
          router.push(`/${locale}/signin`);
          return;
        }

        // Include user_id when creating new article
        const articleData = {
          ...formData,
          user_id: user.id
        };

        const { error } = await supabase.from('articles').insert([articleData]).select();

        if (error) {
          console.error('Error inserting article:', error);
          alert('Failed!');
          return;
        } else {
          alert('Article added successfully!');

          setFormData({
            lang: locale || 'ar',
            author: '',
            title: '',
            excerpt: '',
            content: '',
          });
        }
      } else if (method === 'edit') {
        // Double-check authorization before updating
        if (!canEdit) {
          alert('You are not authorized to edit this article.');
          return;
        }

        const { error } = await supabase.from('articles').update(formData).eq('id', articleId);

        if (error) {
          console.error('Error Editing article:', error);
          alert('Failed!');
          return;
        } else {
          alert('Article Edited successfully!');
        }
      }
    } catch (error) {
      console.error('Error with article operation:', error);
      alert('Failed!');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-8 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="lang" className="block text-sm font-medium text-gray-700">
          {messages.articles.articleLang}
        </label>
        <select name="lang" id="lang" value={formData.lang} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500">
          <option value="ar">عربي</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">
          {messages.articles.author}
        </label>
        <input id="author" name="author" type="text" value={formData.author} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          {messages.articles.title}
        </label>
        <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
          {messages.articles.excerpt}
        </label>
        <input id="excerpt" name="excerpt" type="text" value={formData.excerpt} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          {messages.articles.content}
        </label>

        <Editor id="content" name="content" value={formData.content} onChange={handleEditorChange} className="min-h-40 h-fit" />
      </div>

      <button className="bg-emerald-700 text-white py-3 font-semibold rounded-md">{messages.common.send}</button>
    </form>
  );
}
export default ArticleForm;
