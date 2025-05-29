import { Metadata } from "next";
import { redirect } from "next/navigation";
import SEO from "@/components/ui/SEO";

// Generate metadata for the page
export async function generateMetadata({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}): Promise<Metadata> {
  const messages = (await import(`@/locales/${locale}.json`)).default;
  return SEO({
    title: messages.library.title,
    description: messages.library.description,
    locale,
    pageName: "library",
  });
}

export default async function PDFIndexPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // Redirect to library page
  redirect(`/${locale}/library`);
}
