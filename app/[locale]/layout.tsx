import type { Metadata } from "next";
import { Cairo, Roboto } from "next/font/google";
import "../globals.css";

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
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  // Import translations dynamically
  const messages = (await import(`../../locales/${locale}.json`)).default;

  return {
    title: {
      template: `%s | ${messages.common.language === "العربية" ? "حُراس الثغور" : "Hurass"}`,
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

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Set the direction based on locale
  const dir = locale === "ar" ? "rtl" : "ltr";
  
  // Choose the font based on the locale
  const fontClass = locale === "ar" ? cairoFont.variable : robotoFont.variable;

  return (
    <html lang={locale} dir={dir} className={`${fontClass}`}>
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
