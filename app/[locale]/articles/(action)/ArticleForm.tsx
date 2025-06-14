'use client';

import { supabase } from '@/supabase/initializing';
import { ArticleInterface } from '@/types/articles';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import Editor from 'react-simple-wysiwyg';

interface AddArticleFormProps {
  method: 'add' | 'edit';
  initialData?: ArticleInterface | null;
  messages: Record<string, any>;
}

function ArticleForm({ method, initialData, messages }: AddArticleFormProps) {
  const params = useParams();
  const { locale, articleId }: { locale?: string; articleId?: string } = params;

  const [formData, setFormData] = useState(
    initialData || {
      lang: locale || 'ar',
      author: '',
      title: '',
      excerpt: '',
      content: '',
    }
  );

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
        const { error } = await supabase.from('articles').insert([formData]).select();

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
      console.error('Error inserting article:', error);
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
