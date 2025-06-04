import { supabase } from '@/supabase/initializing';
import { ArticleInterface, ArticlePageParamsInterface } from '@/types/articles';

async function Article({ params }: { params: Promise<ArticlePageParamsInterface> }) {
  const { locale, articleId } = await params;

  if (locale !== 'ar' && locale !== 'en') {
    return <h1>Page Error</h1>;
  }

  // Getting Article from Supabase
  let { data: article }: { data: ArticleInterface | null } = await supabase.from('articles').select('*').eq('id', articleId).single();

  if (!article) {
    return <h1>Article Not Found!</h1>;
  }

  return (
    <>
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-8 lg:py-16 rounded-xl">
        <div className="container mx-auto sm:px-4 px-2">
          <div className="max-w-4xl mx-auto">
            {/* Article Header */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-4 text-emerald-100 text-sm">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  {article.author}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {article.created_at}
                </span>
              </div>
            </div>

            {/* Title and Excerpt */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{article.title[locale]}</h1>
            <p className="text-xl text-emerald-100 leading-relaxed">{article.excerpt[locale]}</p>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="container mx-auto sm:px-4 px-2">
          <div className="max-w-4xl mx-auto">{article.content[locale]}</div>
        </div>
      </section>
    </>
  );
}
export default Article;
