/**
 * Enhanced Service Worker with advanced caching strategies and offline support
 * Optimized for Next.js applications with PDF viewing capabilities
 */

const CACHE_NAME = 'hurass-magazine-v1.2.0';
const STATIC_CACHE_NAME = 'hurass-static-v1.2.0';
const DYNAMIC_CACHE_NAME = 'hurass-dynamic-v1.2.0';
const PDF_CACHE_NAME = 'hurass-pdfs-v1.2.0';
const FONT_CACHE_NAME = 'hurass-fonts-v1.2.0';

// Cache duration constants
const CACHE_DURATIONS = {
  STATIC: 7 * 24 * 60 * 60 * 1000, // 7 days
  DYNAMIC: 24 * 60 * 60 * 1000,    // 1 day
  PDF: 30 * 24 * 60 * 60 * 1000,   // 30 days
  FONTS: 365 * 24 * 60 * 60 * 1000, // 1 year
  API: 5 * 60 * 1000                // 5 minutes
};

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/images/logo.jpg',
  '/_next/static/css/',
  '/_next/static/js/',
  '/_next/static/chunks/',
];

// PDF patterns for caching
const PDF_PATTERNS = [
  /\/pdfs\/.*\.pdf$/,
  /\/api\/pdf-worker/,
  /pdf\.worker\.js$/
];

// Font patterns
const FONT_PATTERNS = [
  /\.(woff2?|ttf|eot|otf)$/i
];

// Network-first patterns (always try network first)
const NETWORK_FIRST_PATTERNS = [
  /\/api\/.*$/,
  /\/_next\/webpack-hmr/,
  /\/_next\/static\/hmr/
];

// Cache-first patterns (try cache first)
const CACHE_FIRST_PATTERNS = [
  /\/_next\/static\/.*$/,
  /\.(?:js|css|woff2?|png|jpg|jpeg|gif|svg)$/i,
  /\/images\/.*$/
];

/**
 * Advanced caching strategy implementation
 */
class CacheStrategy {
  /**
   * Cache First - Try cache, fallback to network
   */
  static async cacheFirst(request, cacheName = STATIC_CACHE_NAME) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Return cached version immediately
      const cacheDate = cachedResponse.headers.get('sw-cache-date');
      const isStale = cacheDate && (Date.now() - parseInt(cacheDate)) > CACHE_DURATIONS.STATIC;
      
      if (!isStale) {
        return cachedResponse;
      }
      
      // Update cache in background if stale
      this.updateCacheInBackground(request, cache);
      return cachedResponse;
    }
    
    // Fetch from network and cache
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const responseToCache = networkResponse.clone();
        responseToCache.headers.set('sw-cache-date', Date.now().toString());
        await cache.put(request, responseToCache);
      }
      return networkResponse;
    } catch (error) {
      console.warn('Cache first failed for:', request.url, error);
      throw error;
    }
  }

  /**
   * Network First - Try network, fallback to cache
   */
  static async networkFirst(request, cacheName = DYNAMIC_CACHE_NAME) {
    const cache = await caches.open(cacheName);
    
    try {
      const networkResponse = await fetch(request, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (networkResponse.ok) {
        const responseToCache = networkResponse.clone();
        responseToCache.headers.set('sw-cache-date', Date.now().toString());
        await cache.put(request, responseToCache);
      }
      
      return networkResponse;
    } catch (error) {
      console.warn('Network request failed, trying cache:', request.url);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Return offline page for navigation requests
      if (request.mode === 'navigate') {
        const offlinePage = await cache.match('/offline.html');
        if (offlinePage) {
          return offlinePage;
        }
      }
      
      throw error;
    }
  }

  /**
   * Stale While Revalidate - Return cache immediately, update in background
   */
  static async staleWhileRevalidate(request, cacheName = DYNAMIC_CACHE_NAME) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    // Always try to fetch from network in background
    const fetchPromise = fetch(request).then(networkResponse => {
      if (networkResponse.ok) {
        const responseToCache = networkResponse.clone();
        responseToCache.headers.set('sw-cache-date', Date.now().toString());
        cache.put(request, responseToCache);
      }
      return networkResponse;
    }).catch(error => {
      console.warn('Background fetch failed:', request.url, error);
    });
    
    // Return cached response immediately if available
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Wait for network if no cache
    return fetchPromise;
  }

  /**
   * Update cache in background (non-blocking)
   */
  static async updateCacheInBackground(request, cache) {
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const responseToCache = networkResponse.clone();
        responseToCache.headers.set('sw-cache-date', Date.now().toString());
        await cache.put(request, responseToCache);
      }
    } catch (error) {
      console.warn('Background cache update failed:', request.url, error);
    }
  }
}

