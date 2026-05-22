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
    console.log(`Found ${tokens.length} tokens`);

    const payload = {
      notification: {
        title: "🌅 Your Daily Lift",
        body: "Time for today's wisdom, joke, or fact 💪 Tap to open!",
        icon: "/icon-192.png",        // Make sure this file exists in your public folder
      },
      data: {
        url: "/"                      // Change this to "/daily" or whatever page you want to open
      }
    };

    let success = 0;
    let failure = 0;

    for (const token of tokens) {
      try {
        await admin.messaging().send({
          token: token,
          notification: payload.notification,
          data: payload.data               // <-- This sends the deep link
        });
        success++;
      } catch (err) {
        console.error("Failed to send to one token:", err);
        failure++;
      }
    }

    console.log(`✅ Successfully sent ${success} notifications`);
    if (failure > 0) {
      console.log(`❌ Failed to send ${failure} notifications`);
    }

  } catch (error) {
    console.error("Error sending notifications:", error);
  }
}

sendDailyNotifications();