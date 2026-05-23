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
    
    console.log("🔍 Testing Firestore access...");

    const collections = await db.listCollections();
    console.log("📋 Available collections:", collections.map(c => c.id));

    // Changed from 'users' to 'fcm_tokens'
    const usersSnapshot = await db.collection('fcm_tokens').get();
    console.log(`Found ${usersSnapshot.size} documents in 'fcm_tokens' collection`);

    if (usersSnapshot.empty) {
      console.log("No users found in fcm_tokens collection.");
      return;
    }

    const messageBase = {
  notification: {
    title: "🌅 Your Daily Lift",
    body: "Time for today's wisdom, joke, or fact 💪 Tap to open!",
  },
  data: {
    url: "https://dailyliftapp.com/",     // make sure this matches your actual hosted URL
    click_action: "FLUTTER_NOTIFICATION_CLICK",  // sometimes helps
    type: "daily_lift"
  },
  webpush: {
    fcmOptions: {
      link: "https://dailyliftapp.com/"   // This is important for web
    }
  }
};

    let successCount = 0;
    let failureCount = 0;

    for (const doc of usersSnapshot.docs) {
      const userData = doc.data();
      const token = userData.fcmToken || userData.token;   // try both possible field names

      console.log(`User \( {doc.id} - fcmToken: " \){token || 'MISSING'}"`);

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