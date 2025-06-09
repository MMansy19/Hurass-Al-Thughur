import SigninForm from './SigninForm';

async function SignIn({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;

  return (
    <section className="py-10">
      <h1 className="text-center text-4xl font-bold text-emerald-700">{messages.auth.signin}</h1>
      <SigninForm messages={messages} />
    </section>
  );
}
export default SignIn;
