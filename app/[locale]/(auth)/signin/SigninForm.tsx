'use client';

import { supabase } from '@/supabase/initializing';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

function SigninForm({ messages }: { messages: Record<string, any> }) {
  const [formData, setFormData] = useState({
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

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (data.user) {
      alert(messages.auth.signinSuccess);
      router.push(`/${locale}`);
    }

    if (error) {
      alert(`${messages.auth.signinError}`);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-8 flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md">
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
      <button className="bg-emerald-700 text-white py-3 font-semibold rounded-md">{messages.auth.signin}</button>

      {/* Sign up link */}
      <div className="text-center mt-4">
        <p className="text-gray-600">
          {messages.auth.dontHaveAccount}{' '}
          <Link
            href={`/${locale}/signup`}
            className="text-emerald-700 hover:text-emerald-800 font-semibold underline"
          >
            {messages.auth.signup}
          </Link>
        </p>
      </div>
    </form>
  );
}
export default SigninForm;
