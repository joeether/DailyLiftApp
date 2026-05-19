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

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  const notificationTitle = payload.notification?.title || "Daily Lift";
  const notificationOptions = {
    body: payload.notification?.body || "Time for today's wisdom 💪",
    icon: "/icon-192.png" // make sure you have this in wwwroot
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});