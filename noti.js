self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker đã kích hoạt');
});

// Lắng nghe sự kiện hiển thị thông báo từ file script chính
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_GREETING') {
        const options = {
            body: event.data.body,
            icon: 'https://via.placeholder.com/192',
            badge: 'https://via.placeholder.com/192',
            vibrate: [100, 50, 100],
            data: { dateOfArrival: Date.now() }
        };

        self.registration.showNotification(event.data.title, options);
    }
});