/**
 * PDF-specific caching with compression
 */
class PDFCacheManager {
  static async cachePDF(request) {
    const cache = await caches.open(PDF_CACHE_NAME);
    
    try {
      const response = await fetch(request);
      
      if (response.ok) {
        const responseToCache = response.clone();
        
        // Add PDF-specific headers
        const headers = new Headers(responseToCache.headers);
        headers.set('sw-cache-date', Date.now().toString());
        headers.set('sw-cache-type', 'pdf');
        headers.set('sw-cache-duration', CACHE_DURATIONS.PDF.toString());
        
        const modifiedResponse = new Response(responseToCache.body, {
          status: responseToCache.status,
          statusText: responseToCache.statusText,
          headers: headers
        });
        
        await cache.put(request, modifiedResponse);
      }
      
      return response;
    } catch (error) {
      console.warn('PDF caching failed:', request.url, error);
      
      // Try to return cached version
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      throw error;
    }
  }

  static async getCachedPDF(request) {
    const cache = await caches.open(PDF_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      const cacheDate = cachedResponse.headers.get('sw-cache-date');
      const isExpired = cacheDate && (Date.now() - parseInt(cacheDate)) > CACHE_DURATIONS.PDF;
      
      if (!isExpired) {
        return cachedResponse;
      }
      
      // Update in background if expired
      this.updatePDFInBackground(request, cache);
    }
    
    return cachedResponse;
  }

  static async updatePDFInBackground(request, cache) {
    try {
      const response = await this.cachePDF(request);
      return response;
    } catch (error) {
      console.warn('Background PDF update failed:', request.url, error);
    }
  }
}

/**
 * Cache cleanup utility
 */
class CacheCleanup {
  static async cleanupExpiredCaches() {
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
      if (cacheName.includes('hurass') && !this.isCurrentCache(cacheName)) {
        console.log('Deleting old cache:', cacheName);
        await caches.delete(cacheName);
      }
    }
  }

  static isCurrentCache(cacheName) {
    const currentCaches = [
      CACHE_NAME,
      STATIC_CACHE_NAME,
      DYNAMIC_CACHE_NAME,
      PDF_CACHE_NAME,
      FONT_CACHE_NAME
    ];
    
    return currentCaches.includes(cacheName);
  }

  static async cleanupLargeCaches() {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const requests = await cache.keys();
    
    // Remove oldest entries if cache is too large
    if (requests.length > 100) {
      const sortedRequests = requests.sort((a, b) => {
        const aDate = a.headers?.get('sw-cache-date') || '0';
        const bDate = b.headers?.get('sw-cache-date') || '0';
        return parseInt(aDate) - parseInt(bDate);
      });
      
      // Remove oldest 20 entries
      const toRemove = sortedRequests.slice(0, 20);
      for (const request of toRemove) {
        await cache.delete(request);
      }
    }
  }
}

/**
 * Route handler for different request types
 */
function getStrategyForRequest(request) {
  const url = new URL(request.url);
  
  // PDF files - special handling
  if (PDF_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return 'pdf';
  }
  
  // Fonts - cache first with long expiration
  if (FONT_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return 'cache-first-fonts';
  }
  
  // API calls - network first
  if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return 'network-first';
  }
  
  // Static assets - cache first
  if (CACHE_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return 'cache-first';
  }
  
  // HTML pages - stale while revalidate
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    return 'stale-while-revalidate';
  }
  
  // Default to network first
  return 'network-first';
}

// Service Worker Event Listeners

self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE_NAME);
      
      try {
        await cache.addAll(STATIC_ASSETS);
        console.log('Static assets cached successfully');
      } catch (error) {
        console.warn('Failed to cache some static assets:', error);
      }
      
      // Skip waiting to activate immediately
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    (async () => {
      // Clean up old caches
      await CacheCleanup.cleanupExpiredCaches();
      
      // Clean up large caches
      await CacheCleanup.cleanupLargeCaches();
      
      // Take control of all clients
      await self.clients.claim();
      
      console.log('Service Worker activated successfully');
    })()
  );
});

