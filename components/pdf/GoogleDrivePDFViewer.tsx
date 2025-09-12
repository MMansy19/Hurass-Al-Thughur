"use client";

import { useState, useEffect } from "react";

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isArabic = locale === "ar";

  // Extract Google Drive file ID from URL
  const fileId = pdfUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1];
  
  // Generate different Google Drive URLs
  const viewUrl = `https://drive.google.com/file/d/${fileId}/view`;
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const embedUrl = `https://drive.google.com/file/d/${fileId}/preview?usp=embedding`;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+D for download
      if (event.ctrlKey && event.key === 'd') {
        event.preventDefault();
        handleDownload();
      }
      // F11 for fullscreen
      if (event.key === 'F11') {
        event.preventDefault();
        toggleFullscreen();
      }
      // Escape to exit fullscreen
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen]);

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

  const toggleFullscreen = () => {
    const container = document.getElementById('pdf-container');
    if (!document.fullscreenElement && container) {
      container.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  const handleDownload = () => {
    window.open(downloadUrl, '_blank');
  };

  const handleOpenInNewTab = () => {
    window.open(viewUrl, '_blank');
  };

  return (
    <div 
          className={`pdf-viewer-container min-h-screen ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : className}`} 
      id="pdf-container"
    >
      {/* Compact Header with Controls */}
      <div className={`bg-white border-b shadow-sm p-2 ${isArabic ? 'text-right' : 'text-left'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">{title}</h3>
              {isLoading && (
                <p className="text-xs text-gray-500">
                  {messages?.loading || (isArabic ? "جارٍ التحميل..." : "Loading...")}
                </p>
              )}
            </div>
          </div>
          
          {/* Compact Action Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleDownload}
              title={`${messages?.download || (isArabic ? "تحميل" : "Download")} (Ctrl+D)`}
              className="p-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <svg className="sm:w-6 sm:h-6 w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z M12,19L8,15H10.5V12H13.5V15H16L12,19Z" />
              </svg>
              <span className="hidden sm:inline">{messages?.download || (isArabic ? "تحميل" : "Download")}</span>
            </button>

            <button
              onClick={handleOpenInNewTab}
              title={messages?.newTab || (isArabic ? "نافذة جديدة" : "New Tab")}
              className="p-1.5 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
            >
              <svg className="sm:w-6 sm:h-6 w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
              </svg>
            </button>

            <button
              onClick={toggleFullscreen}
              title={`${isFullscreen ? (messages?.exit || (isArabic ? "خروج" : "Exit")) : (messages?.fullscreen || (isArabic ? "ملء الشاشة" : "Fullscreen"))} (F11)`}
              className="p-1.5 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700 transition-colors"
            >
              {isFullscreen ? (
                <svg className="sm:w-6 sm:h-6 w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,14H19V16H16V19H14V14M5,14H10V19H8V16H5V14M8,5H10V10H5V8H8V5M19,8V10H14V5H16V8H19Z" />
                </svg>
              ) : (
                <svg className="sm:w-6 sm:h-6 w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z" />
                </svg>
              )}
            </button>

            {hasError && (
              <button
                onClick={handleRetry}
                title={messages?.retry || (isArabic ? "إعادة المحاولة" : "Retry")}
                className="p-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PDF Content Area */}
          <div className={`relative bg-white ${isFullscreen ? 'h-[calc(100vh-50px)]' : 'h-[calc(100vh-100px)]'}`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">
                {messages?.loadingPDF || (isArabic ? "جارٍ تحميل PDF..." : "Loading PDF...")}
              </p>
            </div>
          </div>
        )}

        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-red-800 mb-2">
                {messages?.loadError || (isArabic ? "خطأ في التحميل" : "Loading Error")}
              </h4>
              <p className="text-xs text-red-600 mb-3">
                {messages?.loadErrorDesc || (isArabic ? "لا يمكن تحميل المستند" : "Unable to load document")}
              </p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={handleRetry}
                  className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                >
                  {messages?.retry || (isArabic ? "إعادة المحاولة" : "Retry")}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  {messages?.download || (isArabic ? "تحميل" : "Download")}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            id="google-drive-pdf"
            src={embedUrl}
            className="w-full h-full border-0"
            onLoad={handleLoad}
            onError={handleError}
            title={title}
            allowFullScreen
            style={{
              opacity: isLoading ? 0 : 1,
              transition: 'opacity 0.3s ease-in-out'
            }}
          />
        )}
      </div>
    </div>
  );
}