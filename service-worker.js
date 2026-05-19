const CACHE_NAME = "dch-admin-v2";

const urlsToCache = [
  "./",
  "./admin.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {

self.skipWaiting();

event.waitUntil(
caches.open(CACHE_NAME).then((cache) => {
return cache.addAll(urlsToCache);
})
);

});

self.addEventListener("activate", (event) => {

event.waitUntil(
caches.keys().then((cacheNames) => {
return Promise.all(
cacheNames.map((cache) => {
if (cache !== CACHE_NAME) {
return caches.delete(cache);
}
})
);
})
);

});

self.addEventListener("fetch", (event) => {

event.respondWith(
caches.match(event.request).then((response) => {
return response || fetch(event.request);
})
);

});