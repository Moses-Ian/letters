const CACHE_NAME = "version-02.1.1";
const urlsToCache = [ 'index.html', 'offline.html', 'background5.jpg' ];
const self = this;
// Install SW
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then((cache) => {
				return cache.addAll(urlsToCache);
			})
			.catch(error => {
				console.error(error)
			})
	)
});
// Activate the SW
self.addEventListener('activate', (event) => {
	const cacheWhitelist = [];
	cacheWhitelist.push(CACHE_NAME);
	event.waitUntil(
		caches.keys().then((cacheNames) => Promise.all(
			cacheNames.map((cacheName) => {
				if(!cacheWhitelist.includes(cacheName)) 
					return caches.delete(cacheName);
				return undefined;
			})
		))
	)
});
// Listen for requests
self.addEventListener('fetch', (event) => {
	const url = event.request.url
	const split = url.split('/')
	const fileName = split[split.length -1]
	const name = fileName === '' ? 'offline.html':fileName
	event.respondWith(
		caches.match(event.request)
			.then(() => {
				return fetch(event.request) 
					.catch(() => caches.match(name))    
			})
	)
});
// Register event listener for the 'push' event.
self.addEventListener('push', event => {
	if (!event.data) return;
  const payload = event.data.text();
  // Keep the service worker alive until the notification is shown to the user.
  event.waitUntil(
    // Show a notification
    self.registration.showNotification('L3tters', {body: payload})
  );
});
// Register event listener for the 'push-subscription-changed' event
// I'm not convinced that this works as it's supposed to 
// -> if people's subscriptions aren't automatically updating, this may be the culprit
self.addEventListener("pushsubscriptionchange", event => {
	console.log('push subscription changed');
  event.waitUntil(swRegistration.pushManager.subscribe(event.oldSubscription.options)
    .then(subscription => {
			// Get the stored jwt
			const authToken = localStorage.getItem('id_token');
				
      fetch("register", {
        method: "post",
        headers: {
          "Content-type": "application/json",
					'Authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint
        })
      });
			return;
    })
  );
}, false);
