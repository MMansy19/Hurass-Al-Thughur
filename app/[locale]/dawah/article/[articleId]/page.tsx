import { Metadata } from "next/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import SEO from "@/components/ui/SEO";
import { SkipLinks } from "@/components/ui/AccessibilityComponents";
import { Motion } from "@/components/ui/AnimationSystem";

// Generate metadata for the page
export async function generateMetadata({ 
  params
}: { 
  params: Promise<{ locale: string; articleId: string }>;
}): Promise<Metadata> {
  const { locale, articleId } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  
  const articleInfo = getArticleInfo(articleId, messages.dawah, locale);
  if (!articleInfo) return notFound();
  
  return {
    ...SEO({
      title: `${articleInfo.title} - ${messages.dawah.title}`,
      description: articleInfo.excerpt,
      locale,
      pageName: `dawah-article-${articleId}`,
    }),
    robots: {
      index: true,
      follow: true,
    },
  };
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: number;
  tags: string[];
}

function getArticleInfo(articleId: string, dawah: Record<string, any>, locale: string): Article | null {
  const isArabic = locale === 'ar';
  
  const articles: Record<string, Article> = {
    "1": {
      id: "1",
      title: dawah.articles.whatIsIslam.title,
      excerpt: dawah.articles.whatIsIslam.excerpt,
      content: isArabic 
        ? `الإسلام هو دين التوحيد الذي جاء به النبي محمد صلى الله عليه وسلم. إنه دين السلام والاستسلام لله تعالى وحده.

## ما معنى كلمة الإسلام؟

كلمة "الإسلام" مشتقة من الجذر العربي "س-ل-م" الذي يدل على السلامة والسلام والاستسلام. فالمسلم هو من استسلم لله تعالى وأطاعه في جميع أمور حياته.

## أركان الإسلام الخمسة

1. **الشهادتان**: شهادة أن لا إله إلا الله وأن محمداً رسول الله
2. **الصلاة**: إقامة الصلوات الخمس في أوقاتها
3. **الزكاة**: إخراج الزكاة المفروضة للفقراء والمحتاجين
4. **الصوم**: صوم شهر رمضان المبارك
5. **الحج**: حج البيت الحرام لمن استطاع إليه سبيلاً

## أركان الإيمان الستة

1. الإيمان بالله تعالى
2. الإيمان بالملائكة
3. الإيمان بالكتب السماوية
4. الإيمان بالرسل والأنبياء
5. الإيمان باليوم الآخر
6. الإيمان بالقدر خيره وشره

## خصائص الإسلام

- **الشمولية**: ينظم جميع جوانب الحياة
- **التوازن**: يوازن بين الروح والجسد، الدنيا والآخرة
- **العدالة**: يقوم على العدل والمساواة بين الناس
- **السماحة**: دين اليسر والرحمة
- **الوسطية**: أمة وسط بين الأمم

## الإسلام دين الفطرة

الإسلام يتوافق مع الفطرة السليمة التي فطر الله الناس عليها. فهو دين بسيط وواضح، لا تعقيد فيه ولا غموض.`
        : `Islam is the religion of monotheism brought by Prophet Muhammad (peace be upon him). It is the religion of peace and submission to Allah alone.

## What does the word "Islam" mean?

The word "Islam" is derived from the Arabic root "S-L-M" which indicates safety, peace, and submission. A Muslim is one who submits to Allah and obeys Him in all aspects of life.

## The Five Pillars of Islam

1. **The Testimonies of Faith**: Testifying that there is no god but Allah and that Muhammad is His messenger
2. **Prayer**: Establishing the five daily prayers at their appointed times
3. **Zakat**: Giving the obligatory charity to the poor and needy
4. **Fasting**: Fasting during the blessed month of Ramadan
5. **Hajj**: Pilgrimage to the Sacred House for those who are able

## The Six Pillars of Faith

1. Faith in Allah
2. Faith in the Angels
3. Faith in the Divine Books
4. Faith in the Messengers and Prophets
5. Faith in the Last Day
6. Faith in Divine Decree, both good and bad

## Characteristics of Islam

- **Comprehensiveness**: Regulates all aspects of life
- **Balance**: Balances spirit and body, this world and the next
- **Justice**: Based on justice and equality among people
- **Tolerance**: A religion of ease and mercy
- **Moderation**: A moderate nation among nations

## Islam: The Religion of Human Nature

Islam aligns with the pure nature that Allah has created in people. It is a simple and clear religion, with no complexity or ambiguity.`,
      image: "/images/what-is-islam.jpg",
      author: isArabic ? "فريق حراس الثغور" : "Hurass Team",
      date: isArabic ? "١٥ ربيع الأول ١٤٤٥" : "October 15, 2023",
      readTime: 8,
      tags: isArabic 
        ? ["الإسلام", "التوحيد", "العقيدة", "الأركان"] 
        : ["Islam", "Monotheism", "Faith", "Pillars"]
    },
    "2": {
      id: "2",
      title: dawah.articles.whoIsMuhammad.title,
      excerpt: dawah.articles.whoIsMuhammad.excerpt,
      content: isArabic
        ? `محمد بن عبد الله صلى الله عليه وسلم هو خاتم الأنبياء والمرسلين، وهو الرسول الذي أرسله الله تعالى للناس كافة.

## نسبه الشريف

هو محمد بن عبد الله بن عبد المطلب بن هاشم بن عبد مناف، من قبيلة قريش العربية في مكة المكرمة.

## ولادته ونشأته

- وُلد في مكة المكرمة في عام الفيل (٥٧٠ ميلادية تقريباً)
- توفي والده قبل ولادته، وتوفيت والدته آمنة بنت وهب وهو في السادسة من عمره
- رباه جده عبد المطلب، ثم عمه أبو طالب
- عُرف بالصادق الأمين قبل البعثة

## بعثته ورسالته

- بُعث نبياً في سن الأربعين
- نزل عليه الوحي في غار حراء
- دعا الناس إلى عبادة الله وحده لا شريك له
- واجه الصعوبات والاضطهاد في مكة

## الهجرة إلى المدينة

- هاجر إلى المدينة المنورة مع أصحابه
- أسس المجتمع الإسلامي الأول
- وضع دستور المدينة الذي ينظم العلاقات بين المسلمين وغيرهم

## أخلاقه وصفاته

- الصدق والأمانة
- الرحمة والعدل
- التواضع والكرم
- الشجاعة والحكمة
- الرفق بالضعفاء والمحتاجين

## وفاته

توفي النبي صلى الله عليه وسلم في المدينة المنورة في السنة الحادية عشرة من الهجرة، وقد بلّغ الرسالة وأدّى الأمانة ونصح الأمة.`
        : `Muhammad ibn Abdullah (peace be upon him) is the final Prophet and Messenger, sent by Allah to all mankind.

## His Noble Lineage

He is Muhammad son of Abdullah, son of Abdul Muttalib, son of Hashim, son of Abd Manaf, from the Arab tribe of Quraysh in Makkah.

## His Birth and Upbringing

- Born in Makkah in the Year of the Elephant (approximately 570 CE)
- His father died before his birth, and his mother Aminah bint Wahb died when he was six years old
- Raised by his grandfather Abdul Muttalib, then by his uncle Abu Talib
- Known as As-Sadiq Al-Amin (The Truthful and Trustworthy) before his prophethood

## His Mission and Message

- Called to prophethood at age forty
- Received revelation in the cave of Hira
- Called people to worship Allah alone with no partners
- Faced difficulties and persecution in Makkah

## Migration to Madinah

- Migrated to Madinah with his companions
- Established the first Islamic society
- Created the Constitution of Madinah regulating relations between Muslims and others

## His Character and Qualities

- Truthfulness and trustworthiness
- Mercy and justice
- Humility and generosity
- Courage and wisdom
- Kindness to the weak and needy

## His Death

The Prophet (peace be upon him) died in Madinah in the eleventh year of Hijra, having conveyed the message, fulfilled the trust, and advised the nation.`,
      image: "/images/prophet-muhammad.jpg",
      author: isArabic ? "فريق حراس الثغور" : "Hurass Team",
      date: isArabic ? "٢٢ ربيع الأول ١٤٤٥" : "October 22, 2023",
      readTime: 10,
      tags: isArabic 
        ? ["محمد", "النبي", "السيرة", "الرسول"] 
        : ["Muhammad", "Prophet", "Biography", "Messenger"]
    },
    "3": {
      id: "3",
      title: dawah.articles.holyQuran.title,
      excerpt: dawah.articles.holyQuran.excerpt,
      content: isArabic
        ? `القرآن الكريم هو كتاب الله المنزل على نبيه محمد صلى الله عليه وسلم، وهو المصدر الأول للتشريع في الإسلام.

## تعريف القرآن الكريم

القرآن هو كلام الله تعالى المنزل على رسوله محمد صلى الله عليه وسلم باللغة العربية، المتعبد بتلاوته، المتحدى بإعجازه، المنقول إلينا بالتواتر.

## خصائص القرآن الكريم

### الحفظ الإلهي
﴿إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ﴾ [الحجر: ٩]

### الإعجاز
- الإعجاز اللغوي والبلاغي
- الإعجاز العلمي
- الإعجاز التشريعي
- الإعجاز الغيبي

### الشمولية
يشمل جميع جوانب الحياة: العقيدة، العبادة، المعاملات، الأخلاق

## تنزيل القرآن

- نزل على مدى ٢٣ سنة
- نزل منجماً حسب الأحداث والحاجات
- أول ما نزل: ﴿اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ﴾
- آخر ما نزل: آية الدين أو آية الكمال

## فضائل تلاوة القرآن

- كل حرف بحسنة والحسنة بعشر أمثالها
- شفاعة القرآن لأصحابه يوم القيامة
- الطمأنينة والسكينة عند التلاوة
- النور والهداية في الحياة

## آداب تلاوة القرآن

1. الوضوء والطهارة
2. استقبال القبلة
3. الاستعاذة والبسملة
4. التدبر والتأمل
5. التجويد والترتيل
6. الخشوع والحضور

## علوم القرآن

- التفسير والتأويل
- أسباب النزول
- الناسخ والمنسوخ
- المكي والمدني
- القراءات المتواترة`
        : `The Holy Quran is the Book of Allah revealed to His Prophet Muhammad (peace be upon him), and it is the primary source of legislation in Islam.

## Definition of the Holy Quran

The Quran is the speech of Allah revealed to His Messenger Muhammad (peace be upon him) in the Arabic language, worshipped through its recitation, challenging in its miraculousness, and transmitted to us through continuous chains.

## Characteristics of the Holy Quran

### Divine Preservation
"Indeed, it is We who sent down the Quran and indeed, We will be its guardian." [Al-Hijr: 9]

### Miraculousness
- Linguistic and rhetorical miracles
- Scientific miracles
- Legislative miracles
- Unseen (prophetic) miracles

### Comprehensiveness
Covers all aspects of life: faith, worship, transactions, ethics

## Revelation of the Quran

- Revealed over 23 years
- Revealed gradually according to events and needs
- First revelation: "Read in the name of your Lord who created"
- Last revelation: The verse of debt or the verse of completion

## Virtues of Quran Recitation

- Every letter earns a good deed, and a good deed is multiplied by ten
- The Quran intercedes for its companions on the Day of Judgment
- Tranquility and peace during recitation
- Light and guidance in life

## Etiquette of Quran Recitation

1. Ablution and purity
2. Facing the Qiblah
3. Seeking refuge and saying Bismillah
4. Reflection and contemplation
5. Proper recitation with Tajweed
6. Humility and presence of heart

## Quranic Sciences

- Interpretation and exegesis
- Reasons for revelation
- Abrogating and abrogated verses
- Meccan and Medinan chapters
- Authentic recitations`,
      image: "/images/quran.jpg",
      author: isArabic ? "فريق حراس الثغور" : "Hurass Team",
      date: isArabic ? "٥ ربيع الآخر ١٤٤٥" : "November 5, 2023",
      readTime: 12,
      tags: isArabic 
        ? ["القرآن", "الكتاب المقدس", "التلاوة", "الإعجاز"] 
        : ["Quran", "Holy Book", "Recitation", "Miracles"]
    }
  };

  return articles[articleId] || null;
}

