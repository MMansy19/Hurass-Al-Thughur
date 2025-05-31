"use client";

import { useState } from "react";

interface ContactPageProps {
  params: { locale: string };
}

export default function ContactPage({ params: { locale } }: ContactPageProps) {
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
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setSubmitError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Mock contact info
  const contactDetails = {
    email: "info@hurass.org",
    phone: "+123456789",
    telegram: "@hurass_org",
  };

  // Load locale JSON
  const messages = require(`@/locales/${locale}.json`);
  const { contact } = messages;
  const isRtl = locale === "ar";

  return (
    <div className="space-y-12">
      <section className="bg-emerald-700 text-white py-10 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">{contact.title}</h1>
          <p className="text-xl mt-2 max-w-2xl mx-auto">{contact.description}</p>
        </div>
      </section>

      <section>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">
                {locale === "ar" ? "أرسل لنا رسالة" : "Send us a message"}
              </h2>

              {submitSuccess ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {locale === "ar"
                    ? "تم إرسال رسالتك بنجاح. سنتواصل معك قريباً."
                    : "Your message has been sent successfully. We will contact you soon."}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      {submitError}
                    </div>
                  )}

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      {contact.name}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {contact.email}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      {contact.message}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-400"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        {locale === "ar" ? "جاري الإرسال..." : "Sending..."}
                      </span>
                    ) : (
                      contact.send
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Details */}
            <div>
              <h2 className="text-2xl font-bold mb-6">{contact.directContact}</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" />
                      <path d="M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">{contact.emailAddress}</h3>
                    <a href={`mailto:${contactDetails.email}`} className="text-emerald-600 hover:underline">
                      {contactDetails.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M3 5a2 2 0 012-2h3.28l1.5 4.5-2.25 1.13a11 11 0 005.5 5.5l1.13-2.25 4.5 1.5V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">{contact.phoneNumber}</h3>
                    <a href={`tel:${contactDetails.phone}`} className="text-emerald-600 hover:underline">
                      {contactDetails.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M20 6H4a2 2 0 00-2 2v8a2 2 0 002 2h7v-4H8v-2h3v-1c0-2.8 1.66-4 4.2-4 1.2 0 2.4.1 2.8.14v3.1h-1.9c-1.2 0-1.5.6-1.5 1.4v1.36h3l-.4 2h-2.6V18h5a2 2 0 002-2V8a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Telegram</h3>
                    <a href={`https://t.me/${contactDetails.telegram}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                      {contactDetails.telegram}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
