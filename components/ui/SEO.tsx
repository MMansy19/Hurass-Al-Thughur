interface SEOProps {
  title: string;
  description: string;
  locale: string;
  pageName: string;
  siteName?: string;
  image?: string;
  type?: 'website' | 'article' | 'book';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
}

// This is a server component that generates appropriate SEO metadata
export default function SEO({ 
  title, 
  description, 
  locale, 
  pageName, 
  siteName, 
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  keywords = []
}: SEOProps) {
  const alternateLocale = locale === "ar" ? "en" : "ar";
  const url = pageName === "" ? `/${locale}` : `/${locale}/${pageName}`;
  const alternateUrl = pageName === "" ? `/${alternateLocale}` : `/${alternateLocale}/${pageName}`;
  const defaultSiteName = siteName || (locale === "ar" ? "حُراس الثغور" : "Hurass Al-Thughur");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://hurass-al-thughur.com';
  const fullUrl = `${baseUrl}${url}`;
  const defaultImage = `${baseUrl}/images/logo.jpg`;

  // Generate structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type === 'article' ? "Article" : "WebPage",
    name: title,
    headline: title,
    description: description,
    url: fullUrl,
    image: image || defaultImage,
    inLanguage: locale === "ar" ? "ar-SA" : "en-US",
    publisher: {
      "@type": "Organization",
      name: defaultSiteName,
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: defaultImage
      }
    },
    ...(type === 'article' && {
      author: {
        "@type": "Person",
        name: author || defaultSiteName
      },
      ...(publishedTime && { datePublished: publishedTime }),
      ...(modifiedTime && { dateModified: modifiedTime })
    })
  };

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    authors: author ? [{ name: author }] : undefined,
    creator: defaultSiteName,
    publisher: defaultSiteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: defaultSiteName,
      locale: locale === "ar" ? "ar-SA" : "en-US",
      type: type,
      images: [
        {
          url: image || defaultImage,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined
      })
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image || defaultImage],
      creator: '@hurass_al_thughur',
    },
    alternates: {
      canonical: fullUrl,
      languages: {
        [alternateLocale]: `${baseUrl}${alternateUrl}`,
      },
    },    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large' as 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    other: {
      'application/ld+json': JSON.stringify(structuredData),
    },
  };
}
