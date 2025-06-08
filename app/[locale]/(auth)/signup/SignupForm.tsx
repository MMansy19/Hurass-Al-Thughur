'use client';

import { supabase } from '@/supabase/initializing';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

function SignupForm({ messages }: { messages: Record<string, any> }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Getting the locale from the URL parameters
  const params = useParams<{ locale: string }>();
  const { locale } = params;

  // Using the Next.js router to navigate
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name,
        },
      },
    });

    if (data.user) {
      alert(messages.auth.signupSuccess);
      router.push(`/${locale}`);
    }

    if (error) {
      alert(`${messages.auth.signupError}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-8 flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          {messages.auth.name}
        </label>
        <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {messages.auth.email}
        </label>
        <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {messages.auth.password}
        </label>
        <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
      </div>

      <button className="bg-emerald-700 text-white py-3 font-semibold rounded-md">{messages.auth.signup}</button>
    </form>
  );
}
export default SignupForm;
