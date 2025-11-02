import SigninForm from "./SigninForm";

async function SignIn({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
          {messages.auth.signin}
        </h1>
        <p className="text-gray-600 text-sm font-medium">
          مرحباً بعودتك إلى حراس الثغور
        </p>
      </div>

      {/* Form */}
      <SigninForm messages={messages} />
    </div>
  );
}
export default SignIn;
