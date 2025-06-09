import SignupForm from './SignupForm';

async function page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;

  return (
    <section className="py-10">
      <h1 className="text-center text-4xl font-bold text-emerald-700">{messages.auth.signup}</h1>
      <SignupForm messages={messages} />
    </section>
  );
}
export default page;
