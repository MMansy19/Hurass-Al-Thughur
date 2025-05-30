import { Metadata } from "next/types";
import Link from "next/link";
import SEO from "@/components/ui/SEO";
import PDFViewerSection from "@/components/pdf/PDFViewerSection";
import { SkipLinks, VisuallyHidden } from "@/components/ui/AccessibilityComponents";

// Generate metadata for the page
export async function generateMetadata({ 
  params
}: { 
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  return SEO({
    title: messages.magazine.title,
    description: messages.magazine.description,
    locale,
    pageName: "magazine",
  });
}

export default async function MagazinePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Import translations
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const { magazine } = messages;
  // Mock data for magazine issues
  const magazineIssues = [
    {
      id: 1,
      title: magazine.issues.issue1.title,
      description: magazine.issues.issue1.description,
      coverImage: "/images/1.jpg", // Placeholder
      pdfUrl: "/pdfs/1.pdf", // Placeholder
      date: magazine.issues.issue1.date,
    },
    {
      id: 2,
      title: magazine.issues.issue2.title,
      description: magazine.issues.issue2.description,
      coverImage: "/images/2.jpg", // Placeholder
      pdfUrl: "/pdfs/2.pdf", // Placeholder
      date: magazine.issues.issue2.date,
    },
    {
      id: 3,
      title: magazine.issues.issue3.title,
      description: magazine.issues.issue3.description,
      coverImage: "/images/3.jpg", // Placeholder
      pdfUrl: "/pdfs/3.pdf", // Placeholder
      date: magazine.issues.issue3.date,
    },
  ];

  // Mock data for magazine categories
  const categories = [
    { id: 1, name: magazine.categoryNames.aqeedah },
    { id: 2, name: magazine.categoryNames.fiqh },
    { id: 3, name: magazine.categoryNames.prophetBiography },
    { id: 4, name: magazine.categoryNames.islamicHistory },
  ];  // Selected issue for demonstration - with null check
  const selectedIssue = magazineIssues[0] || null;

  // Skip links for accessibility
  const skipLinks = [
    { href: "#main-content", label: locale === "ar" ? "انتقل إلى المحتوى الرئيسي" : "Skip to main content" },
    { href: "#latest-issues", label: locale === "ar" ? "انتقل إلى آخر الإصدارات" : "Skip to latest issues" },
    { href: "#pdf-viewer", label: locale === "ar" ? "انتقل إلى عارض PDF" : "Skip to PDF viewer" },
    { href: "#categories", label: locale === "ar" ? "انتقل إلى التصنيفات" : "Skip to categories" },
  ];  return (
    <>
      <SkipLinks links={skipLinks} />
      <main id="main-content" className="space-y-12" role="main">      
        <section 
          className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white py-10 rounded-lg shadow-lg"
          aria-labelledby="page-heading"
        >
          <div className="container mx-auto px-4 text-center">
            <h1 id="page-heading" className="text-3xl md:text-4xl font-bold">
              {magazine.title}
            </h1>
            <p className="text-xl mt-2 max-w-2xl mx-auto">
              {magazine.description}
            </p>
          </div>
        </section>{/* Latest Issues Section */}
        <section 
          id="latest-issues"
          className="py-10"
          aria-labelledby="latest-issues-heading"
        >
          <div className="container mx-auto px-4">
            <div className="mb-8 flex justify-between items-center">
              <h2 id="latest-issues-heading" className="text-2xl font-bold text-emerald-800">
                {magazine.latestIssues}
              </h2>
              <Link 
                href={`/${locale}/magazine/all`}
                className="text-emerald-600 hover:text-emerald-800 transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-md px-2 py-1"
                aria-label={`${magazine.allIssues} - ${locale === "ar" ? "يفتح في صفحة جديدة" : "Opens in new page"}`}
              >
                {magazine.allIssues}
                <svg 
                  className="w-5 h-5 mx-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <VisuallyHidden>
                  {locale === "ar" ? "يفتح في صفحة جديدة" : "Opens in new page"}
                </VisuallyHidden>
              </Link>
            </div>
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              role="list"
              aria-label={magazine.latestIssues}
            >            {magazineIssues.map((issue) => (
              <article 
                key={issue.id} 
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2"
                role="listitem"
                aria-labelledby={`issue-title-${issue.id}`}
                aria-describedby={`issue-desc-${issue.id} issue-date-${issue.id}`}
              >
                <div className="aspect-[3/4] relative bg-gray-50" role="img" aria-label={`${magazine.coverImage || "Cover image"} - ${issue.title}`}>
                  {/* Placeholder for magazine cover - replace with actual images later */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 mb-4">
                      <svg 
                        className="w-full h-full text-emerald-200" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M19 1l-5 5v11l5-4.5V1M1 4v14c0 1.1.9 2 2 2h14c.85 0 1.58-.54 1.87-1.3L7 9.38V4H5v9.38l-3 2.62V5c0-.55.45-1 1-1h15c.55 0 1 .45 1 1v13c0 1.11-.89 2-2 2H6c-2.21 0-4-1.79-4-4" />
                      </svg>
                    </div>
                    <div className="text-xl font-bold text-emerald-800">{issue.title}</div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 id={`issue-title-${issue.id}`} className="font-bold text-xl mb-2 text-emerald-900">
                    {issue.title}
                  </h3>
                  <p id={`issue-date-${issue.id}`} className="text-emerald-700 text-sm mb-3 flex items-center">
                    <svg 
                      className="w-4 h-4 mx-1" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <time dateTime={issue.date}>{issue.date}</time>
                  </p>
                  <p id={`issue-desc-${issue.id}`} className="text-gray-700 mb-5">
                    {issue.description}
                  </p>
                  <button 
                    className="w-full px-4 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors shadow-sm flex items-center justify-center"
                    aria-label={`${magazine.readNow} - ${issue.title}`}
                    type="button"
                  >
                    <svg 
                      className="w-5 h-5 mx-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {magazine.readNow}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
        {/* PDF Viewer Section */}
      <section id="pdf-viewer" aria-labelledby="pdf-viewer-heading">
        <h2 id="pdf-viewer-heading" className="sr-only">
          {locale === "ar" ? "عارض المجلة" : "Magazine Viewer"}
        </h2>        <PDFViewerSection 
          pdfUrl="https://drive.google.com/file/d/1fYPJGRKRD7iZVe0yheliURNuSQQswgJw/view?usp=sharing"
          title={selectedIssue?.title || magazine.title}
          messages={magazine}
        />
      </section>{/* Categories Section */}
      <section 
        id="categories"
        className="py-10 bg-gray-50 rounded-lg"
        aria-labelledby="categories-heading"
      >
        <div className="container mx-auto px-4">
          <h2 id="categories-heading" className="text-2xl font-bold mb-6 text-emerald-800">
            {magazine.categories}
          </h2>
          <nav 
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            role="navigation"
            aria-label={magazine.categories}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/magazine/category/${category.id}`}
                className="bg-white border border-gray-200 p-5 rounded-lg text-center hover:bg-emerald-50 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all shadow-sm hover:shadow-md flex items-center justify-center"
                aria-label={`${magazine.browseCategory || "Browse category"}: ${category.name}`}
              >
                <span className="font-medium text-emerald-900">{category.name}</span>
              </Link>
            ))}
          </nav>        </div>
      </section>
      </main>
    </>
  );
}
