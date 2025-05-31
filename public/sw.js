// Service Worker for PWA functionality and offline support
const CACHE_NAME = 'hurass-al-thughur-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/en',
  '/ar', 
  '/manifest.json',
  '/offline.html',
  '/images/logo.jpg',
  '/images/logo.webp',
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first for static assets
  CACHE_FIRST: 'cache-first',
  // Network first for dynamic content
  NETWORK_FIRST: 'network-first',
  // Stale while revalidate for frequent updates
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
};

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching critical resources');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  // Skip for chrome-extension and non-http requests
  if (!event.request.url.startsWith('http')) return;

  const { request } = event;
  const url = new URL(request.url);

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful navigation responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Return offline page for failed navigation requests
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // Handle static assets (images, fonts, etc.)
  if (request.destination === 'image' || 
      request.destination === 'font' ||
      url.pathname.includes('/fonts/') ||
      url.pathname.includes('/images/')) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(request, responseClone));
              }
              return response;
            });
        })
    );
    return;
  }

  // Handle PDF files
  if (url.pathname.includes('.pdf')) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request)
            .then((response) => {
              // Cache PDF files for offline access
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(request, responseClone));
              }
              return response;
            })
            .catch(() => {
              // Return a fallback for PDFs when offline
              return new Response('PDF not available offline', {
                status: 503,
                statusText: 'Service Unavailable'
              });
            });
        })
    );
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses for short periods
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
                // Set expiration for API cache (1 hour)
                setTimeout(() => {
                  cache.delete(request);
                }, 3600000);
              });
          }
          return response;
        })
        .catch(() => {
          // Return cached response for failed API requests
          return caches.match(request);
        })
    );
    return;
  }

  // Default strategy for other requests
  event.respondWith(
    fetch(request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle background synchronization when back online
  console.log('Service Worker: Background sync triggered');
  // Implement any pending offline actions here
}

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/images/logo.jpg',
    badge: '/images/badge.png',
    tag: 'hurass-notification',
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/images/view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/images/dismiss.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Monitor cache size and clean up if needed
async function manageCacheSize() {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();
  
  // Limit cache to 50 items
  if (requests.length > 50) {
    // Remove oldest entries
    for (let i = 0; i < requests.length - 50; i++) {
      await cache.delete(requests[i]);
    }
  }
}

// Run cache management periodically
setInterval(manageCacheSize, 300000); // Every 5 minutes
