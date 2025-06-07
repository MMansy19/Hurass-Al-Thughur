'use client';

import { useState } from 'react';

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <section>
      <h1 className="text-center text-4xl font-bold text-emerald-700">تسجيل الدخول</h1>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-8 flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            البريد الإلكتروني
          </label>
          <input id="author" name="email" type="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            كلمة المرور
          </label>
          <input id="author" name="email" type="email" value={formData.password} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
        </div>

        <button className="bg-emerald-700 text-white py-3 font-semibold rounded-md">تسجيل الدخول</button>
      </form>
    </section>
  );
}
export default SignIn;
