interface SEOProps {
  title: string;
  description: string;
  locale: string;
  pageName: string;
  siteName?: string;
}

// This is a server component that generates appropriate SEO metadata
export default function SEO({ title, description, locale, pageName, siteName }: SEOProps) {
  const alternateLocale = locale === "ar" ? "en" : "ar";
  const url = pageName === "" ? `/${locale}` : `/${locale}/${pageName}`;
  const alternateUrl = pageName === "" ? `/${alternateLocale}` : `/${alternateLocale}/${pageName}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
        siteName: siteName || (locale === "ar" ? "حُراس الثغور" : "Hurass Al-Thughur"),
      locale: locale === "ar" ? "ar-SA" : "en-US",
      type: "website",
    },
    alternates: {
      canonical: url,
      languages: {
        [alternateLocale]: alternateUrl,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
