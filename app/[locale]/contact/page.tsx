"use client";

import { useState } from "react";

export default function ContactPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // Import translations
  // This is a client component, so we need to use a different approach for translations
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Mock function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    
    // Simulate API call
    try {
      // Wait for 1 second to simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulate successful submission
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmitError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Mock contact details
  const contactDetails = {
    email: "info@hurass.org",
    phone: "+123456789",
    telegram: "@hurass_org",
  };

  // Get translations based on locale
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
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <span className="block sm:inline">
                    {locale === "ar" 
                      ? "تم إرسال رسالتك بنجاح. سنتواصل معك قريباً." 
                      : "Your message has been sent successfully. We will contact you soon."
                    }
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                      <span className="block sm:inline">{submitError}</span>
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:bg-gray-400"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -mx-1 mx-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
            
            {/* Direct Contact */}
            <div>
              <h2 className="text-2xl font-bold mb-6">{contact.directContact}</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="mx-4">
                    <h3 className="font-medium">{contact.emailAddress}</h3>
                    <a href={`mailto:${contactDetails.email}`} className="text-emerald-600 hover:text-emerald-700 transition-colors">
                      {contactDetails.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="mx-4">
                    <h3 className="font-medium">{contact.phoneNumber}</h3>
                    <a href={`tel:${contactDetails.phone}`} className="text-emerald-600 hover:text-emerald-700 transition-colors">
                      {contactDetails.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <div className="mx-4">
                    <h3 className="font-medium">{contact.telegram}</h3>
                    <a href={`https://t.me/${contactDetails.telegram.substring(1)}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 transition-colors">
                      {contactDetails.telegram}
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-lg mb-4">
                  {locale === "ar" ? "ساعات العمل" : "Working Hours"}
                </h3>
                <p className="text-gray-700">
                  {locale === "ar" 
                    ? "الأحد - الخميس: 9:00 صباحًا - 5:00 مساءً" 
                    : "Sunday - Thursday: 9:00 AM - 5:00 PM"
                  }
                </p>
                <p className="text-gray-700">
                  {locale === "ar" 
                    ? "الجمعة - السبت: مغلق" 
                    : "Friday - Saturday: Closed"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
