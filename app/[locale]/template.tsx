import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocalePageLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  // Import translations dynamically
  const messages = (await import(`../../locales/${locale}.json`)).default;

  return (
    <>
      <Header locale={locale} messages={messages.common} />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>
      <Footer locale={locale} messages={messages.footer} />
    </>
  );
}
