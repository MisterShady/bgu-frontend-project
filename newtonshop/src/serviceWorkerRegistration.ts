const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register(config?: {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
}) {
  console.log("Service Worker registration function called.");
  if ("serviceWorker" in navigator) {
    console.log("Service Worker registration available.");
    const publicUrl = new URL(process.env.PUBLIC_URL || "/", window.location.href);
    console.log("Public URL:", publicUrl);
    if (publicUrl.origin !== window.location.origin) {
      console.log("Service Worker registration skipped due to different origin.");
      return;
    }

    window.addEventListener("load", () => {
      const swUrl = `${publicUrl.origin}${publicUrl.pathname}service-worker.js`;
      console.log("Service Worker URL:", swUrl);

      if (isLocalhost) {
        console.log("Running on localhost.");
        checkValidServiceWorker(swUrl, config);

        navigator.serviceWorker.ready.then(() => {
          console.log("This web app is being served cache-first by a service worker.");
        });
      } else {
        console.log("Running on production.");
        registerValidSW(swUrl, config);
      }
    });
  } else {
    console.log("Service Worker registration not available.");
  }
}

function registerValidSW(
  swUrl: string,
  config?: {
    onUpdate?: (registration: ServiceWorkerRegistration) => void;
    onSuccess?: (registration: ServiceWorkerRegistration) => void;
  }
) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log("Service Worker registered:", registration);
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              console.log("New content is available and will be used when all tabs for this page are closed.");

              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              console.log("Content is cached for offline use.");

              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error("Error during service worker registration:", error);
    });
}

function checkValidServiceWorker(
  swUrl: string,
  config?: {
    onUpdate?: (registration: ServiceWorkerRegistration) => void;
    onSuccess?: (registration: ServiceWorkerRegistration) => void;
  }
) {
  fetch(swUrl, { headers: { "Service-Worker": "script" } })
    .then((response) => {
      const contentType = response.headers.get("content-type");
      if (response.status === 404 || (contentType != null && contentType.indexOf("javascript") === -1)) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log("No internet connection found. App is running in offline mode.");
    });
}
