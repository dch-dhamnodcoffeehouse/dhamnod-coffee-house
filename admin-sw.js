// 1. Import Firebase SDK libraries into the service worker
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// 2. Initialize Firebase inside the Service Worker using your specific project configurations
firebase.initializeApp({
  apiKey: "AIzaSyALDwRVTLuTV12PYnk1HF5eg-sztH2Bb0s",
  authDomain: "dashboard-dch-a9904.firebaseapp.com",
  databaseURL: "https://dashboard-dch-a9904-default-rtdb.firebaseio.com",
  projectId: "dashboard-dch-a9904",
  storageBucket: "dashboard-dch-a9904.firebasestorage.app",
  messagingSenderId: "413889905968",
  appId: "1:413889905968:web:747b9a22aa95536f9074f5"
});

const messaging = firebase.messaging();

// 3. Handle Background Messages from Firebase (When dashboard is closed or screen is locked)
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);
  
  const notificationTitle = payload.notification?.title || "🚨 New Order Alert!";
  const notificationOptions = {
    body: payload.notification?.body || "Check your live dashboard for details.",
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [500, 200, 500, 200, 500], // Mobile attention vibration
    tag: "dch-order-alert",
    renotify: true,
    data: {
      url: "./admin.html" // Opens your main dashboard file when tapped
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 4. YOUR CORE OFFLINE CACHE MANAGEMENT
const CACHE_NAME = "dch-admin-v1";
const urlsToCache = [
  "./",
  "./admin.html",
  "./analytics.html",
  "./alarm.ogg",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// 5. HANDLE ACTION WHEN USER CLICKS ON THE NOTIFICATION TOAST
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        if (client.url.includes("admin.html") && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(event.notification.data.url);
    })
  );
});
