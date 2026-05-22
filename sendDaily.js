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

    const message = {
      notification: {
        title: "🌅 Your Daily Lift",
        body: "Time for today's wisdom, joke, or fact 💪 Tap to open!",
      },
      data: {
        url: "/"                     // Change to "/daily" or whatever page you want
      },
      android: {
        notification: {
          icon: "ic_launcher"       // Use your app's icon name here
        }
      },
      apns: {
        payload: {
          aps: {
            'mutable-content': 1
          }
        }
      }
    };

    let success = 0;
    let failure = 0;

    for (const token of tokens) {
      try {
        await admin.messaging().send({
          token: token,
          ...message
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