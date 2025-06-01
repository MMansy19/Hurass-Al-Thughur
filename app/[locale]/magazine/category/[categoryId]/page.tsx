import { Metadata } from "next/types";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import SEO from "@/components/ui/SEO";
import { SkipLinks } from "@/components/ui/AccessibilityComponents";
import { AccessibleGrid } from "@/components/ui/AccessibilityEnhancements";
import { Motion, StaggerContainer } from "@/components/ui/AnimationSystem";
import { MagazineGridSkeleton } from "@/components/ui/LoadingStates";
import { MemoizedPagination } from "@/components/ui/MemoizedComponents";
import MagazineCardWrapper from "@/components/ui/MagazineCardWrapper";

// Generate metadata for the page
export async function generateMetadata({ 
  params
}: { 
  params: Promise<{ locale: string; categoryId: string }>;
}): Promise<Metadata> {
  const { locale, categoryId } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  
  // Get category info
  const categoryInfo = getCategoryInfo(categoryId, messages.magazine, locale);
  if (!categoryInfo) return notFound();
  
  return {
    ...SEO({
      title: `${categoryInfo.name} - ${messages.magazine.title}`,
      description: `${messages.magazine.description} - ${categoryInfo.description}`,
      locale,
      pageName: `magazine-category-${categoryId}`,
    }),
    robots: {
      index: true,
      follow: true,
    },
  };
}

interface MagazineIssue {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  fileSize?: string;
  pageCount?: number;
}

interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
}

function getCategoryInfo(categoryId: string, magazine: any, locale: string): CategoryInfo | null {
  const messages = require(`@/locales/${locale}.json`);
  
  const categories: Record<string, CategoryInfo> = {
    "1": {
      id: "1",
      name: magazine.categoryNames.aqeedah,
      description: messages.hardcoded.articlesAboutIslamic,
      icon: "🕌",
    },
    "2": {
      id: "2", 
      name: magazine.categoryNames.fiqh,
      description: messages.hardcoded.islamicJurisprudenceRulings,
      icon: "⚖️",
    },
    "3": {
      id: "3",
      name: magazine.categoryNames.prophetBiography,
      description: messages.hardcoded.biographyOfProphet,
      icon: "📖",
    },
    "4": {
      id: "4",
      name: magazine.categoryNames.islamicHistory,
      description: messages.hardcoded.historyOfIslamic,
      icon: "🏛️",
    }
  };

  return categories[categoryId] || null;
}