export default async function DawahArticlePage({
  params,
}: {
  params: Promise<{ locale: string; articleId: string }>;
}) {
  const { locale, articleId } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const { dawah } = messages;
  const isArabic = locale === 'ar';

  // Get article information
  const article = getArticleInfo(articleId, dawah, locale);
  if (!article) {
    notFound();
  }

  // Related articles
  const relatedArticles = ["1", "2", "3"]
    .filter(id => id !== articleId)
    .slice(0, 2)
    .map(id => getArticleInfo(id, dawah, locale))
    .filter(Boolean);

  // Skip links for accessibility
  const skipLinks = [
    { href: "#main-content", label: isArabic ? "انتقل إلى المحتوى الرئيسي" : "Skip to main content" },
    { href: "#article-content", label: isArabic ? "انتقل إلى المقال" : "Skip to article" },
    { href: "#related-articles", label: isArabic ? "انتقل إلى المقالات ذات الصلة" : "Skip to related articles" },
  ];

  return (
    <>
      <SkipLinks links={skipLinks} />
      
      <main id="main-content" className="space-y-8" role="main">
        {/* Article Header */}
        <Motion preset="fadeInUp">
          <article className="bg-white">
            <header className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-16 rounded-xl">
              <div className="container mx-auto sm:px-4 px-2">
                <div className="max-w-4xl mx-auto">
                  {/* Breadcrumb */}
                  <nav aria-label={isArabic ? "مسار التنقل" : "Breadcrumb"} className="mb-8">
                    <ol className="flex items-center space-x-2 rtl:space-x-reverse text-emerald-100">
                      <li>
                        <Link 
                          href={`/${locale}`}
                          className="hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600 rounded px-2 py-1"
                        >
                          {isArabic ? "الرئيسية" : "Home"}
                        </Link>
                      </li>
                      <li aria-hidden="true">/</li>
                      <li>
                        <Link 
                          href={`/${locale}/dawah`}
                          className="hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600 rounded px-2 py-1"
                        >
                          {dawah.title}
                        </Link>
                      </li>
                      <li aria-hidden="true">/</li>
                      <li aria-current="page" className="text-white font-medium">
                        {article.title}
                      </li>
                    </ol>
                  </nav>

                  {/* Article Meta */}
                  <div className="mb-6">
                    <div className="flex flex-wrap items-center gap-4 text-emerald-100 text-sm">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        {article.author}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {article.date}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {isArabic ? `${article.readTime} دقائق قراءة` : `${article.readTime} min read`}
                      </span>
                    </div>
                  </div>

                  {/* Title and Excerpt */}
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    {article.title}
                  </h1>
                  <p className="text-xl text-emerald-100 leading-relaxed">
                    {article.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="mt-8 flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-emerald-600 bg-opacity-50 text-emerald-100 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </header>

            {/* Article Content */}
            <Motion preset="slideInUp" delay={200}>
              <section id="article-content" className="py-12">
                <div className="container mx-auto sm:px-4 px-2">
                  <div className="max-w-4xl mx-auto">
                    <div className="prose prose-lg max-w-none prose-emerald prose-headings:text-emerald-800 prose-a:text-emerald-600 prose-strong:text-emerald-800">
                      {article.content.split('\n').map((paragraph, index) => {
                        if (paragraph.startsWith('## ')) {
                          return (
                            <h2 key={index} className="text-2xl font-bold text-emerald-800 mt-8 mb-4">
                              {paragraph.replace('## ', '')}
                            </h2>
                          );
                        }
                        if (paragraph.startsWith('### ')) {
                          return (
                            <h3 key={index} className="text-xl font-semibold text-emerald-700 mt-6 mb-3">
                              {paragraph.replace('### ', '')}
                            </h3>
                          );
                        }
                        if (paragraph.startsWith('- ')) {
                          return (
                            <li key={index} className="ml-6 mb-2">
                              {paragraph.replace('- ', '')}
                            </li>
                          );
                        }
                        if (paragraph.match(/^\d+\./)) {
                          return (
                            <li key={index} className="ml-6 mb-2">
                              {paragraph.replace(/^\d+\.\s*/, '')}
                            </li>
                          );
                        }
                        if (paragraph.includes('﴿') && paragraph.includes('﴾')) {
                          return (
                            <blockquote key={index} className="border-l-4 border-emerald-500 pl-6 my-6 text-emerald-800 font-semibold text-center bg-emerald-50 py-4 rounded-r-lg">
                              {paragraph}
                            </blockquote>
                          );
                        }
                        if (paragraph.trim() === '') {
                          return <br key={index} />;
                        }
                        return (
                          <p key={index} className="mb-4 leading-relaxed text-gray-700">
                            {paragraph}
                          </p>
                        );
                      })}
                    </div>

                    {/* Share Buttons */}
                    <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">
                        {isArabic ? "شارك هذا المقال" : "Share this article"}
                      </h3>
                      <div className="flex gap-4">
                        <button className="flex items-center sm:px-4 px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" />
                          </svg>
                          Facebook
                        </button>
                        <button className="flex items-center sm:px-4 px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M.057 9.5a9.443 9.443 0 1 1 18.886 0A9.443 9.443 0 0 1 .057 9.5zM14.9 5.1a7.2 7.2 0 1 0-9.8 0l4.9 4.9z"/>
                          </svg>
                          WhatsApp
                        </button>
                        <button className="flex items-center sm:px-4 px-2 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                          {isArabic ? "نسخ الرابط" : "Copy Link"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </Motion>
          </article>
        </Motion>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <Motion preset="slideInUp" delay={300}>
            <section id="related-articles" className="py-12 bg-gray-50 rounded-xl">
              <div className="container mx-auto sm:px-4 px-2">
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                  {isArabic ? "مقالات ذات صلة" : "Related Articles"}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle!.id}
                      href={`/${locale}/dawah/article/${relatedArticle!.id}`}
                      className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="aspect-video bg-emerald-100 flex items-center justify-center">
                        <div className="text-emerald-600 text-lg font-semibold text-center p-4">
                          {relatedArticle!.title}
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">
                          {relatedArticle!.title}
                        </h4>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {relatedArticle!.excerpt}
                        </p>
                        <div className="mt-4 flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {isArabic ? `${relatedArticle!.readTime} دقائق` : `${relatedArticle!.readTime} min`}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </Motion>
        )}

        {/* Call to Action */}
        <Motion preset="slideInUp" delay={400}>
          <section className="py-12">
            <div className="container mx-auto sm:px-4 px-2">
              <div className="bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-xl p-8 text-center">
                <h3 className="text-2xl font-bold text-emerald-900 mb-4">
                  {isArabic ? "تريد معرفة المزيد؟" : "Want to learn more?"}
                </h3>
                <p className="text-emerald-700 mb-6 max-w-2xl mx-auto">
                  {isArabic 
                    ? "استكشف المزيد من المقالات والمواد الإسلامية في مكتبتنا" 
                    : "Explore more Islamic articles and materials in our library"
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href={`/${locale}/dawah`}
                    className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    {isArabic ? "المزيد من المقالات" : "More Articles"}
                  </Link>
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex items-center px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    {isArabic ? "تواصل معنا" : "Contact Us"}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </Motion>
      </main>
    </>
  );
}
