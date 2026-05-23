import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

async function sendDailyNotification(token) {
  const message = {
    token: token,
    notification: {
      title: "🌅 Your Daily Lift",
      body: "Time for today's wisdom, joke, or fact 💪 Tap to open!",
    },
    data: {
      url: "https://your-app-url.web.app/"   // ← Change this to your real Firebase Hosting URL
    }
  };

  try {
    await admin.messaging().send(message);
    console.log("✅ Daily notification sent successfully!");
  } catch (error) {
    console.error("❌ Error sending message:", error);
  }
}

// Call it with the token (you'll need to get the token from wherever you store it)
await sendDailyNotification("USER_FCM_TOKEN_HERE");