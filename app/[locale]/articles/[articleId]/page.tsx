import "@/styles/articles.css";
import { supabase } from "@/supabase/initializing";
import { ArticleInterface, ArticlePageParamsInterface } from "@/types/articles";
import { ShareButtons } from "@/components/ui/ArticleComponents";
import ClientReadingProgress from "@/components/ui/ClientReadingProgress";
import Link from "next/link";

async function Article({
  params,
}: {
  params: Promise<ArticlePageParamsInterface>;
}) {
  const { locale, articleId } = await params;

  if (locale !== "ar" && locale !== "en") {
    return <h1>Page Error</h1>;
  }

  // Getting Article from Supabase
  const { data: article }: { data: ArticleInterface | null } = await supabase
    .from("articles")
    .select("*")
    .eq("id", articleId)
    .single();

  if (!article) {
    return <h1>Article Not Found!</h1>;
  }
  const wordCount = article.content.replace(/<[^>]*>/g, "").split(" ").length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <>
      {/* Reading Progress Bar */}
      <ClientReadingProgress target="article" />

      {/* Enhanced Article Header */}
      <section className="relative bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-24 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav
              className="flex items-center gap-2 text-emerald-200 text-sm mb-6 sm:mb-8"
              dir={locale === "ar" ? "rtl" : "ltr"}
            >
              <Link
                href={`/${locale}`}
                className="hover:text-white transition-colors"
              >
                {locale === "ar" ? "الرئيسية" : "Home"}
              </Link>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d={
                    locale === "ar"
                      ? "M15.707 7.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 11.586l4.293-4.293a1 1 0 011.414 0z"
                      : "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  }
                  clipRule="evenodd"
                />
              </svg>
              <Link
                href={`/${locale}/articles`}
                className="hover:text-white transition-colors"
              >
                {locale === "ar" ? "المقالات" : "Articles"}
              </Link>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d={
                    locale === "ar"
                      ? "M15.707 7.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 11.586l4.293-4.293a1 1 0 011.414 0z"
                      : "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  }
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-white font-medium truncate">
                {article.title.length > 30
                  ? `${article.title.substring(0, 30)}...`
                  : article.title}
              </span>
            </nav>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600/30 backdrop-blur-sm rounded-full flex items-center justify-center text-emerald-100 border border-emerald-400/30 flex-shrink-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-emerald-100 text-sm font-medium truncate">
                    {article.author}
                  </p>
                  <p className="text-emerald-300 text-xs">
                    {locale === "ar" ? "الكاتب" : "Author"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600/30 backdrop-blur-sm rounded-full flex items-center justify-center text-emerald-100 border border-emerald-400/30 flex-shrink-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-emerald-100 text-sm font-medium">
                    {new Date(article.created_at).toLocaleDateString(
                      locale === "ar" ? "ar-SA" : "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </p>
                  <p className="text-emerald-300 text-xs">
                    {locale === "ar" ? "تاريخ النشر" : "Published"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600/30 backdrop-blur-sm rounded-full flex items-center justify-center text-emerald-100 border border-emerald-400/30 flex-shrink-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 12.236 11.618 14z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-emerald-100 text-sm font-medium">
                    {article.lang === "ar" ? "العربية" : "English"}
                  </p>
                  <p className="text-emerald-300 text-xs">
                    {locale === "ar" ? "اللغة" : "Language"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <h1
                className="text-center sm:text-start md:py-2 text-4xl md:text-6xl lg:text-7xl font-bold leading-relaxed bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent "
                dir="auto"
              >
                {article.title}
              </h1>
              <p
                className="text-lg sm:text-xl md:text-2xl text-emerald-100 leading-relaxed font-light"
                dir="auto"
              >
                {article.excerpt}
              </p>
            </div>

            <div className="mt-6 sm:mt-8 flex items-center gap-4">
              <div className="flex items-center gap-2 text-emerald-200">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">
                  {readingTime} {locale === "ar" ? "دقائق قراءة" : "min read"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="container mx-auto sm:px-4 px-2">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-8 lg:p-12">
                <div className="max-w-4xl mx-auto">
                      <div
                        id="article"
                        className="prose prose-base sm:prose-lg prose-emerald max-w-none"
                      >
                        <div className="prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-base sm:prose-p:text-lg">
                          <h1 className="text-2xl font-bold">
                            {article.title}
                          </h1>
                          <div
                            className="mt-2"
                            dangerouslySetInnerHTML={{
                              __html: article.content,
                            }}
                            dir="auto"
                          />
                        </div>
                      </div>
                  {/* Share Buttons */}
                  <div className="mb-6 sm:mb-8">
                    <ShareButtons
                      title={article.title}
                      url={`/${locale}/articles/${article.id}`}
                      locale={locale}
                    />
                  </div>

                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0">
                        {article.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {article.author}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {locale === "ar" ? "كاتب المقال" : "Article Author"}
                        </p>
                      </div>
                    </div>

                    <div className="w-full lg:w-auto">
                      <Link
                        href={`/${locale}/articles`}
                        className="w-full lg:w-auto inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors duration-300"
                      >
                        <svg
                          className="w-5 h-5 mx-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={
                              locale === "ar"
                                ? "M17 8l4 4m0 0l-4 4m4-4H3"
                                : "M7 16l-4-4m0 0l4-4m-4 4h18"
                            }
                          />
                        </svg>
                        {locale === "ar"
                          ? "العودة للمقالات"
                          : "Back to Articles"}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default Article;
