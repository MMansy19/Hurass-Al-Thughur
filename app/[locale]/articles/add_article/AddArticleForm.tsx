'use client';

import { supabase } from '@/supabase/initializing';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import Editor from 'react-simple-wysiwyg';

interface AddArticleFormProps {
  messages: Record<string, any>;
}

function AddArticleForm({ messages }: AddArticleFormProps) {
  const params = useParams();
  const { locale }: { locale?: string } = params;

  if (locale !== 'ar' && locale !== 'en') {
    return <h1>Error Page.</h1>;
  }

  const [formData, setFormData] = useState({
    author: '',
    title: {
      ar: '',
      en: '',
    },
    excerpt: {
      ar: '',
      en: '',
    },
    content: {
      ar: '',
      en: '',
    },
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;

    if (name === 'author') {
      setFormData((prev) => ({
        ...prev,
        author: value,
      }));
    } else if (name === 'title' || name === 'excerpt') {
      setFormData((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          ar: value,
        },
      }));
    }
  }

  function handleEditorChange(e: { target: { value: string } }) {
    const { value } = e.target;

    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        ar: value,
      },
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { data, error } = await supabase.from('articles').insert([formData]).select();
    if (error) {
      console.error('Error inserting article:', error);
      alert('Failed!');
    }

    if (data) {
      alert('Article added successfully!');
      setFormData({
        author: '',
        title: {
          ar: '',
          en: '',
        },
        excerpt: {
          ar: '',
          en: '',
        },
        content: {
          ar: '',
          en: '',
        },
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-8 flex flex-col gap-4">
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
        <input id="title" name="title" type="text" value={formData.title[locale]} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
          {messages.articles.excerpt}
        </label>
        <input id="excerpt" name="excerpt" type="text" value={formData.excerpt[locale]} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          {messages.articles.content}
        </label>

        <Editor id="content" name="content" value={formData.content[locale]} onChange={handleEditorChange} className=" h-fit" />
      </div>

      <button className="bg-emerald-700 text-white py-3 font-semibold rounded-md">إرسال</button>
    </form>
  );
}
export default AddArticleForm;
