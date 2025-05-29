import { Metadata } from "next";
import Link from "next/link";
import SEO from "@/components/ui/SEO";
import PDFViewerSection from "@/components/pdf/PDFViewerSection";

// Generate metadata for the page
export async function generateMetadata({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}): Promise<Metadata> {
  const messages = (await import(`@/locales/${locale}.json`)).default;
  return SEO({
    title: messages.magazine.title,
    description: messages.magazine.description,
    locale,
    pageName: "magazine",
  });
}

export default async function MagazinePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // Import translations
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const { magazine } = messages;

  // Mock data for magazine issues
  const magazineIssues = [
    {
      id: 1,
      title: locale === "ar" ? "العدد الأول" : "Issue 1",
      description: locale === "ar" 
        ? "مقدمة في الدعوة الإسلامية" 
        : "Introduction to Islamic Dawah",
      coverImage: "/images/magazine-cover-1.jpg", // Placeholder
      pdfUrl: "/pdfs/magazine-issue-1.pdf", // Placeholder
      date: locale === "ar" ? "يناير 2025" : "January 2025",
    },
    {
      id: 2,
      title: locale === "ar" ? "العدد الثاني" : "Issue 2",
      description: locale === "ar" 
        ? "منهجية الدعوة النبوية" 
        : "Methodology of Prophetic Dawah",
      coverImage: "/images/magazine-cover-2.jpg", // Placeholder
      pdfUrl: "/pdfs/magazine-issue-2.pdf", // Placeholder
      date: locale === "ar" ? "أبريل 2025" : "April 2025",
    },
  ];

  // Mock data for magazine categories
  const categories = [
    { id: 1, name: locale === "ar" ? "العقيدة" : "Aqeedah" },
    { id: 2, name: locale === "ar" ? "الفقه" : "Fiqh" },
    { id: 3, name: locale === "ar" ? "السيرة النبوية" : "Prophetic Biography" },
    { id: 4, name: locale === "ar" ? "التاريخ الإسلامي" : "Islamic History" },
  ];

  // Selected issue for demonstration
  const selectedIssue = magazineIssues[0];

  return (
    <div className="space-y-12">
      <section className="bg-emerald-700 text-white py-10 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">{magazine.title}</h1>
          <p className="text-xl mt-2 max-w-2xl mx-auto">{magazine.description}</p>
        </div>
      </section>

      {/* Latest Issues Section */}
      <section>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">{magazine.latestIssues}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {magazineIssues.map((issue) => (
              <div key={issue.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="aspect-[3/4] relative bg-gray-100">
                  {/* Placeholder for magazine cover */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-xl font-bold text-gray-400">{issue.title}</div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{issue.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{issue.date}</p>
                  <p className="text-gray-700 mb-4">{issue.description}</p>
                  <button 
                    className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    {magazine.readNow}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>      {/* PDF Viewer Section */}
      <PDFViewerSection 
        pdfUrl="/pdfs/1.pdf"
        title={selectedIssue.title}
        messages={magazine}
      />

      {/* Categories Section */}
      <section>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">{magazine.categories}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/magazine/category/${category.id}`}
                className="bg-gray-100 p-4 rounded-lg text-center hover:bg-emerald-100 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
