import { Metadata } from "next/types";
import Link from "next/link";
import SEO from "@/components/ui/SEO";
import PDFBrowser from "@/components/pdf/PDFBrowser";

// Generate metadata for the page
export async function generateMetadata({ 
  params
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
  const { locale } = await params;  // Import translations
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const { library, common } = messages;
  // Categories for the library
  const categories = [
    { id: 1, name: library.categoryNames.tawheed, count: 12 },
    { id: 2, name: library.categoryNames.worship, count: 15 },
    { id: 3, name: library.categoryNames.ethics, count: 8 },
    { id: 4, name: library.categoryNames.prophetBiography, count: 10 },
    { id: 5, name: library.categoryNames.family, count: 7 },
    { id: 6, name: library.categoryNames.society, count: 5 },
  ];
  // Mock data for images
  const images = [
    {
      id: 1,
      title: library.imageTopics.pillarsOfIslam,
      category: library.categoryNames.worship,
      thumbnail: "/images/pillars-of-islam-thumb.jpg", // Placeholder
      fullImage: "/images/pillars-of-islam.jpg", // Placeholder
    },
    {
      id: 2,
      title: library.imageTopics.namesOfAllah,
      category: library.categoryNames.tawheed,
      thumbnail: "/images/names-of-allah-thumb.jpg", // Placeholder
      fullImage: "/images/names-of-allah.jpg", // Placeholder
    },
    {
      id: 3,
      title: library.imageTopics.prayer,
      category: library.categoryNames.worship,
      thumbnail: "/images/prayer-thumb.jpg", // Placeholder
      fullImage: "/images/prayer.jpg", // Placeholder
    },
    {
      id: 4,
      title: library.imageTopics.fasting,
      category: library.categoryNames.worship,
      thumbnail: "/images/fasting-thumb.jpg", // Placeholder
      fullImage: "/images/fasting.jpg", // Placeholder
    },
    {
      id: 5,
      title: library.imageTopics.hajj,
      category: library.categoryNames.worship,
      thumbnail: "/images/hajj-thumb.jpg", // Placeholder
      fullImage: "/images/hajj.jpg", // Placeholder
    },
    {
      id: 6,
      title: library.imageTopics.zakah,
      category: library.categoryNames.worship,
      thumbnail: "/images/zakah-thumb.jpg", // Placeholder
      fullImage: "/images/zakah.jpg", // Placeholder
    },
  ];
  // Mock data for brochures
  const brochures = [
    {
      id: 1,
      title: library.brochureTopics.newMuslimGuide,
      category: library.categoryNames.worship,
      thumbnail: "/images/new-muslim-guide-thumb.jpg", // Placeholder
      pdfUrl: "/pdfs/new-muslim-guide.pdf", // Placeholder
    },
    {
      id: 2,
      title: library.brochureTopics.howToPray,
      category: library.categoryNames.worship,
      thumbnail: "/images/how-to-pray-thumb.jpg", // Placeholder
      pdfUrl: "/pdfs/how-to-pray.pdf", // Placeholder
    },
    {
      id: 3,
      title: library.brochureTopics.supplications,
      category: library.categoryNames.worship,
      thumbnail: "/images/supplications-thumb.jpg", // Placeholder
      pdfUrl: "/pdfs/supplications.pdf", // Placeholder
    },
  ];

  return (
    <div className="space-y-12">
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white py-10 rounded-lg shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">{library.title}</h1>
          <p className="text-xl mt-2 max-w-2xl mx-auto">{library.description}</p>
        </div>
      </section>

      {/* PDF Browser Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">{library.pdfs}</h2>
          <PDFBrowser
            translations={{
              browseAllPDFs: library.browsePDFs,
              viewPDF: library.viewPDF,
              noPDFsFound: library.noPDFsFound,
              search: library.search,
              searchPlaceholder: library.searchPlaceholder
            }}
          />
        </div>
      </section>
      
      {/* Categories Section */}
      <section>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">{library.categories}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/library/category/${category.id}`}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
              >
                <h3 className="font-bold mb-2">{category.name}</h3>
                <span className="text-sm text-gray-500">{category.count} {common.items}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Images Section */}
      <section className="bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{library.images}</h2>            <Link 
              href={`/${locale}/library/images`}
              className="text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              {common.viewAll}
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image) => (
              <div key={image.id} className="group relative bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {/* Placeholder for image thumbnail */}
                  <div className="text-xs text-center text-gray-400 p-2">{image.title}</div>
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-medium truncate">{image.title}</h3>
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
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{library.brochures}</h2>            <Link 
              href={`/${locale}/library/brochures`}
              className="text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              {common.viewAll}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {brochures.map((brochure) => (
              <div key={brochure.id} className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                  {/* Placeholder for brochure thumbnail */}
                  <div className="text-lg font-medium text-gray-400">{brochure.title}</div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{brochure.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{brochure.category}</p>
                  <div className="flex space-x-2">
                    <Link 
                      href={`/${locale}/library/brochure/${brochure.id}`}
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-center"
                    >
                      {library.preview}
                    </Link>
                    <button 
                      className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors"
                    >
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
