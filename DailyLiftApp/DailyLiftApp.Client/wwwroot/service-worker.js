self.addEventListener('notificationclick', event => {
  event.notification.close();

  let url = event.notification.data && event.notification.data.url 
            ? event.notification.data.url 
            : '/';

  // Make sure it's a full URL
  if (!url.startsWith('http')) {
    url = https://dailyliftapp.com/' + (url.startsWith('/') ? url : '/' + url);
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (let client of clientList) {
          if (client.url.includes(url) && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});