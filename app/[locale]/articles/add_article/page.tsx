'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Editor from 'react-simple-wysiwyg';

function AddArticle() {
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <main>
      <h1 className="text-4xl text-emerald-700 font-bold text-center">إضافة مقال</h1>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="author" className="font-semibold text-emerald-700">
            الكاتب
          </label>
          <input id="author" name="author" type="text" value={formData.author} onChange={handleChange} placeholder="اسم الكاتب" className="w-full px-4 py-2 border-2 rounded-md focus:outline-none focus:border-emerald-700" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="font-semibold text-emerald-700">
            العنوان
          </label>
          <input id="title" name="title" type="text" value={formData.title[locale]} onChange={handleChange} placeholder="عنوان المقال" className="w-full px-4 py-2 border-2 rounded-md focus:outline-none focus:border-emerald-700" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="excerpt" className="font-semibold text-emerald-700">
            <Editor id="content" name="content" value={formData.content[locale]} onChange={handleEditorChange} className="h-60" />
          </label>
          <input id="excerpt" name="excerpt" type="text" value={formData.excerpt[locale]} onChange={handleChange} placeholder="نبذة عن المقال" className="w-full px-4 py-2 border-2 rounded-md focus:outline-none focus:border-emerald-700" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="content" className="font-semibold text-emerald-700">
            المحتوى
          </label>

          <Editor id="content" name="content" value={formData.content[locale]} onChange={handleEditorChange} className="h-60" />
        </div>

        <button className="bg-emerald-700 text-white py-3 font-semibold rounded-md">إرسال</button>
      </form>
    </main>
  );
}
export default AddArticle;
