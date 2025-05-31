import { FC } from 'react';

interface StructuredDataProps {
  data: Record<string, any>;
}

export const StructuredData: FC<StructuredDataProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

// Helper functions for creating structured data
export const createWebsiteStructuredData = (
  name: string,
  description: string,
  url: string,
  locale: string
) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name,
  description,
  url,
  inLanguage: locale,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${url}/search?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
});

export const createArticleStructuredData = (
  title: string,
  description: string,
  author: string,
  datePublished: string,
  url: string,
  imageUrl?: string
) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  author: {
    "@type": "Person",
    name: author
  },
  datePublished,
  url,
  ...(imageUrl && {
    image: {
      "@type": "ImageObject",
      url: imageUrl
    }
  })
});

export const createOrganizationStructuredData = (
  name: string,
  url: string,
  logoUrl: string,
  description?: string
) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name,
  url,
  logo: {
    "@type": "ImageObject",
    url: logoUrl
  },
  ...(description && { description })
});

export const createBreadcrumbStructuredData = (
  items: Array<{ name: string; url: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url
  }))
});

export default StructuredData;