self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension requests
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  const strategy = getStrategyForRequest(event.request);
  
  event.respondWith(
    (async () => {
      try {
        switch (strategy) {
          case 'pdf':
            const cachedPDF = await PDFCacheManager.getCachedPDF(event.request);
            if (cachedPDF) {
              return cachedPDF;
            }
            return await PDFCacheManager.cachePDF(event.request);
            
          case 'cache-first-fonts':
            return await CacheStrategy.cacheFirst(event.request, FONT_CACHE_NAME);
            
          case 'cache-first':
            return await CacheStrategy.cacheFirst(event.request, STATIC_CACHE_NAME);
            
          case 'network-first':
            return await CacheStrategy.networkFirst(event.request, DYNAMIC_CACHE_NAME);
            
          case 'stale-while-revalidate':
            return await CacheStrategy.staleWhileRevalidate(event.request, DYNAMIC_CACHE_NAME);
            
          default:
            return await fetch(event.request);
        }
      } catch (error) {
        console.warn('Fetch strategy failed:', strategy, event.request.url, error);
        
        // Fallback to network
        try {
          return await fetch(event.request);
        } catch (networkError) {
          // Final fallback to offline page for navigation
          if (event.request.mode === 'navigate') {
            const cache = await caches.open(STATIC_CACHE_NAME);
            const offlinePage = await cache.match('/offline.html');
            if (offlinePage) {
              return offlinePage;
            }
          }
          throw networkError;
        }
      }
    })()
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Background sync triggered:', event.tag);
  
  switch (event.tag) {
    case 'pdf-download':
      event.waitUntil(handleOfflinePDFDownload());
      break;
    case 'cache-cleanup':
      event.waitUntil(CacheCleanup.cleanupExpiredCaches());
      break;
    default:
      console.log('Unknown sync tag:', event.tag);
  }
});

// Handle offline PDF downloads
async function handleOfflinePDFDownload() {
  try {
    // Get pending downloads from IndexedDB or localStorage
    const pendingDownloads = JSON.parse(localStorage.getItem('pendingPDFDownloads') || '[]');
    
    for (const download of pendingDownloads) {
      try {
        await PDFCacheManager.cachePDF(new Request(download.url));
        console.log('Offline PDF download completed:', download.url);
        
        // Remove from pending list
        const updatedDownloads = pendingDownloads.filter(d => d.url !== download.url);
        localStorage.setItem('pendingPDFDownloads', JSON.stringify(updatedDownloads));
      } catch (error) {
        console.warn('Failed to download PDF offline:', download.url, error);
      }
    }
  } catch (error) {
    console.warn('Background PDF sync failed:', error);
  }
}

// Message handling for communication with main thread
self.addEventListener('message', event => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'CACHE_PDF':
      event.waitUntil(
        PDFCacheManager.cachePDF(new Request(data.url))
          .then(() => {
            event.ports[0]?.postMessage({ success: true });
          })
          .catch(error => {
            event.ports[0]?.postMessage({ success: false, error: error.message });
          })
      );
      break;
      
    case 'CLEANUP_CACHE':
      event.waitUntil(
        CacheCleanup.cleanupExpiredCaches()
          .then(() => {
            event.ports[0]?.postMessage({ success: true });
          })
          .catch(error => {
            event.ports[0]?.postMessage({ success: false, error: error.message });
          })
      );
      break;
      
    case 'GET_CACHE_STATUS':
      event.waitUntil(
        (async () => {
          try {
            const cacheNames = await caches.keys();
            const cacheStatus = {};
            
            for (const cacheName of cacheNames) {
              const cache = await caches.open(cacheName);
              const keys = await cache.keys();
              cacheStatus[cacheName] = keys.length;
            }
            
            event.ports[0]?.postMessage({ success: true, data: cacheStatus });
          } catch (error) {
            event.ports[0]?.postMessage({ success: false, error: error.message });
          }
        })()
      );
      break;
      
    default:
      console.log('Unknown message type:', type);
  }
});

// Performance monitoring
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event.notification.tag);
  event.notification.close();
  
  if (event.notification.tag === 'pdf-ready') {
    event.waitUntil(
      self.clients.openWindow(event.notification.data.url)
    );
  }
});

console.log('Enhanced Service Worker loaded successfully');
