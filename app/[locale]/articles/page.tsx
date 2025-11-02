import { supabase } from "@/supabase/initializing";
import { ArticleInterface } from "@/types/articles";
import { PostgrestError } from "@supabase/supabase-js";
import { ArticlesClient } from "@/components/ui/ArticlesClient";
import Link from "next/link";

async function Articles({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Translations
  const messages = (await import(`@/locales/${locale}.json`)).default;
  // Getting articles depending on Website language
  const {
    data: articles,
    error,
  }: { data: ArticleInterface[] | null; error: PostgrestError | null } =
    await supabase
      .from("articles")
      .select("*")
      .eq("lang", locale)
      .eq("approved", true)
      .order("created_at", { ascending: true });

  if (locale !== "ar" && locale !== "en") {
    return <h1>Error in Locale!</h1>;
  }

  if (error || !articles) {
    return <h1>Error in Fetching</h1>;
  }
  if (articles.length === 0) {
    return (
        <div className="flex-shrink-0">
      <p className="text-center font-bold text-2xl mt-10">
        {messages.articles.noArticlesYet}
      </p>
                <Link
                  href={`/${locale}/articles/add`}
                  className="flex mx-auto justify-center items-center gap-3 px-6 py-3 mt-10 max-w-xs bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                  >
                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                  </svg>
                  <span className="whitespace-nowrap">
                    {locale === 'ar' ? 'انشر مقالا' : 'Publish Article'}
                  </span>
                </Link>
                
              </div>
    );
  }
  return (
    <>
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 text-white py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-400/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-emerald-300/10 rounded-full blur-2xl"></div>
        </div>
        <div className="container mx-auto sm:px-4 px-2 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-600/30 backdrop-blur-sm rounded-full text-emerald-100 text-sm font-medium mb-6">
              <svg
                className="w-4 h-4 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {messages.articles.articles}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent leading-tight">
              {messages.articles.articles}
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 leading-relaxed max-w-3xl mx-auto font-light">
              {messages.articles.articlesSectionDescription}
            </p>
          </div>
        </div>
      </section>
      {/* Articles with Filters */}
      <ArticlesClient 
        articles={articles}
        locale={locale}
        messages={messages}
      />

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          href={`/${locale}/articles/add`}
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
          title={locale === 'ar' ? 'انشر مقالا' : 'Publish Article'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 group-hover:scale-110 transition-transform"
          >
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
          </svg>
        </Link>
      </div>

    </>
  );
}
export default Articles;
