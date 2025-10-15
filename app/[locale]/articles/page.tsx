import { supabase } from "@/supabase/initializing";
import { ArticleInterface } from "@/types/articles";
import { PostgrestError } from "@supabase/supabase-js";
import { ArticlesClient } from "@/components/ui/ArticlesClient";

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
      <p className="text-center font-bold text-2xl mt-10">
        {messages.articles.noArticlesYet}
      </p>
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
    </>
  );
}
export default Articles;
