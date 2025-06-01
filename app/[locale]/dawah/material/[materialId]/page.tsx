import { Metadata } from "next/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import SEO from "@/components/ui/SEO";
import { SkipLinks } from "@/components/ui/AccessibilityComponents";
import { Motion, StaggerContainer } from "@/components/ui/AnimationSystem";
import { PageHeaderSkeleton } from "@/components/ui/LoadingStates";

// Material interface
interface DawahMaterial {
  id: string;
  title: string;
  description: string;
  content: {
    introduction: string;
    sections: {
      title: string;
      content: string;
      verses?: { arabic: string; translation: string; reference: string }[];
      bulletPoints?: string[];
    }[];
    conclusion: string;
  };
  type: 'pamphlet' | 'guide' | 'booklet' | 'flyer';
  format: 'pdf' | 'html' | 'both';
  language: string;
  downloadUrl?: string;
  fileSize?: string;
  pageCount?: number;
  author: string;
  publishDate: string;
  tags: string[];
  relatedMaterials: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Get material information
async function getMaterialInfo(materialId: string, locale: string): Promise<DawahMaterial | null> {
  const materials: Record<string, DawahMaterial> = {
    "islam-basics": {
      id: "islam-basics",
      title: locale === 'ar' ? "أساسيات الإسلام - دليل المبتدئين" : "Islam Basics - Beginner's Guide",
      description: locale === 'ar' 
        ? "دليل شامل وبسيط للتعرف على أساسيات الدين الإسلامي للمبتدئين"
        : "A comprehensive and simple guide to learn the basics of Islam for beginners",
      content: {
        introduction: locale === 'ar'
          ? "الإسلام دين الله الذي أنزله على خاتم الأنبياء محمد صلى الله عليه وسلم. هذا الدليل يقدم لك أساسيات الإسلام بطريقة بسيطة ومفهومة."
          : "Islam is the religion of God revealed to the last Prophet Muhammad (peace be upon him). This guide presents the basics of Islam in a simple and understandable way.",
        sections: [
          {
            title: locale === 'ar' ? "ما هو الإسلام؟" : "What is Islam?",
            content: locale === 'ar'
              ? "الإسلام كلمة عربية تعني الاستسلام والانقياد لله تعالى. وهو الدين الذي جاء به جميع الأنبياء والرسل من آدم إلى محمد عليهم الصلاة والسلام."
              : "Islam is an Arabic word meaning submission and surrender to Allah. It is the religion brought by all prophets and messengers from Adam to Muhammad (peace be upon them).",
            verses: [
              {
                arabic: "وَمَا أَرْسَلْنَا مِن قَبْلِكَ مِن رَّسُولٍ إِلَّا نُوحِي إِلَيْهِ أَنَّهُ لَا إِلَٰهَ إِلَّا أَنَا فَاعْبُدُونِ",
                translation: "And We sent not before you any messenger except that We revealed to him that, 'There is no deity except Me, so worship Me.'",
                reference: "Al-Anbiya 21:25"
              }
            ]
          },
          {
            title: locale === 'ar' ? "أركان الإسلام الخمسة" : "The Five Pillars of Islam",
            content: locale === 'ar'
              ? "أركان الإسلام هي الأسس الخمسة التي يقوم عليها الدين الإسلامي:"
              : "The pillars of Islam are the five foundations upon which the Islamic religion is built:",
            bulletPoints: locale === 'ar' ? [
              "الشهادتان: شهادة أن لا إله إلا الله وأن محمداً رسول الله",
              "الصلاة: خمس صلوات في اليوم",
              "الزكاة: إعطاء الزكاة للفقراء والمحتاجين",
              "الصوم: صوم شهر رمضان",
              "الحج: حج البيت الحرام لمن استطاع إليه سبيلاً"
            ] : [
              "Shahada: Declaration that there is no god but Allah and Muhammad is His messenger",
              "Salah: Five daily prayers",
              "Zakat: Giving charity to the poor and needy",
              "Sawm: Fasting during the month of Ramadan",
              "Hajj: Pilgrimage to the Holy House for those who are able"
            ]
          },
          {
            title: locale === 'ar' ? "أركان الإيمان الستة" : "The Six Articles of Faith",
            content: locale === 'ar'
              ? "أركان الإيمان الستة هي الأسس العقدية التي يجب على المسلم الإيمان بها:"
              : "The six articles of faith are the fundamental beliefs that every Muslim must believe in:",
            bulletPoints: locale === 'ar' ? [
              "الإيمان بالله",
              "الإيمان بالملائكة",
              "الإيمان بالكتب السماوية",
              "الإيمان بالرسل والأنبياء",
              "الإيمان باليوم الآخر",
              "الإيمان بالقدر خيره وشره"
            ] : [
              "Belief in Allah",
              "Belief in the Angels",
              "Belief in the Holy Books",
              "Belief in the Prophets and Messengers",
              "Belief in the Day of Judgment",
              "Belief in Divine Predestination"
            ]
          }
        ],
        conclusion: locale === 'ar'
          ? "هذه هي أساسيات الإسلام التي يجب على كل مسلم معرفتها. نسأل الله أن يهدينا جميعاً إلى الحق وأن يثبتنا على دينه."
          : "These are the basics of Islam that every Muslim should know. We ask Allah to guide us all to the truth and keep us steadfast on His religion."
      },
      type: 'guide',
      format: 'both',
      language: locale,
      downloadUrl: `/pdfs/dawah/islam-basics-${locale}.pdf`,
      fileSize: "1.2 MB",
      pageCount: 16,
      author: locale === 'ar' ? "فريق الحراس" : "Hurass Team",
      publishDate: locale === 'ar' ? "ربيع الأول 1446" : "September 2024",
      tags: locale === 'ar' ? ["أساسيات", "مبتدئين", "عقيدة"] : ["basics", "beginners", "faith"],
      relatedMaterials: ["prayer-guide", "quran-intro"],
      difficulty: 'beginner'
    },
    "prayer-guide": {
      id: "prayer-guide",
      title: locale === 'ar' ? "دليل الصلاة للمبتدئين" : "Prayer Guide for Beginners",
      description: locale === 'ar'
        ? "تعلم كيفية أداء الصلاة بالطريقة الصحيحة مع الصور والتوضيحات"
        : "Learn how to perform prayer correctly with illustrations and explanations",
      content: {
        introduction: locale === 'ar'
          ? "الصلاة هي الركن الثاني من أركان الإسلام، وهي صلة بين العبد وربه. هذا الدليل يوضح لك كيفية أداء الصلاة بالطريقة الصحيحة."
          : "Prayer is the second pillar of Islam and a connection between the servant and his Lord. This guide shows you how to perform prayer correctly.",
        sections: [
          {
            title: locale === 'ar' ? "شروط الصلاة" : "Conditions of Prayer",
            content: locale === 'ar'
              ? "هناك شروط يجب توفرها قبل أداء الصلاة:"
              : "There are conditions that must be fulfilled before performing prayer:",
            bulletPoints: locale === 'ar' ? [
              "الطهارة من الحدث الأصغر والأكبر",
              "طهارة الثوب والبدن والمكان",
              "ستر العورة",
              "استقبال القبلة",
              "دخول الوقت"
            ] : [
              "Purification from minor and major impurities",
              "Cleanliness of clothes, body, and place",
              "Covering the private parts",
              "Facing the Qibla",
              "Entry of prayer time"
            ]
          },
          {
            title: locale === 'ar' ? "خطوات الصلاة" : "Steps of Prayer",
            content: locale === 'ar'
              ? "إليك خطوات أداء الصلاة بالتفصيل:"
              : "Here are the detailed steps of performing prayer:",
            bulletPoints: locale === 'ar' ? [
              "النية والتكبير",
              "قراءة الفاتحة وسورة",
              "الركوع والسجود",
              "التشهد والتسليم"
            ] : [
              "Intention and Takbir",
              "Reciting Al-Fatiha and a chapter",
              "Bowing and prostration",
              "Tashahhud and Taslim"
            ]
          }
        ],
        conclusion: locale === 'ar'
          ? "الصلاة نور وراحة للقلب، فاحرص على أدائها في وقتها بخشوع وحضور قلب."
          : "Prayer is light and comfort for the heart, so be keen to perform it on time with humility and presence of heart."
      },
      type: 'guide',
      format: 'both',
      language: locale,
      downloadUrl: `/pdfs/dawah/prayer-guide-${locale}.pdf`,
      fileSize: "2.1 MB",
      pageCount: 24,
      author: locale === 'ar' ? "فريق الحراس" : "Hurass Team",
      publishDate: locale === 'ar' ? "صفر 1446" : "August 2024",
      tags: locale === 'ar' ? ["صلاة", "عبادة", "مبتدئين"] : ["prayer", "worship", "beginners"],
      relatedMaterials: ["islam-basics", "wudu-guide"],
      difficulty: 'beginner'
    },
    "quran-intro": {
      id: "quran-intro",
      title: locale === 'ar' ? "مقدمة في القرآن الكريم" : "Introduction to the Holy Quran",
      description: locale === 'ar'
        ? "تعرف على القرآن الكريم: نزوله، حفظه، وأهميته في حياة المسلم"
        : "Learn about the Holy Quran: its revelation, preservation, and importance in a Muslim's life",
      content: {
        introduction: locale === 'ar'
          ? "القرآن الكريم هو كلام الله المنزل على نبيه محمد صلى الله عليه وسلم، وهو المعجزة الخالدة والدستور الأبدي للمسلمين."
          : "The Holy Quran is the word of Allah revealed to His Prophet Muhammad (peace be upon him), the eternal miracle and permanent constitution for Muslims.",
        sections: [
          {
            title: locale === 'ar' ? "نزول القرآن" : "Revelation of the Quran",
            content: locale === 'ar'
              ? "نزل القرآن الكريم على النبي محمد صلى الله عليه وسلم في مدة 23 سنة، منجماً حسب الأحداث والحاجة."
              : "The Holy Quran was revealed to Prophet Muhammad (peace be upon him) over a period of 23 years, gradually according to events and needs.",
            verses: [
              {
                arabic: "إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ",
                translation: "Indeed, it is We who sent down the Quran and indeed, We will be its guardian.",
                reference: "Al-Hijr 15:9"
              }
            ]
          },
          {
            title: locale === 'ar' ? "معجزة القرآن" : "The Miracle of the Quran",
            content: locale === 'ar'
              ? "القرآن معجزة خالدة من عدة جوانب:"
              : "The Quran is an eternal miracle in several aspects:",
            bulletPoints: locale === 'ar' ? [
              "الإعجاز اللغوي والبياني",
              "الإعجاز العلمي",
              "الإعجاز التشريعي",
              "حفظه من التحريف"
            ] : [
              "Linguistic and rhetorical miracle",
              "Scientific miracle",
              "Legislative miracle",
              "Preservation from distortion"
            ]
          }
        ],
        conclusion: locale === 'ar'
          ? "القرآن الكريم هو دليلنا في الحياة ونور يضيء طريقنا إلى الله تعالى."
          : "The Holy Quran is our guide in life and a light that illuminates our path to Allah."
      },
      type: 'booklet',
      format: 'both',
      language: locale,
      downloadUrl: `/pdfs/dawah/quran-intro-${locale}.pdf`,
      fileSize: "1.8 MB",
      pageCount: 20,
      author: locale === 'ar' ? "فريق الحراس" : "Hurass Team",
      publishDate: locale === 'ar' ? "محرم 1446" : "July 2024",
      tags: locale === 'ar' ? ["قرآن", "معجزة", "هداية"] : ["quran", "miracle", "guidance"],
      relatedMaterials: ["islam-basics", "prophet-biography"],
      difficulty: 'intermediate'
    }
  };

  return materials[materialId] || null;
}

// Generate metadata
export async function generateMetadata({ 
  params
}: { 
  params: Promise<{ locale: string; materialId: string }>;
}): Promise<Metadata> {
  const { locale, materialId } = await params;
  const material = await getMaterialInfo(materialId, locale);
  const messages = (await import(`@/locales/${locale}.json`)).default;
  
  if (!material) {
    return {
      title: messages.pdfViewer?.materialNotFound || "Material Not Found",
      description: messages.pdfViewer?.requestedMaterialNotFound || "The requested dawah material was not found."
    };
  }

  return {
    ...SEO({
      title: `${material.title} - Dawah Materials`,
      description: material.description,
      locale,
      pageName: `dawah-material-${materialId}`,
    }),
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function DawahMaterialPage({
  params,
}: {
  params: Promise<{ locale: string; materialId: string }>;
}) {
  const { locale, materialId } = await params;
  const material = await getMaterialInfo(materialId, locale);
  const isArabic = locale === 'ar';

  if (!material) {
    notFound();
  }

  // Skip links for accessibility
  const skipLinks = [
    { href: "#main-content", label: isArabic ? "انتقل إلى المحتوى الرئيسي" : "Skip to main content" },
    { href: "#material-content", label: isArabic ? "انتقل إلى محتوى المادة" : "Skip to material content" },
    { href: "#download-section", label: isArabic ? "انتقل إلى قسم التحميل" : "Skip to download section" },
    { href: "#related-materials", label: isArabic ? "انتقل إلى المواد ذات الصلة" : "Skip to related materials" },
  ];

  return (
    <>
      <SkipLinks links={skipLinks} />
      
      <main id="main-content" className="space-y-8" role="main">
        {/* Page Header */}
        <Suspense fallback={<PageHeaderSkeleton />}>
          <Motion preset="fadeInUp">
            <section className="bg-gradient-to-r from-blue-700 to-blue-600 text-white py-16 rounded-xl">
              <div className="container mx-auto sm:px-4 px-2">
                <div className="max-w-4xl mx-auto">
                  {/* Breadcrumb */}
                  <nav aria-label={isArabic ? "مسار التنقل" : "Breadcrumb"} className="mb-8">
                    <ol className="flex items-center space-x-2 rtl:space-x-reverse text-blue-100">
                      <li>
                        <Link 
                          href={`/${locale}`}
                          className="hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 rounded px-2 py-1"
                        >
                          {isArabic ? "الرئيسية" : "Home"}
                        </Link>
                      </li>
                      <li aria-hidden="true">/</li>
                      <li>
                        <Link 
                          href={`/${locale}/dawah`}
                          className="hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 rounded px-2 py-1"
                        >
                          {isArabic ? "الدعوة" : "Dawah"}
                        </Link>
                      </li>
                      <li aria-hidden="true">/</li>
                      <li aria-current="page" className="text-white font-medium">
                        {material.title}
                      </li>
                    </ol>
                  </nav>

                  {/* Material Header */}
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        material.difficulty === 'beginner' ? 'bg-green-500' :
                        material.difficulty === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                      } text-white`}>
                        {isArabic ? 
                          (material.difficulty === 'beginner' ? 'مبتدئ' : 
                           material.difficulty === 'intermediate' ? 'متوسط' : 'متقدم') :
                          material.difficulty.charAt(0).toUpperCase() + material.difficulty.slice(1)
                        }
                      </span>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                      {material.title}
                    </h1>
                    
                    <p className="text-xl text-blue-100 mb-6 max-w-3xl mx-auto">
                      {material.description}
                    </p>

                    {/* Material Meta */}
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-100">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                        </svg>
                        {material.publishDate}
                      </span>
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                        </svg>
                        {material.pageCount} {isArabic ? "صفحة" : "pages"}
                      </span>
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                        {material.fileSize}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Motion>
        </Suspense>

        {/* Material Content */}
        <Motion preset="slideInUp" delay={200}>
          <section id="material-content" className="py-8">
            <div className="container mx-auto sm:px-4 px-2">
              <div className="max-w-4xl mx-auto">
                <article className="prose prose-lg max-w-none" dir={isArabic ? 'rtl' : 'ltr'}>
                  {/* Introduction */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {isArabic ? "مقدمة" : "Introduction"}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {material.content.introduction}
                    </p>
                  </div>

                  {/* Content Sections */}
                  <StaggerContainer className="space-y-8">
                    {material.content.sections.map((section, index) => (
                      <Motion 
                        key={index}
                        preset="slideInUp" 
                        delay={index * 100}
                        className="bg-white border border-gray-200 rounded-lg p-6"
                      >
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                          {section.title}
                        </h3>
                        
                        <div className="space-y-4">
                          <p className="text-gray-700 leading-relaxed">
                            {section.content}
                          </p>

                          {/* Bullet Points */}
                          {section.bulletPoints && (
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                              {section.bulletPoints.map((point, pointIndex) => (
                                <li key={pointIndex} className="leading-relaxed">
                                  {point}
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Quranic Verses */}
                          {section.verses && section.verses.map((verse, verseIndex) => (
                            <blockquote 
                              key={verseIndex}
                              className="border-l-4 border-blue-500 bg-blue-50 p-4 my-6"
                              dir={isArabic ? 'rtl' : 'ltr'}
                            >
                              <p className="text-xl font-semibold text-blue-900 mb-2" dir="rtl">
                                {verse.arabic}
                              </p>
                              <p className="text-gray-700 mb-2">
                                {verse.translation}
                              </p>
                              <cite className="text-sm text-blue-600 font-medium">
                                — {verse.reference}
                              </cite>
                            </blockquote>
                          ))}
                        </div>
                      </Motion>
                    ))}
                  </StaggerContainer>

                  {/* Conclusion */}
                  <Motion preset="fadeInUp" delay={400}>
                    <div className="bg-blue-50 rounded-lg p-6 mt-8">
                      <h2 className="text-2xl font-bold text-blue-900 mb-4">
                        {isArabic ? "خاتمة" : "Conclusion"}
                      </h2>
                      <p className="text-blue-800 leading-relaxed">
                        {material.content.conclusion}
                      </p>
                    </div>
                  </Motion>
                </article>
              </div>
            </div>
          </section>
        </Motion>

        {/* Download Section */}
        <Motion preset="slideInUp" delay={300}>
          <section id="download-section" className="py-8">
            <div className="container mx-auto sm:px-4 px-2">
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-xl p-8 text-center">
                  <h3 className="text-2xl font-bold text-emerald-900 mb-4">
                    {isArabic ? "حمل هذه المادة" : "Download This Material"}
                  </h3>
                  <p className="text-emerald-700 mb-6">
                    {isArabic 
                      ? "احصل على نسخة PDF للقراءة دون اتصال أو للطباعة والتوزيع"
                      : "Get a PDF copy for offline reading or printing and distribution"
                    }
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => {
                        if (material.downloadUrl) {
                          window.open(material.downloadUrl, '_blank');
                        }
                      }}
                      className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                      {isArabic ? "تحميل PDF" : "Download PDF"}
                    </button>
                    
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: material.title,
                            text: material.description,
                            url: window.location.href
                          });
                        }
                      }}
                      className="inline-flex items-center px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                      </svg>
                      {isArabic ? "مشاركة" : "Share"}
                    </button>
                  </div>

                  {/* Tags */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-emerald-800 mb-2">
                      {isArabic ? "المواضيع:" : "Topics:"}
                    </h4>
                    <div className="flex flex-wrap justify-center gap-2">
                      {material.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-emerald-200 text-emerald-800 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Motion>

        {/* Related Materials */}
        <Motion preset="fadeInUp" delay={400}>
          <section id="related-materials" className="py-8">
            <div className="container mx-auto sm:px-4 px-2">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {isArabic ? "مواد ذات صلة" : "Related Materials"}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {material.relatedMaterials.map((relatedId, index) => (
                    <Motion 
                      key={relatedId}
                      preset="slideInUp" 
                      delay={index * 100}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      <Link href={`/${locale}/dawah/material/${relatedId}`}>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
                          {relatedId === 'prayer-guide' ? 
                            (isArabic ? "دليل الصلاة للمبتدئين" : "Prayer Guide for Beginners") :
                          relatedId === 'quran-intro' ?
                            (isArabic ? "مقدمة في القرآن الكريم" : "Introduction to the Holy Quran") :
                          relatedId === 'islam-basics' ?
                            (isArabic ? "أساسيات الإسلام - دليل المبتدئين" : "Islam Basics - Beginner's Guide") :
                            relatedId
                          }
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {isArabic ? "اقرأ المزيد →" : "Read more →"}
                        </p>
                      </Link>
                    </Motion>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </Motion>
      </main>
    </>
  );
}
