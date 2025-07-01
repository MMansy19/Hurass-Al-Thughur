import { Metadata } from "next/types";
import SEO from "@/components/ui/SEO";
import PDFBrowser from "@/components/pdf/PDFBrowser";

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  return SEO({
    title: messages.library.title,
    description: messages.library.description,
    locale,
    pageName: "library",
  });
}

export default async function LibraryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params; // Import translations
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const { library, common } = messages;

  // Placeholder data - in a real app, this would come from a database or API
  const categories = [
    { id: 1, name: "Islamic Beliefs", count: 25 },
    { id: 2, name: "Prayer", count: 18 },
    { id: 3, name: "Quran", count: 32 },
    { id: 4, name: "Hadith", count: 28 },
    { id: 5, name: "Islamic History", count: 15 },
    { id: 6, name: "Prophets", count: 22 },
  ];

  const images = [
    {
      id: 1,
      title: "Islamic Calligraphy",
      url: "/images/sample1.jpg",
      category: "Art",
    },
    {
      id: 2,
      title: "Mosque Architecture",
      url: "/images/sample2.jpg",
      category: "Architecture",
    },
    {
      id: 3,
      title: "Islamic Patterns",
      url: "/images/sample3.jpg",
      category: "Design",
    },
    {
      id: 4,
      title: "Quran Verses",
      url: "/images/sample4.jpg",
      category: "Scripture",
    },
  ];

  const brochures = [
    { id: 1, title: "Introduction to Islam", pages: 12, category: "Basics" },
    { id: 2, title: "Five Pillars of Islam", pages: 8, category: "Practices" },
    {
      id: 3,
      title: "Prophet Muhammad (PBUH)",
      pages: 16,
      category: "Biography",
    },
    { id: 4, title: "Islamic Ethics", pages: 10, category: "Morality" },
  ];

  return (
    <div className="space-y-12">
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white py-10 rounded-lg shadow-lg">
        <div className="container mx-auto sm:px-4 px-2 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">{library.title}</h1>
          <p className="text-xl mt-2 max-w-2xl mx-auto">
            {library.description}
          </p>
        </div>
      </section>

      {/* PDF Browser Section */}
      <section className="py-8">
        <div className="container mx-auto sm:px-4 px-2">
          <h2 className="text-2xl font-bold mb-6">{library.pdfs}</h2>
          <PDFBrowser
            translations={{
              browseAllPDFs: library.browsePDFs,
              viewPDF: library.viewPDF,
              noPDFsFound: library.noPDFsFound,
              search: library.search,
              searchPlaceholder: library.searchPlaceholder,
            }}
          />
        </div>
      </section>
      {/* Categories Section */}
      <section>
        <div className="container mx-auto sm:px-4 px-2">
          <h2 className="text-2xl font-bold mb-6">{library.categories}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                // href={`/${locale}/library/category/${category.id}`}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
              >
                <h3 className="font-bold mb-2">{category.name}</h3>
                <span className="text-sm text-gray-500">
                  {category.count} {common.items}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Images Section */}
      <section className="bg-gray-50 py-10">
        <div className="container mx-auto sm:px-4 px-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{library.images}</h2>
            <button
              // href={`/${locale}/library/images`}
              className="text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              {common.viewAll}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {/* Placeholder for image thumbnail */}
                  <div className="text-xs text-center text-gray-400 p-2">
                    {image.title}
                  </div>
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-medium truncate">
                    {image.title}
                  </h3>
                  <p className="text-xs text-gray-500">{image.category}</p>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="space-x-2">
                    <button className="px-2 py-1 bg-white text-emerald-700 rounded text-xs font-medium hover:bg-gray-100 transition-colors">
                      {library.preview}
                    </button>
                    <button className="px-2 py-1 bg-emerald-600 text-white rounded text-xs font-medium hover:bg-emerald-700 transition-colors">
                      {library.download}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brochures Section */}
      <section>
        <div className="container mx-auto sm:px-4 px-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{library.brochures}</h2>
            <button
              // href={`/${locale}/library/brochures`}
              className="text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              {common.viewAll}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {brochures.map((brochure) => (
              <div
                key={brochure.id}
                className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                  {/* Placeholder for brochure thumbnail */}
                  <div className="text-lg font-medium text-gray-400">
                    {brochure.title}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{brochure.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {brochure.category}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      // href={`/${locale}/library/brochure/${brochure.id}`}
                      className="flex-1 sm:px-4 px-2 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-center"
                    >
                      {library.preview}
                    </button>
                    <button className="sm:px-4 px-2 py-2 border border-emerald-600 text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors">
                      {library.download}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
