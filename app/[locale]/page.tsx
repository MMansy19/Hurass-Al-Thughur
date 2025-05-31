import { Metadata } from "next/types";
import Image from "next/image";
import Link from "next/link";
import SEO from "../../components/ui/SEO";

// Generate metadata for the page
export async function generateMetadata({ 
  params
}: { 
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../locales/${locale}.json`)).default;
  return SEO({
    title: messages.home.title,
    description: messages.home.description,
    locale,
    pageName: "",
  });
}

export default async function Home({ 
  params
}: { 
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Import translations
  const messages = (await import(`../../locales/${locale}.json`)).default;
  const { home } = messages;
  const isRtl = locale === "ar";

  // Feature sections
  const sections = [
    {
      title: messages.common.magazine,
      description: locale === "ar" 
        ? "تصفح أعداد المجلة وملفات PDF بأعلى جودة" 
        : "Browse magazine issues and PDF files with high quality",
      image: "/file.svg",
      link: `/${locale}/magazine`,
    },
    {
      title: messages.common.dawah,
      description: locale === "ar" 
        ? "مواد تعريفية بالإسلام ودعوة لغير المسلمين" 
        : "Introductory materials about Islam for non-Muslims",
      image: "/window.svg",
      link: `/${locale}/dawah`,
    },
    {
      title: messages.common.library,
      description: locale === "ar" 
        ? "مكتبة شاملة من الصور والمطويات" 
        : "Comprehensive library of images and brochures",
      image: "/window.svg",
      link: `/${locale}/library`,
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white py-20 rounded-lg">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{home.welcome}</h1>
          <p className="text-xl max-w-2xl mb-8">{home.description}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href={`/${locale}/magazine`}
              className="px-8 py-3 bg-white text-emerald-700 rounded-md font-bold hover:bg-gray-100 transition-colors"
            >
              {messages.common.magazine}
            </Link>
            <Link 
              href={`/${locale}/dawah`}
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-md font-bold hover:bg-white hover:text-emerald-700 transition-colors"
            >
              {messages.common.dawah}
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">{home.about}</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 mb-6 text-center">
              {home.aboutText}
            </p>
          </div>
        </div>
      </section>

      {/* Sections Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">{home.sections}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="flex justify-center mb-4">
                    <Image src={section.image} alt={section.title} width={64} height={64} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center">{section.title}</h3>
                  <p className="text-gray-600 flex-grow mb-4 text-center">{section.description}</p>
                  <Link 
                    href={section.link}
                    className="text-center block w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors mt-auto"
                  >
                    {home.exploreMore}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
