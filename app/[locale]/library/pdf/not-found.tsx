import Link from "next/link";

export default async function NotFound({
  params
}: {
  params?: Promise<{ locale: string }>
}) {
  const { locale } = await params || { locale: "ar" };
  const messages = (await import(`@/locales/${locale}.json`)).default;
  
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">        <svg className="w-20 h-20 text-amber-500 mx-auto mb-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {messages.notFound.pageNotAvailable}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {messages.notFound.selectPDF}
        </p>
        
        <div className="flex flex-col space-y-3">
          <Link 
            href={`/${locale}/library`}
            className="bg-emerald-600 text-white py-2 sm:px-4 px-2 rounded-md hover:bg-emerald-700 transition-colors shadow-sm"
          >
            {messages.notFound.goToLibrary}
          </Link>
        </div>
      </div>
    </div>
  );
}
