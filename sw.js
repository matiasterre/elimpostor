const CACHE_NAME = 'v21'; // Asegurate de que coincida con el nombre en el borrado de abajo
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-512.png'
];

// 1. INSTALACIÓN: Guardar archivos y forzar activación
self.addEventListener('install', (event) => {
  self.skipWaiting(); // <--- CLAVE: Obliga al SW nuevo a entrar ya mismo
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 2. ACTIVACIÓN: Limpiar cachés viejos y tomar control
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim()); // <--- CLAVE: Toma el control de la web al toque
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. FETCH: Servir desde caché o ir a la red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});