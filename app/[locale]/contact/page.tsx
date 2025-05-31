import ContactForm from './ContactForm';

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;

  return (
    <div className="space-y-12">
      <section className="bg-emerald-700 text-white py-10 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">{messages.contact.title}</h1>
          <p className="text-xl mt-2 max-w-2xl mx-auto">
            {messages.contact.description}
          </p>
        </div>
      </section>      
      <section>
        <div className="container mx-auto px-4">
          <ContactForm locale={locale} messages={messages} />
        </div>
      </section>
    </div>
  );
}
