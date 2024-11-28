const CACHE_NAME = 'image-cache-v1';

const EXCLUDED_DOMAINS = [
  '.yandex.ru',
  '.yandex.com',
  '.yandex.net',
];

self.addEventListener('install', event => {
  event.waitUntil(
      caches.open(CACHE_NAME)
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (EXCLUDED_DOMAINS.some(domain => url.hostname.endsWith(domain))) {
    return;
  }

  if (
      event.request.destination === 'image' ||
      url.pathname.endsWith('.svg')
  ) {
    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
          return cache.match(event.request).then(response => {
            if (response) {
              console.log('Serving from cache:', event.request.url);
              return response;
            } else {
              console.log('Fetching from network:', event.request.url);
              return fetch(event.request).then(networkResponse => {
                if (networkResponse.ok) {
                  cache.put(event.request, networkResponse.clone());
                }
                return networkResponse;
              });
            }
          });
        })
    );
  }
});
