import { Metadata } from "next/types";
import Link from "next/link";
import SEO from "@/components/ui/SEO";

// Generate metadata for the page
export async function generateMetadata({ 
  params
}: { 
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  return SEO({
    title: messages.dawah.title,
    description: messages.dawah.description,
    locale,
    pageName: "dawah",
  });
}

export default async function DawahPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {  const { locale } = await params;  // Import translations
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const { dawah, common } = messages;

  // Mock data for introductory articles
  const introArticles = [    {
      id: 1,
      title: dawah.articles.whatIsIslam.title,
      excerpt: dawah.articles.whatIsIslam.excerpt,
      image: "/images/what-is-islam.jpg", // Placeholder
    },    {
      id: 2,
      title: dawah.articles.whoIsMuhammad.title,
      excerpt: dawah.articles.whoIsMuhammad.excerpt,
      image: "/images/prophet-muhammad.jpg", // Placeholder
    },    {
      id: 3,
      title: dawah.articles.holyQuran.title,
      excerpt: dawah.articles.holyQuran.excerpt,
      image: "/images/quran.jpg", // Placeholder
    },
  ];

  // Mock data for new Muslim materials
  const newMuslimMaterials = [    {
      id: 1,
      title: dawah.newMuslimMaterials.firstSteps.title,
      type: dawah.newMuslimMaterials.firstSteps.type,
      image: "/images/first-steps.jpg", // Placeholder
    },    {
      id: 2,
      title: dawah.newMuslimMaterials.learnPrayer.title,
      type: dawah.newMuslimMaterials.learnPrayer.type,
      image: "/images/prayer-guide.jpg", // Placeholder
    },    {
      id: 3,
      title: dawah.newMuslimMaterials.dailyRemembrances.title,
      type: dawah.newMuslimMaterials.dailyRemembrances.type,
      image: "/images/daily-remembrance.jpg", // Placeholder
    },
  ];
  // Mock data for downloadable images
  const downloadableImages = [
    {
      id: 1,
      title: dawah.downloadableImages.pillarsOfIslam,
      image: "/images/pillars-of-islam.jpg", // Placeholder
    },
    {
      id: 2,
      title: dawah.downloadableImages.pillarsOfFaith,
      image: "/images/pillars-of-faith.jpg", // Placeholder
    },
    {
      id: 3,
      title: dawah.downloadableImages.mosqueMap,
      image: "/images/mosque-map.jpg", // Placeholder
    },
  ];

  return (
    <div className="space-y-12">
      <section className="bg-emerald-700 text-white py-10 rounded-lg">
        <div className="container mx-auto sm:px-4 px-2 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">{dawah.title}</h1>
          <p className="text-xl mt-2 max-w-2xl mx-auto">{dawah.description}</p>
        </div>
      </section>

      {/* Introduction to Islam Section */}
      <section>
        <div className="container mx-auto sm:px-4 px-2">
          <h2 className="text-2xl font-bold mb-6">{dawah.introToIslam}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {introArticles.map((article) => (
              <div key={article.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="aspect-video relative bg-gray-100">
                  {/* Placeholder for article image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-xl font-bold text-gray-400">{article.title}</div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                  <p className="text-gray-700 mb-4">{article.excerpt}</p>                  <Link 
                    href={`/${locale}/dawah/article/${article.id}`}
                    className="inline-block sm:px-4 px-2 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    {common.readMore}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Muslims Section */}
      <section className="bg-gray-50 py-10">
        <div className="container mx-auto sm:px-4 px-2">
          <h2 className="text-2xl font-bold mb-6">{dawah.newMuslims}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newMuslimMaterials.map((material) => (
              <div key={material.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="aspect-video relative bg-gray-100">
                  {/* Placeholder for material image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-lg font-medium text-gray-400">{material.title}</div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{material.title}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{material.type}</span>
                  </div>
                  <div className="mt-4 flex justify-between">                    
                    <button 
                    // Link Component must be used for navigation
                      // href={`/${locale}/dawah/material/${material.id}`}
                      className="inline-block sm:px-4 px-2 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                    >
                      {common.view}
                    </button>
                    <button 
                      className="sm:px-4 px-2 py-2 border border-emerald-600 text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors"
                    >
                      {dawah.download}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Downloadable Images Section */}
      <section>
        <div className="container mx-auto sm:px-4 px-2">
          <h2 className="text-2xl font-bold mb-6">{dawah.materials}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {downloadableImages.map((img) => (
              <div key={img.id} className="group relative border rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {/* Placeholder for downloadable image */}
                  <div className="text-lg font-medium text-gray-400">{img.title}</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-center p-4">
                    <p className="font-bold text-lg mb-3">{img.title}</p>
                    <button className="sm:px-4 px-2 py-2 bg-white text-emerald-700 rounded-md hover:bg-gray-100 transition-colors">
                      {dawah.download}
                    </button>
                    <button className="sm:px-4 px-2 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mx-2">
                      {dawah.share}
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
