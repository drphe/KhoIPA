self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker đã kích hoạt');
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_UPDATE') {
        const options = {
            body: event.data.body,
            icon: 'icon/logo.png',
            badge: 'icon/logo.png',
            vibrate: [100, 50, 100],
            data: { dateOfArrival: Date.now() }
        };
        self.registration.showNotification(event.data.title, options);
    }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      if (clientList.length > 0) {
        let client = clientList[0];
        client.focus();
        client.postMessage({ action: 'refresh' });
      } else {
        clients.openWindow('/');
      }
    })
  );
});
