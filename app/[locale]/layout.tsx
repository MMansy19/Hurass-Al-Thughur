import type { Metadata } from "next/types";
import { Cairo, Roboto } from "next/font/google";
import "../globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { PerformanceMonitor } from "@/components/ui/PerformanceMonitor";
import { AccessibilityProvider } from "@/components/ui/AccessibilityProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AuthErrorBoundary } from "@/components/auth/AuthErrorBoundary";
import { inter, arabicFont, criticalCSS } from "@/styles/fonts";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";

// Import the Cairo font for Arabic (fallback)
const cairoFont = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
  fallback: ["Arial", "sans-serif"],
});

// Import the Roboto font for English (fallback)
const robotoFont = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
  fallback: ["system-ui", "arial"],
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
  const fontClass =
    locale === "ar"
      ? `${cairoFont.variable} ${arabicFont.variable}`
      : `${robotoFont.variable} ${inter.variable}`;
  const messages = (await import(`@/locales/${locale}.json`)).default;

  return (
    <html lang={locale} dir={dir} className={`${fontClass}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/images/logo.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-gray-50">
      <NextTopLoader
          color="#059669"
          initialPosition={0.08}
          crawlSpeed={200}
          height={10}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2299DD,0 0 5px #2299DD"
          zIndex={1600}
          showAtBottom={false} />
        <PerformanceMonitor />
        <ErrorBoundary>
          <AuthErrorBoundary>
            <AuthProvider>
              <AccessibilityProvider>
                {" "}
                <Header
                  locale={locale}
                  messages={{
                    ...messages.common,
                    signin: messages.auth.signin,
                    signup: messages.auth.signup,
                  }}
                />
                <main className="container mx-auto sm:px-2 flex-grow">
                  <div className="h-16 md:h-20"></div>
                  <div className="animate-fadeIn">{children}</div>
                </main>
                <Footer
                  locale={locale}
                  messages={{ ...messages.footer, common: messages.common }}
                />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: "#f9fafb",
                      color: "#374151",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontWeight: "500",
                    },
                    success: {
                      style: {
                        background: "#f0f9ff",
                        color: "#059669",
                        border: "1px solid #a7f3d0",
                      },
                      iconTheme: {
                        primary: "#059669",
                        secondary: "#f0f9ff",
                      },
                    },
                    error: {
                      style: {
                        background: "#fef2f2",
                        color: "#dc2626",
                        border: "1px solid #fecaca",
                      },
                      iconTheme: {
                        primary: "#dc2626",
                        secondary: "#fef2f2",
                      },
                    },
                  }}
                />
              </AccessibilityProvider>
            </AuthProvider>
          </AuthErrorBoundary>
        </ErrorBoundary>
      </body>
    </html>
  );
}