function getIssuesByCategory(categoryId: string, magazine: any, locale: string): MagazineIssue[] {
  const messages = require(`@/locales/${locale}.json`);
  
  // Mock data filtered by category
  const allIssues: Record<string, MagazineIssue[]> = {
    "1": [ // Aqeedah
      {
        id: "1",
        title: magazine.issues.issue1.title,
        description: magazine.issues.issue1.description,
        date: magazine.issues.issue1.date,
        category: magazine.categoryNames.aqeedah,
        fileSize: "2.5 MB",
        pageCount: 32
      },
      {
        id: "4",
        title: messages.hardcoded.ethicsInIslam,
        description: messages.hardcoded.ethicsInIslamDesc,
        date: messages.hardcoded.islamicMonthsToGregorian.rabiAlAwwal1445,
        category: magazine.categoryNames.aqeedah,
        fileSize: "2.2 MB",
        pageCount: 28
      },
      {
        id: "7",
        title: messages.hardcoded.monotheismPolytheism,
        description: messages.hardcoded.monotheismPolytheismDesc,
        date: messages.hardcoded.hijriMonths.dhuAlHijjah1444,
        category: magazine.categoryNames.aqeedah,
        fileSize: "2.8 MB",
        pageCount: 35
      }
    ],
    "2": [ // Fiqh
      {
        id: "2", 
        title: magazine.issues.issue2.title,
        description: magazine.issues.issue2.description,
        date: magazine.issues.issue2.date,
        category: magazine.categoryNames.fiqh,
        fileSize: "3.1 MB",
        pageCount: 40
      },
      {
        id: "5",
        title: messages.hardcoded.zakatRulings,
        description: messages.hardcoded.zakatRulingsDesc,
        date: messages.hardcoded.islamicMonthsToGregorian.safar1445,
        category: magazine.categoryNames.fiqh,
        fileSize: "1.9 MB",
        pageCount: 24
      },
      {
        id: "8",
        title: messages.hardcoded.fastingRulings,
        description: messages.hardcoded.fastingRulingsDesc,
        date: messages.hardcoded.hijriMonths.shaban1444,
        category: magazine.categoryNames.fiqh,
        fileSize: "2.1 MB",
        pageCount: 30
      }
    ],
    "3": [ // Prophet Biography
      {
        id: "3",
        title: magazine.issues.issue3.title,
        description: magazine.issues.issue3.description,
        date: magazine.issues.issue3.date,
        category: magazine.categoryNames.prophetBiography,
        fileSize: "2.8 MB",
        pageCount: 36
      },
      {
        id: "6",
        title: messages.hardcoded.prayerInIslam,
        description: messages.hardcoded.prayerInIslamDesc,
        date: messages.hardcoded.islamicMonthsToGregorian.muharram1445,
        category: magazine.categoryNames.prophetBiography,
        fileSize: "2.7 MB",
        pageCount: 34
      }
    ],
    "4": [ // Islamic History
      {
        id: "9",
        title: messages.hardcoded.rightlyGuidedCaliphate,
        description: messages.hardcoded.rightlyGuidedCaliphateDesc,
        date: messages.hardcoded.hijriMonths.jumadaAlAkhirah1444,
        category: magazine.categoryNames.islamicHistory,
        fileSize: "3.5 MB",
        pageCount: 45
      }
    ]
  };

  return allIssues[categoryId] || [];
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; categoryId: string }>;
}) {
  const { locale, categoryId } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const { magazine } = messages;
  const isArabic = locale === 'ar';

  // Get category information
  const categoryInfo = getCategoryInfo(categoryId, magazine, locale);
  if (!categoryInfo) {
    notFound();
  }

  // Get issues for this category
  const categoryIssues = getIssuesByCategory(categoryId, magazine, locale);
  // Skip links for accessibility
  const skipLinks = [
    { href: "#main-content", label: messages.hardcoded.skipToMainContent },
    { href: "#issues-grid", label: messages.hardcoded.skipToIssuesGrid },
  ];

  return (
    <>
      <SkipLinks links={skipLinks} />
      <main id="main-content" className="space-y-8" role="main">
        {/* Category Header */}
        <Motion preset="fadeInUp">
          <section className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-16 rounded-xl">
            <div className="container mx-auto sm:px-4 px-2">
              <div className="max-w-4xl mx-auto text-center">
                {/* Category Icon */}
                <div className="text-6xl mb-6" role="img" aria-label={categoryInfo.name}>
                  {categoryInfo.icon}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {categoryInfo.name}
                </h1>
                
                <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
                  {categoryInfo.description}
                </p>
                
                {/* Stats */}                <div className="flex justify-center items-center gap-8 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{categoryIssues.length}</div>
                    <div className="text-emerald-200">{messages.hardcoded.issues}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {categoryIssues.reduce((total, issue) => total + (issue.pageCount || 0), 0)}
                    </div>
                    <div className="text-emerald-200">{messages.hardcoded.pages}</div>
                  </div>
                </div>
                
                {/* Breadcrumb */}                <nav aria-label={messages.hardcoded.breadcrumb} className="mt-8 flex justify-center">
                  <ol className="flex items-center space-x-2 rtl:space-x-reverse text-emerald-100">
                    <li>
                      <Link 
                        href={`/${locale}`}
                        className="hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600 rounded px-2 py-1"
                      >
                        {messages.hardcoded.home}
                      </Link>
                    </li>
                    <li aria-hidden="true">/</li>
                    <li>
                      <Link 
                        href={`/${locale}/magazine`}
                        className="hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600 rounded px-2 py-1"
                      >
                        {magazine.title}
                      </Link>
                    </li>
                    <li aria-hidden="true">/</li>
                    <li aria-current="page" className="text-white font-medium">
                      {categoryInfo.name}
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </section>
        </Motion>

        {/* Issues Grid */}
        {categoryIssues.length > 0 ? (
          <Motion preset="fadeInUp" delay={200}>
            <section id="issues-grid" className="py-8">
              <div className="container mx-auto sm:px-4 px-2">                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {isArabic ? `${messages.hardcoded.issuesOf} ${categoryInfo.name}` : `${categoryInfo.name} ${messages.hardcoded.issues}`}
                  </h2>
                  <p className="text-gray-600">
                    {isArabic 
                      ? `${categoryIssues.length} ${messages.hardcoded.issueInThisCategory}` 
                      : `${categoryIssues.length} ${messages.hardcoded.issuesInThisCategory}`
                    }
                  </p>
                </div>

                <Suspense fallback={<MagazineGridSkeleton count={categoryIssues.length} columns={3} />}>
                  <StaggerContainer staggerDelay={100}>
                    <AccessibleGrid
                      columns={3}
                      gap={24}
                      navigationLabel={`${categoryInfo.name} ${messages.hardcoded.issues}`}
                      locale={locale}
                    >                      {categoryIssues.map((issue, index) => (
                        <Motion key={issue.id} preset="slideInUp" delay={index * 100}>
                          <MagazineCardWrapper
                            issue={issue}
                            locale={locale}
                          />
                        </Motion>
                      ))}
                    </AccessibleGrid>
                  </StaggerContainer>
                </Suspense>

                {/* Pagination - if needed for large categories */}
                {categoryIssues.length > 9 && (
                  <div className="mt-12 flex justify-center">
                    <MemoizedPagination
                      currentPage={1}
                      totalPages={Math.ceil(categoryIssues.length / 9)}
                      onPageChange={(page) => console.log('Navigate to page:', page)}
                      showFirstLast={true}
                      showPrevNext={true}
                      maxVisiblePages={5}
                    />
                  </div>
                )}
              </div>
            </section>
          </Motion>
        ) : (
          // Empty State
          <Motion preset="fadeInUp" delay={200}>
            <section className="py-16">
              <div className="container mx-auto sm:px-4 px-2 text-center">
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-6">📚</div>                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {messages.hardcoded.noIssuesYet}
                  </h3>
                  <p className="text-gray-600 mb-8">
                    {messages.hardcoded.noIssuesYetDescription}
                  </p>
                  <Link
                    href={`/${locale}/magazine`}
                    className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    {messages.hardcoded.browseAllIssues}
                  </Link>
                </div>
              </div>
            </section>
          </Motion>
        )}

        {/* Related Categories */}
        <Motion preset="slideInUp" delay={300}>
          <section className="py-12 bg-gray-50 rounded-xl">
            <div className="container mx-auto sm:px-4 px-2">              <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                {messages.hardcoded.otherCategories}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {["1", "2", "3", "4"].filter(id => id !== categoryId).slice(0, 3).map((id) => {
                  const relatedCategory = getCategoryInfo(id, magazine, locale);
                  if (!relatedCategory) return null;
                  
                  return (
                    <Link
                      key={id}
                      href={`/${locale}/magazine/category/${id}`}
                      className="group block bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                        {relatedCategory.icon}
                      </div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {relatedCategory.name}
                      </h4>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        </Motion>
      </main>
    </>
  );
}
