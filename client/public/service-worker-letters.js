const CACHE_NAME = "version-02";
const urlsToCache = [ 'index.html', 'offline.html', 'background5.cb5c31a8.jpg' ];
const self = this;
// Install SW
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.log(error)
            })
    )
});
// Listen for requests
self.addEventListener('fetch', (event) => {
    console.log(event)
    
    const url = event.request.url
    const split = url.split('/')
    const fileName = split[split.length -1]
    const name = fileName === '' ? 'offline.html':fileName
    console.log(fileName)
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request) 
                    // .catch(() => caches.match('offline.html'))
                    .catch(() => caches.match(name))
                    
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
                if(!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
								return undefined;
            })
        ))
)
});