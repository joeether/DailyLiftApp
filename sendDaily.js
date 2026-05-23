import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

async function sendDailyNotifications() {
  try {
    const db = admin.firestore();
    const usersSnapshot = await db.collection('users').get();  // Change 'users' if your collection name is different

    if (usersSnapshot.empty) {
      console.log("No users found in Firestore.");
      return;
    }

    const messageBase = {
      notification: {
        title: "🌅 Your Daily Lift",
        body: "Time for today's wisdom, joke, or fact 💪 Tap to open!",
      },
      data: {
        url: "https://dailyliftapp.com/"   // ← UPDATE with your real Firebase Hosting URL
      }
    };

    let successCount = 0;
    let failureCount = 0;

    for (const doc of usersSnapshot.docs) {
      const userData = doc.data();
      const token = userData.fcmToken;   // Make sure this field name matches what you saved

      if (!token) {
        console.log(`Skipping user ${doc.id} - no FCM token`);
        continue;
      }

      try {
        await admin.messaging().send({
          token: token,
          notification: messageBase.notification,
          data: messageBase.data
        });
        successCount++;
        console.log(`✅ Sent to user ${doc.id}`);
      } catch (error) {
        failureCount++;
        console.error(`❌ Failed to send to ${doc.id}:`, error.message);
      }
    }

    console.log(`\n🎉 Daily notifications complete! Success: ${successCount} | Failures: ${failureCount}`);
  } catch (error) {
    console.error("❌ Big error in sendDailyNotifications:", error);
  }
}

// Run it
await sendDailyNotifications();