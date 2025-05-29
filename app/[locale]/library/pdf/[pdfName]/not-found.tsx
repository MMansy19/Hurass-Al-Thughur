import Link from "next/link";

export default async function NotFound({
  params
}: {
  params?: { locale: string }
}) {
  const locale = params?.locale || "ar";
  
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <svg className="w-20 h-20 text-red-500 mx-auto mb-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {locale === "ar" ? "الملف غير موجود" : "File Not Found"}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {locale === "ar" 
            ? "عذرًا، لم نتمكن من العثور على ملف PDF المطلوب." 
            : "Sorry, we couldn't find the requested PDF file."}
        </p>
        
        <div className="flex flex-col space-y-3">
          <Link 
            href={`/${locale}/library`}
            className="bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors shadow-sm"
          >
            {locale === "ar" ? "العودة إلى المكتبة" : "Return to Library"}
          </Link>
          
          <Link 
            href={`/${locale}`}
            className="text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {locale === "ar" ? "الذهاب إلى الصفحة الرئيسية" : "Go to Home Page"}
          </Link>
        </div>
      </div>
    </div>
  );
}
