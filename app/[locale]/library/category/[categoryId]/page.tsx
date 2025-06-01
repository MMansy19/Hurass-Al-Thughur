import { Metadata } from "next/types";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import SEO from "@/components/ui/SEO";
import { SkipLinks } from "@/components/ui/AccessibilityComponents";
import { AccessibleGrid, AccessibleSearch } from "@/components/ui/AccessibilityEnhancements";
import { Motion } from "@/components/ui/AnimationSystem";
import { MagazineGridSkeleton } from "@/components/ui/LoadingStates";
import { MemoizedPagination } from "@/components/ui/MemoizedComponents";

// Generate metadata for the page
export async function generateMetadata({ 
  params
}: { 
  params: Promise<{ locale: string; categoryId: string }>;
}): Promise<Metadata> {
  const { locale, categoryId } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  
  // Get category name from categoryId
  const categoryNames = messages.library.categoryNames;
  const categoryName = categoryNames[categoryId as keyof typeof categoryNames] || categoryId;
  
  return {
    ...SEO({
      title: `${categoryName} - ${messages.library.title}`,
      description: `${messages.library.description} - ${categoryName}`,
      locale,
      pageName: `library-category-${categoryId}`,
    }),
    robots: {
      index: true,
      follow: true,
    },
  };
}

interface LibraryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'image' | 'brochure' | 'pdf';
  fileSize?: string;
  pageCount?: number;
  imageUrl?: string;
}

export default async function LibraryCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; categoryId: string }>;
}) {
  const { locale, categoryId } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const { library } = messages;
  const isArabic = locale === 'ar';

  // Validate categoryId
  const validCategories = Object.keys(library.categoryNames);
  if (!validCategories.includes(categoryId)) {
    notFound();
  }

  const categoryName = library.categoryNames[categoryId as keyof typeof library.categoryNames];

  // Mock data for the category
  const categoryItems: LibraryItem[] = [
    {
      id: "1",
      title: isArabic ? "مطوية التوحيد" : "Tawheed Brochure",
      description: isArabic ? "مطوية تعريفية بأساسيات التوحيد في الإسلام" : "Introductory brochure on the basics of Tawheed in Islam",
      category: categoryName,
      type: 'brochure',
      fileSize: "1.2 MB",
      pageCount: 8
    },
    {
      id: "2",
      title: isArabic ? "صور أركان الإسلام" : "Pillars of Islam Images",
      description: isArabic ? "مجموعة صور تعليمية عن أركان الإسلام الخمسة" : "Educational images about the five pillars of Islam",
      category: categoryName,
      type: 'image',
      imageUrl: "/images/pillars-islam.jpg"
    },
    {
      id: "3",
      title: isArabic ? "كتاب شرح العقيدة" : "Explanation of Creed Book",
      description: isArabic ? "كتاب مفصل في شرح العقيدة الإسلامية" : "Detailed book explaining Islamic creed",
      category: categoryName,
      type: 'pdf',
      fileSize: "3.5 MB",
      pageCount: 120
    }
  ];
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <SkipLinks 
        links={[
          { href: "#main-content", label: isArabic ? "الانتقال إلى المحتوى الرئيسي" : "Skip to main content" },
          { href: "#search", label: isArabic ? "الانتقال إلى البحث" : "Skip to search" }
        ]}
      />
      
      <div id="main-content" className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8" aria-label={isArabic ? "مسار التنقل" : "Breadcrumb"}>
          <ol className={`flex items-center space-x-2 text-sm ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <li>
              <Link 
                href={`/${locale}`}
                className="text-emerald-600 hover:text-emerald-800 transition-colors"
              >
                {messages.common.home}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link 
                href={`/${locale}/library`}
                className="text-emerald-600 hover:text-emerald-800 transition-colors"
              >
                {library.title}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-800 font-medium">{categoryName}</li>
          </ol>
        </nav>

        {/* Page Header */}
        <Motion delay={0.1}>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {categoryName}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {library.description}
            </p>
          </div>
        </Motion>        {/* Search Section */}
        <Motion delay={0.2}>
          <section id="search" className="mb-8">
            <AccessibleSearch
              value=""
              onChange={(value) => console.log('Search:', value)}
              placeholder={library.searchPlaceholder}
              suggestions={[
                library.categoryNames.tawheed,
                library.categoryNames.worship,
                library.categoryNames.ethics
              ]}
              locale={locale}
              className="w-full"
            />
          </section>
        </Motion>

        {/* Items Grid */}
        <Motion delay={0.3}>
          <Suspense fallback={<MagazineGridSkeleton />}>            <AccessibleGrid
              columns={3}
              navigationLabel={isArabic ? `شبكة ${categoryName}` : `${categoryName} grid`}
              locale={locale}
            >
              {categoryItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {item.description}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.type === 'pdf' ? 'bg-red-100 text-red-800' :
                        item.type === 'brochure' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.type === 'pdf' ? 'PDF' : 
                         item.type === 'brochure' ? library.brochures :
                         library.images}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{item.category}</span>
                      {item.fileSize && (
                        <span>{item.fileSize}</span>
                      )}
                      {item.pageCount && (
                        <span>{item.pageCount} {isArabic ? 'صفحة' : 'pages'}</span>
                      )}
                    </div>

                    <div className={`flex gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <Link
                        href={`/${locale}/library/${item.type}/${item.id}`}
                        className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium text-center hover:bg-emerald-700 transition-colors"
                      >
                        {library.viewPDF}
                      </Link>
                      <button className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
                        {library.download}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </AccessibleGrid>
          </Suspense>
        </Motion>

        {/* Pagination */}
        <Motion delay={0.4}>
          <div className="mt-12 flex justify-center">            <MemoizedPagination
              currentPage={1}
              totalPages={1}
              onPageChange={(page) => console.log('Page:', page)}
            />
          </div>
        </Motion>
      </div>
    </main>
  );
}
