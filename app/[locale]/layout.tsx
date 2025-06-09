import type { Metadata } from "next/types";
import { Cairo, Roboto } from "next/font/google";
import "../globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { PerformanceMonitor } from "@/components/ui/PerformanceMonitor";
import { AccessibilityProvider } from "@/components/ui/AccessibilityProvider";
import { inter, arabicFont, criticalCSS } from "@/styles/fonts";

// Import the Cairo font for Arabic (fallback)
const cairoFont = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
  fallback: ['Arial', 'sans-serif'],
});

// Import the Roboto font for English (fallback)  
const robotoFont = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
  fallback: ['system-ui', 'arial'],
});

// Define the metadata with dynamic locale
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
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
  const dir = locale === "ar" ? "rtl" : "ltr";
  const fontClass = locale === "ar" ? 
    `${cairoFont.variable} ${arabicFont.variable}` : 
    `${robotoFont.variable} ${inter.variable}`;
  const messages = (await import(`@/locales/${locale}.json`)).default;

  return (
    <html lang={locale} dir={dir} className={`${fontClass}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/images/logo.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-gray-50">
        <PerformanceMonitor />
        <ErrorBoundary>
          <AccessibilityProvider>            <Header 
              locale={locale} 
              messages={{
                ...messages.common,
                signin: messages.auth.signin,
                signup: messages.auth.signup
              }}
            />
            <main className="container mx-auto sm:px-4 px-2 py-8 flex-grow">
              <div className="h-16 md:h-20"></div>
              <div className="animate-fadeIn">{children}</div>
            </main>
            <Footer locale={locale} messages={{...messages.footer, common: messages.common}} />
          </AccessibilityProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
