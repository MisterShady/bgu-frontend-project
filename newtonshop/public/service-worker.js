const CACHE_NAME = "image-cache-v1";

const EXCLUDED_DOMAINS = [".yandex.ru", ".yandex.com", ".yandex.net"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME));
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (EXCLUDED_DOMAINS.some((domain) => url.hostname.endsWith(domain))) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") {
    event.respondWith(fetch(event.request));
    return;
  }

  const isImageRequest =
    event.request.destination === "image" ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".gif");

  if (isImageRequest) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            return response;
          } else {
            return fetch(event.request).then((networkResponse) => {
              if (networkResponse.ok && networkResponse.headers.get("Content-Type")?.startsWith("image/")) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            });
          }
        });
      })
    );
  } else {
    event.respondWith(fetch(event.request));
  }
});
