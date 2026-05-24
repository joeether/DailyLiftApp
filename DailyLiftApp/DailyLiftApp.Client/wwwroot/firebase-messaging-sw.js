importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

const firebaseConfig = {
    apiKey: "AIzaSyDaJrPJXYikMHJQvWp1mBd9qMtjzzpe-68",
    authDomain: "dailyliftapp-aa3e1.firebaseapp.com",
    projectId: "dailyliftapp-aa3e1",
    storageBucket: "dailyliftapp-aa3e1.firebasestorage.app",
    messagingSenderId: "992258604859",
    appId: "1:992258604859:web:1b1acc7cd89cb9b093011e"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
/*
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || "🌅 Your Daily Lift";
  const notificationOptions = {
    body: payload.notification?.body || "Time for today's wisdom, joke, or fact 💪",
    icon: "/icon-192.png",           // make sure this exists
    badge: "/icon-72.png",
    data: {
      url: payload.data?.url || "https://dailyliftapp.com/"
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});*/

// 🔥 THIS IS WHAT YOU WERE MISSING - Click Handler
self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event);

  event.notification.close();

  const url = event.notification.data?.url || "https://dailyliftapp.com/";

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        // If app is already open, focus it
        for (let client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open new window/tab
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});