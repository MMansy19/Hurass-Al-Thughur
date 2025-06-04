'use client';

import Editor from 'react-simple-wysiwyg';

function AddArticle() {
  return (
    <main>
      <h1 className="text-4xl text-emerald-700 font-bold text-center">إضافة مقال</h1>

      <form className="max-w-4xl mx-auto mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="author" className="font-semibold text-emerald-700">
            الكاتب
          </label>
          <input id="author" name="author" type="text" placeholder="اسم الكاتب" className="w-full px-4 py-2 border-2 rounded-md focus:outline-none focus:border-emerald-700" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="font-semibold text-emerald-700">
            العنوان
          </label>
          <input id="title" name="title" type="text" placeholder="عنوان المقال" className="w-full px-4 py-2 border-2 rounded-md focus:outline-none focus:border-emerald-700" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="excerpt" className="font-semibold text-emerald-700">
            نبذة
          </label>
          <input id="excerpt" name="excerpt" type="text" placeholder="نبذة عن المقال" className="w-full px-4 py-2 border-2 rounded-md focus:outline-none focus:border-emerald-700" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="content" className="font-semibold text-emerald-700">
            المحتوى
          </label>

          <Editor id="content" name="content" className="h-60" />
        </div>

        <button className="bg-emerald-700 text-white py-3 font-semibold rounded-md">إرسال</button>
      </form>
    </main>
  );
}
export default AddArticle;
