/*
 * Custom Service Worker for img2pic PWA
 * This service worker provides offline functionality for the pixel art conversion app
 */

// Note: Workbox imports will be injected by Quasar during build
// self.__WB_MANIFEST will contain the list of assets to cache

// Cache strategy for the app shell (HTML, CSS, JS, etc.)
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Cache strategy for different request types
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font' ||
    request.url.includes('/icons/') ||
    request.url.includes('/assets/')
  ) {
    // Stale-while-revalidate for static assets
    event.respondWith(
      caches.open('app-shell-cache').then((cache) => {
        return cache.match(request).then((response) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            // Update cache with fresh version
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
          // Return cached version or network request
          return response || fetchPromise;
        });
      })
    );
  } else if (request.destination === 'document') {
    // Network-first for HTML pages
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the successful response
          if (response.ok) {
            const responseClone = response.clone();
            caches.open('html-cache').then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/index.html');
          });
        })
    );
  }
});

// Install event - cache important assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('app-shell-cache').then((cache) => {
      // Cache important assets
      return cache.addAll([
        '/',
        '/index.html',
        // Add other critical assets if needed
      ]);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Keep our caches, delete others
            return cacheName !== 'app-shell-cache' && cacheName !== 'html-cache';
          })
          .map((cacheName) => {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

// Handle push notifications for future features
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '1'
      }
    };

    event.waitUntil(
      self.registration.showNotification('img2pic 通知', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});