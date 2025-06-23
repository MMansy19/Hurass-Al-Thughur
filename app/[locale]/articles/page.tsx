import { supabase } from "@/supabase/initializing";
import { ArticleInterface } from "@/types/articles";
import { PostgrestError } from "@supabase/supabase-js";
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
      .order("created_at", { ascending: false });

  if (locale !== "ar" && locale !== "en") {
    return <h1>Error in Locale!</h1>;
  }

  if (error || !articles) {
    return <h1>Error in Fetching</h1>;
  }
  console.log(articles);
  // Remove specific articles by name
  // articles = articles.filter((article) => ![8, 9, 10, 11].includes(article.id));
  // articles = articles.filter((article) => article.author === "محمود عبدالفتاح");
  return (
    <>
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white py-10 rounded-lg shadow-lg">
        <div className="container mx-auto sm:px-4 px-2 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">
            {messages.articles.articles}
          </h1>
          <p className="text-xl mt-2 max-w-2xl mx-auto">
            {messages.articles.articlesSectionDescription}
          </p>
        </div>
      </div>

      <div className="py-8">
        {" "}
        <div className="container mx-auto sm:px-4 px-2 mb-6">
          <Link
            href={`/${locale}/articles/add`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
            {messages.articles.addNewArticle}
          </Link>
        </div>
        <div className="container mx-auto sm:px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
          {articles?.map((article) => (
            <div
              key={article.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <div className="p-4 flex flex-col h-full">
                <div className="flex items-center mb-3">
                  <h3 className="font-medium text-lg" dir="auto">
                    {article.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm mb-3 flex-grow" dir="auto">
                  {article.excerpt}
                </p>{" "}
                <div className="mt-auto pt-4 flex items-center gap-4">
                  <Link
                    href={`/${locale}/articles/${article.id}`}
                    className="block w-full sm:px-4 px-2 py-2 text-center bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    {messages.articles.viewArticle}
                  </Link>
                  <Link
                    href={`/${locale}/articles/edit/${article.id}`}
                    className="block w-full sm:px-4 px-2 py-2 text-center bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                  >
                    {messages.articles.editArticle}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
export default Articles;
