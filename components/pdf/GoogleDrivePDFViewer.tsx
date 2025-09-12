"use client";

import { useState } from "react";

interface GoogleDrivePDFViewerProps {
  pdfUrl: string;
  title: string;
  messages: any;
  locale: string;
  onError?: () => void;
  className?: string;
}

export default function GoogleDrivePDFViewer({
  pdfUrl,
  title,
  messages,
  locale,
  onError,
  className = "",
}: GoogleDrivePDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const isArabic = locale === "ar";

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    // Force iframe reload by changing src
    const iframe = document.getElementById('google-drive-pdf') as HTMLIFrameElement;
    if (iframe) {
      const currentSrc = iframe.src;
      iframe.src = '';
      setTimeout(() => {
        iframe.src = currentSrc;
      }, 100);
    }
  };

  return (
    <div className={`pdf-viewer-container ${className}`}>
      {/* Header */}
      <div className="bg-emerald-50 p-4 rounded-t-lg border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">
                {isArabic ? "مدعوم بواسطة Google Drive" : "Powered by Google Drive"}
              </p>
            </div>
          </div>
          
          {hasError && (
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {isArabic ? "إعادة المحاولة" : "Retry"}
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-gray-50 p-12 rounded-b-lg flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
          <p className="text-gray-600 mb-2">
            {messages?.loading || (isArabic ? "جارٍ التحميل..." : "Loading...")}
          </p>
          <p className="text-sm text-gray-500 text-center max-w-md">
            {isArabic 
              ? "يرجى الانتظار أثناء تحميل المستند من Google Drive"
              : "Please wait while we load the document from Google Drive"
            }
          </p>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="bg-red-50 p-12 rounded-b-lg flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            {messages?.error || (isArabic ? "خطأ في التحميل" : "Loading Error")}
          </h3>
          <p className="text-red-600 text-center max-w-md mb-4">
            {isArabic 
              ? "لا يمكن تحميل هذا المستند. قد يكون الملف غير متاح أو محمي."
              : "Unable to load this document. The file may be unavailable or protected."
            }
          </p>
          <div className="flex space-x-3">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {isArabic ? "إعادة المحاولة" : "Try Again"}
            </button>
            <a
              href={pdfUrl.replace('/preview', '/view')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {isArabic ? "فتح في Google Drive" : "Open in Google Drive"}
            </a>
          </div>
        </div>
      )}

      {/* PDF Iframe */}
      {!hasError && (
        <div className="relative bg-white rounded-b-lg overflow-hidden" style={{ minHeight: '600px' }}>
          <iframe
            id="google-drive-pdf"
            src={pdfUrl}
            className="w-full h-full min-h-[600px] border-0"
            onLoad={handleLoad}
            onError={handleError}
            title={title}
            allowFullScreen
            style={{
              opacity: isLoading ? 0 : 1,
              transition: 'opacity 0.3s ease-in-out'
            }}
          />
          
          {/* Overlay instructions */}
          {!isLoading && (
            <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg text-sm">
              <p className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                </svg>
                <span>
                  {isArabic 
                    ? "استخدم عناصر التحكم في Google Drive للتنقل"
                    : "Use Google Drive controls to navigate"
                  }
                </span>
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Footer with additional options */}
      <div className="bg-gray-50 p-3 rounded-b-lg border-t flex justify-between items-center text-sm">
        <div className="text-gray-600">
          {isArabic ? "عرض المستند" : "Document View"}
        </div>
        <div className="flex space-x-3">
          <a
            href={pdfUrl.replace('/preview', '/view')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {isArabic ? "فتح في نافذة جديدة" : "Open in New Tab"}
          </a>
          <a
            href={pdfUrl.replace('/preview', '/view').replace('/view', '/edit')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {isArabic ? "تحميل" : "Download"}
          </a>
        </div>
      </div>
    </div>
  );
}