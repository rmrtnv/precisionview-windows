const CACHE_NAME = 'precisionview-cache-v1';
const urlsToCache = [
    '/precisionview-windows/',
    '/precisionview-windows/index.html',
    '/precisionview-windows/styles.css',
    '/precisionview-windows/script.js',
    '/precisionview-windows/manifest.json',
    '/precisionview-windows/icons/icon-72x72.png',
    '/precisionview-windows/icons/icon-96x96.png',
    '/precisionview-windows/icons/icon-128x128.png',
    '/precisionview-windows/icons/icon-144x144.png',
    '/precisionview-windows/icons/icon-152x152.png',
    '/precisionview-windows/icons/icon-192x192.png',
    '/precisionview-windows/icons/icon-384x384.png',
    '/precisionview-windows/icons/icon-512x512.png',
    'https://kit.fontawesome.com/a076d05399.js',
    '/precisionview-windows/hero-background.jpg'
];

// Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Cache and return requests
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch new version
                return response || fetch(event.request)
                    .then(response => {
                        // Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    });
            })
            .catch(() => {
                // Return offline page if available
                return caches.match('/precisionview-windows/offline.html');
            })
    );
});

// Update Service Worker
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
