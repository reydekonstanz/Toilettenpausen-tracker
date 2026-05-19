self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open('wc-tracker-v1').then(cache => cache.addAll([
      './',
      './index.html',
      './manifest.webmanifest',
      './icons/icon-192.png',
      './icons/icon-512.png'
    ]))
  );
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k=>k!=='wc-tracker-v1').map(k=>caches.delete(k))))
  );
});
self.addEventListener('fetch', event => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then(res => res || fetch(req).then(r=>{
      const copy = r.clone();
      caches.open('wc-tracker-v1').then(c=>c.put(req, copy)).catch(()=>{});
      return r;
    }).catch(()=>res))
  );
});
