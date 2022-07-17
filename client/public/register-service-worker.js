(function () {
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker
			.register("./service-worker-letters.js")
			.then(() => console.log("Service Worker registered successfully."))
			.catch((error) =>
				console.log("Service Worker registration failed:", error)
			);
			
		navigator.serviceWorker.ready
			.then(registration => {
				// Use the PushManager to get the user's subscription to the push service.
				return registration.pushManager.getSubscription()
				.then(async subscription => {
					// If a subscription was found, return it.
					if (subscription) {
						return subscription;
					}

					// Get the server's public key
					const response = await fetch('./vapidPublicKey');
					if (!response.ok) 
						throw `VAPID Public Key fetch had an error: ${response.status} - ${response.statusText}`;
					const vapidPublicKey = await response.text();
					const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

					return registration.pushManager.subscribe({
						userVisibleOnly: true,
						applicationServerKey: convertedVapidKey
					});
				});
			})
			.then(subscription => {
				// Get the stored jwt
				const authToken = localStorage.getItem('id_token');
				
				// POST the subscription details
				fetch('./registerPushSubscription', {
					method: 'post',
					headers: {
						'Content-type': 'application/json',
						'Authorization': 'Bearer ' + authToken
					},
					body: JSON.stringify({ subscription })
				});
			})
			.catch(err => console.error(err));
	}
})();

// Web-Push
// Public base64 to Uint
// copied from https://gist.github.com/Klerith/80abd742d726dd587f4bd5d6a0ab26b6
function urlBase64ToUint8Array(base64String) {
  let padding = '='.repeat((4 - base64String.length % 4) % 4);
  let base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  let rawData = window.atob(base64);
  let outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}