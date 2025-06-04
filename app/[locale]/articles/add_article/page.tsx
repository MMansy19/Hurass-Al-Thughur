import AddArticleForm from './AddArticleForm';

async function AddArticle({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;

  return (
    <div className="space-y-12">
      <section className="bg-emerald-700 text-white py-10 rounded-lg">
        <div className="container mx-auto sm:px-4 px-2 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">{messages.articles.addArticle}</h1>
        </div>
      </section>

      <section>
        <div className="container mx-auto sm:px-4 px-2">
          <AddArticleForm messages={messages} />
        </div>
      </section>
    </div>
  );
}
export default AddArticle;
