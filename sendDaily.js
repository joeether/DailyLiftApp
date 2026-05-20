const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function sendDailyNotifications() {
  try {
    const snapshot = await admin.firestore().collection('fcm_tokens').get();

    if (snapshot.empty) {
      console.log("No tokens found yet.");
      return;
    }

    const tokens = snapshot.docs.map(doc => doc.data().token);

    const payload = {
      notification: {
        title: "🌅 Your Daily Lift",
        body: "Time for today's wisdom, joke, or fact 💪 Tap to open!",
      }
    };

    const response = await admin.messaging().sendMulticast({
      tokens: tokens,
      notification: payload.notification
    });

    console.log(`✅ Successfully sent ${response.successCount} notifications`);
    if (response.failureCount > 0) {
      console.log(`Failed to send ${response.failureCount} notifications`);
    }
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
}

sendDailyNotifications();