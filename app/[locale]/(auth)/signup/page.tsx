import SignupForm from "./SignupForm";

async function page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
          {messages.auth.signup}
        </h1>
        <p className="text-gray-600 text-sm font-medium">
          انضم إلى منصة حراس الثغور التعليمية
        </p>
      </div>

      {/* Form */}
      <SignupForm messages={messages} />
    </div>
  );
}
export default page;
