import { supabase } from '@/supabase/initializing';
import { ArticleInterface } from '@/types/articles';
import { PostgrestError } from '@supabase/supabase-js';
import Link from 'next/link';

async function Articles({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  let { data: articles, error }: { data: ArticleInterface[] | null; error: PostgrestError | null } = await supabase.from('articles').select('*');

  if (locale !== 'ar' && locale !== 'en') {
    return <h1>Error in Locale!</h1>;
  }

  if (error || !articles) {
    return <h1>Error in Fetching</h1>;
  }

  console.log(articles, error);

  return (
    <>
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white py-10 rounded-lg shadow-lg">
        <div className="container mx-auto sm:px-4 px-2 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">المقالات</h1>
          <p className="text-xl mt-2 max-w-2xl mx-auto">مقالات متنوعة حول موضوعات هامة.</p>
        </div>
      </div>

      <div className="py-8">
        <div className="container mx-auto sm:px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
          {articles?.map((article) => (
            <div key={article.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
              <div className="p-4 flex flex-col h-full">
                <div className="flex items-center mb-3">
                  <h3 className="font-medium text-lg" dir="auto">
                    {article.title[locale]}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm mb-3 flex-grow" dir="auto">
                  {article.excerpt[locale]}
                </p>
                <div className="mt-auto pt-4">
                  <Link href={`/${locale}/articles/${article.id}`} className="block w-full sm:px-4 px-2 py-2 text-center bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
                    عرض المقال
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
