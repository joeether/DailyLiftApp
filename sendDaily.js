const message = {
  notification: {
    title: "🌅 Your Daily Lift",
    body: "Time for today's wisdom, joke, or fact 💪 Tap to open!",
  },
  data: {
    url: "https://your-app-url.web.app/"   // ← Use the FULL URL here (Firebase Hosting URL)
  }
};

await admin.messaging().send({
  token: token,
  notification: message.notification,
  data: message.data
});