import { Metadata } from "next";
import SEO from "@/components/ui/SEO";

// Generate metadata for the page
export async function generateMetadata({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}): Promise<Metadata> {
  const messages = (await import(`@/locales/${locale}.json`)).default;
  return SEO({
    title: messages.contact.title,
    description: messages.contact.description,
    locale,
    pageName: "contact",
  });
}
