"use client";

import { supabase } from "@/supabase/initializing";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Messages } from "@/types/messages";
import toast from "react-hot-toast";

function SigninForm({ messages }: { messages: Messages }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const params = useParams<{ locale: string }>();
  const { locale } = params;

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

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(`${messages.auth.signinError}: ${error.message}`);
        return;
      }

      if (data.user) {
        window.localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(messages.auth.signinSuccess);
        router.push(`/${locale}/dashboard`);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(`${messages.auth.signinError}: An unexpected error occurred`);
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto mt-8 flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md"
    >
      <div className="flex flex-col gap-1">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          {messages.auth.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          {messages.auth.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
      <button className="bg-emerald-700 text-white py-3 font-semibold rounded-md">
        {messages.auth.signin}
      </button>

      {/* Sign up link */}
      <div className="text-center mt-4">
        <p className="text-gray-600">
          {messages.auth.dontHaveAccount}{" "}
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
