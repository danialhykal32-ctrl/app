// BlackFox WiFi: service worker. Simpan "kulit" app sahaja; data sentiasa dari API Google (tidak disimpan).
const V = 'bfx-v7';
const SHELL = ['./', './index.html', './app.css', './app.js', './bg.svg', './manifest.webmanifest', './bfc180.png', './bfc512.png', './bfc512m.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // jangan sentuh API Google / laman lain
  if (e.request.headers.has('range') || /\.mp4$/.test(u.pathname)) return; // video panduan: terus dari rangkaian, tidak disimpan
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))));
});
