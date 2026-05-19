importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

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

messaging.onBackgroundMessage(function(payload) {

  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png'
    }
  );

});