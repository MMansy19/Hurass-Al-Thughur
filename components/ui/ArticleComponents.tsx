"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface AnimatedArticleCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function AnimatedArticleCard({
  children,
  delay = 0,
  className = "",
}: AnimatedArticleCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transform transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-95"
      } ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface EnhancedArticleCardProps {
  article: {
    id: number;
    title: string;
    excerpt: string;
    author: string;
    created_at: string;
    lang: string;
  };
  locale: string;
  messages: any;
  delay?: number;
}

export function EnhancedArticleCard({
  article,
  locale,
  messages,
  delay = 0,
}: EnhancedArticleCardProps) {
  return (
    <AnimatedArticleCard delay={delay}>
      <article className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-emerald-200 transform hover:-translate-y-1 md:hover:-translate-y-2 h-full">
        {/* Main Card Content */}
        <div className="p-4 sm:p-6 md:p-8 flex flex-col h-full">
          {/* Article Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg">
                {article.id}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-1">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 mx-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="truncate">{article.author}</span>
                </div>
                <div className="flex items-center text-xs text-gray-400">
                  <svg
                    className="w-3 h-3 mx-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="truncate">
                    {new Date(article.created_at).toLocaleDateString(
                      locale === "ar" ? "ar-SA" : "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end sm:justify-start">
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                  article.lang === "ar"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {article.lang === "ar" ? "العربية" : "English"}
              </span>
            </div>
          </div>

          {/* Article Content */}
          <div className="flex-grow">
            <h3
              className="font-bold text-lg sm:text-xl md:text-2xl text-gray-900 mb-3 sm:mb-4 group-hover:text-emerald-700 transition-colors duration-300 leading-tight"
              dir="auto"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {article.title}
            </h3>
            <p
              className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 line-clamp-3 sm:line-clamp-2"
              dir="auto"
            >
              {article.excerpt}
            </p>
          </div>

          {/* Article Footer */}
          <div className="mt-auto pt-6 border-t border-gray-100">
            <Link
              href={`/${locale}/articles/${article.id}`}
              className="group/btn inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-200"
            >
              <span>{messages.articles.viewArticle}</span>
              <svg
                className="w-5 h-5 mx-2 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={locale === "ar" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Hover Overlay for Full Excerpt */}
        <div className="absolute inset-0 bg-emerald-900 bg-opacity-70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-4 sm:p-6 md:p-8 hidden sm:flex">
          <div className="text-center text-white min-w-full">
            {/* Article Icon */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 backdrop-blur-sm border border-white border-opacity-30">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>

            {/* Article Title */}
            <h4
              className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-white"
              dir="auto"
            >
              {article.title}
            </h4>

            {/* Full Excerpt */}
            <div className="w-full min-w-full bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white border-opacity-20 mb-4 sm:mb-6">
              <p
                className="text-white text-xs sm:text-sm leading-relaxed max-h-24 sm:max-h-32"
                dir="auto"
              >
                {article.excerpt}
              </p>
            </div>

            <Link
              href={`/${locale}/articles/${article.id}`}
              className="w-full min-w-full inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mx-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {messages.articles.viewArticle}
            </Link>
          </div>
        </div>
      </article>
    </AnimatedArticleCard>
  );
}

interface ReadingProgressProps {
  target?: string;
}

export function ReadingProgress({ target = "article" }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const element = document.getElementById(target);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;

      const elementTop = rect.top;
      const elementBottom = rect.bottom;

      // Calculate how much of the element has been scrolled through
      let scrolled = 0;

      if (elementTop <= 0 && elementBottom >= windowHeight) {
        // Element is larger than viewport and currently spans the viewport
        scrolled = Math.abs(elementTop) / (elementHeight - windowHeight);
      } else if (elementTop <= 0 && elementBottom < windowHeight) {
        // Element top is above viewport, bottom is in viewport
        scrolled = 1;
      } else if (elementTop > 0) {
        // Element hasn't entered viewport yet
        scrolled = 0;
      }

      setProgress(Math.min(scrolled * 100, 100));
    };

    const handleScroll = () => {
      requestAnimationFrame(updateProgress);
    };

    window.addEventListener("scroll", handleScroll);
    updateProgress(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [target]);

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 z-50 transition-all duration-300 ease-out"
      style={{ width: `${progress}%` }}
    />
  );
}

interface ArticleMetaProps {
  author: string;
  date: string;
  readingTime?: number;
  language: string;
  locale: string;
}

export function ArticleMeta({
  author,
  date,
  readingTime,
  language,
  locale,
}: ArticleMetaProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === "ar" ? "ar-SA" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-sm">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <span className="text-gray-700 font-medium text-xs sm:text-sm truncate">
          {author}
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <span className="text-gray-600 text-xs sm:text-sm">
          {formatDate(date)}
        </span>
      </div>

      {readingTime && (
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-gray-600 text-xs sm:text-sm whitespace-nowrap">
            {readingTime} {locale === "ar" ? "دقائق قراءة" : "min read"}
          </span>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 12.236 11.618 14z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <span className="text-gray-600 text-xs sm:text-sm">
          {language === "ar" ? "العربية" : "English"}
        </span>
      </div>
    </div>
  );
}

interface ShareButtonsProps {
  title: string;
  url: string;
  locale: string;
}

export function ShareButtons({ title, url, locale }: ShareButtonsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = async (platform: string) => {
    const shareUrl = mounted ? window.location.href : url;
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(shareUrl);

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    };

    if (platform === "native" && mounted && navigator.share) {
      try {
        await navigator.share({
          title,
          url: shareUrl,
        });
        return;
      } catch (err) {
        console.log("Native sharing failed, falling back to URL");
      }
    }

    if (urls[platform as keyof typeof urls]) {
      window.open(urls[platform as keyof typeof urls], "_blank");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <span className="text-gray-600 text-sm font-medium">
        {locale === "ar" ? "شارك المقال:" : "Share Article:"}
      </span>

      <div className="flex items-center justify-center sm:justify-start space-x-2 overflow-x-auto pb-2 sm:pb-0">
        {/* Native Share Button - Always render, but only functional when mounted */}
        <button
          onClick={() => handleShare("native")}
          className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors flex-shrink-0"
          title={locale === "ar" ? "مشاركة" : "Share"}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
            />
          </svg>
        </button>

        {/* WhatsApp */}
        <button
          onClick={() => handleShare("whatsapp")}
          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors flex-shrink-0"
          title="WhatsApp"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" />
          </svg>
        </button>

        {/* Twitter */}
        <button
          onClick={() => handleShare("twitter")}
          className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-50 rounded-full transition-colors flex-shrink-0"
          title="Twitter"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        </button>

        {/* Facebook */}
        <button
          onClick={() => handleShare("facebook")}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors flex-shrink-0"
          title="Facebook"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>

        {/* Telegram */}
        <button
          onClick={() => handleShare("telegram")}
          className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors flex-shrink-0"
          title="Telegram"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
