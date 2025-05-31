"use client";

import { useState } from "react";

interface ContactFormProps {
  messages: any;
}

export default function ContactForm({ messages }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", message: "" });    } catch {
      setSubmitError(messages.contact.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-emerald-700">
        {messages.contact.formTitle}
      </h2>
      {submitSuccess ? (
        <div className="bg-emerald-100 p-4 rounded-md mb-6">
          <p className="text-emerald-700">
            {messages.contact.thankYou}
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="mt-2 text-emerald-700 font-medium underline"
          >
            {messages.contact.sendAnother}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              {messages.contact.name}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              {messages.contact.email}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              {messages.contact.message}
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            ></textarea>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? messages.contact.sending : messages.contact.send}
            </button>
          </div>

          {submitError && (
            <div className="bg-red-100 p-3 rounded-md">
              <p className="text-red-700 text-sm">{submitError}</p>
            </div>
          )}
        </form>
      )}

      <div className="mt-10 space-y-4">        <div>
          <h3 className="text-lg font-medium text-gray-900">{messages.contact.visitUs}</h3>
          <p className="mt-1 text-gray-600">
            {messages.contact.address}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">{messages.contact.emailUs}</h3>
          <p className="mt-1 text-gray-600">
            <a
              href={`mailto:${messages.contact.email_contact}`}
              className="text-emerald-600 hover:underline"
            >
              {messages.contact.email_contact}
            </a>
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">{messages.contact.callUs}</h3>
          <p className="mt-1 text-gray-600">{messages.contact.phone}</p>
        </div>
      </div>
    </div>
  );
}
