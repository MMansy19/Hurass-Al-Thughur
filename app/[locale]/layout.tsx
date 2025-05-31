import type { Metadata } from "next/types";
import { Cairo, Roboto } from "next/font/google";
import "../globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

// Import the Cairo font for Arabic
const cairoFont = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});

// Import the Roboto font for English
const robotoFont = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
});

// Define the metadata with dynamic locale
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // Import translations dynamically
  const messages = (await import(`@/locales/${locale}.json`)).default;

  return {
    title: {
      template: `%s | ${messages.common.language === "العربية" ? "حُراس الثغور" : "Hurass Al-Thughur"}`,
      default: messages.home.title,
    },
    description: messages.home.description,
    keywords: messages.seo.keywords,
    alternates: {
      canonical: `/`,
      languages: {
        en: `/en`,
        ar: `/ar`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Set the direction based on locale
  const dir = locale === "ar" ? "rtl" : "ltr";

    // Choose the font based on the locale
    const fontClass = locale === "ar" ? cairoFont.variable : robotoFont.variable;
    
    const messages = (await import(`@/locales/${locale}.json`)).default;
  return (
    <html lang={locale} dir={dir} className={`${fontClass}`}>
      <body className="antialiased min-h-screen flex flex-col bg-gray-50">
        <Header locale={locale} messages={messages.common} />
        <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="h-16 md:h-20"></div>
          <div className="animate-fadeIn">{children}</div>
        </main>
        <Footer locale={locale} messages={{...messages.footer, common: messages.common}} />
      </body>
    </html>
  );
}
