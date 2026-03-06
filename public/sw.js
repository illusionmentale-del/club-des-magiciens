self.addEventListener('push', function (event) {
    if (event.data) {
        try {
            const data = event.data.json();
            const options = {
                body: data.body || "Nouvelle notification",
                icon: data.icon || '/icon-192x192.png',
                badge: '/badge-72x72.png', // Small white icon for Android status bar
                vibrate: [100, 50, 100],
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: '2',
                    url: data.url || '/'
                },
                requireInteraction: true // Keeps the notification on screen until clicked/dismissed
            };

            event.waitUntil(
                self.registration.showNotification(data.title || "Club des Magiciens", options)
            );
        } catch (e) {
            // Fallback for simple text notifications
            const options = {
                body: event.data.text(),
                icon: '/icon-192x192.png',
            };
            event.waitUntil(
                self.registration.showNotification("Club des Magiciens", options)
            );
        }
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    const targetUrl = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            // If window already open, focus it and navigate
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url.includes(self.registration.scope) && 'focus' in client) {
                    client.navigate(targetUrl);
                    return client.focus();
                }
            }
            // If no window is open, open a new one
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
