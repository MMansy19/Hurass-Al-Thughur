import { ArticleInterface } from '@/types/articles';
import ArticleForm from '../../ArticleForm';
import { supabase } from '@/supabase/initializing';

async function AddArticle({ params }: { params: Promise<{ locale: string; articleId: string }> }) {
  const { locale, articleId } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;

  let { data: article }: { data: ArticleInterface | null } = await supabase.from('articles').select('*').eq('id', articleId).single();

  if (!article) {
    return <h1>عذرًا؛ لا يوجد مقال بهذا الـid.</h1>;
  }

  return (
    <div className="space-y-12">
      <section className="bg-emerald-700 text-white py-10 rounded-lg">
        <div className="container mx-auto sm:px-4 px-2 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">{messages.articles.addArticle}</h1>
        </div>
      </section>

      <section>
        <div className="container mx-auto sm:px-4 px-2">
          <ArticleForm method="edit" initialData={article} messages={messages} />
        </div>
      </section>
    </div>
  );
}
export default AddArticle;
