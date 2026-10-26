// BlackFox WiFi: service worker. Simpan "kulit" app sahaja; data sentiasa dari API Google (tidak disimpan).
// Network-first + cache:'no-cache' untuk halaman, app.js & app.css: versi baru diambil terus bila online.
// SW baru menunggu sehingga pelajar tekan "Kemas kini" (mesej 'skip'), kemudian app dimuat semula sekali.
const V = 'bfx-v8';
const SHELL = ['./', './index.html', './app.css', './app.js', './bg.svg', './manifest.webmanifest', './bfc180.png', './bfc512.png', './bfc512m.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' }))))); });
self.addEventListener('message', e => { if (e.data && e.data.t === 'skip') self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // jangan sentuh API Google / laman lain
  if (e.request.headers.has('range') || /\.mp4$/.test(u.pathname)) return; // video panduan: terus dari rangkaian, tidak disimpan
  // halaman + app.js + app.css: pintas cache HTTP pelayar (GitHub Pages simpan 10 minit) supaya sentiasa versi terkini
  const segar = e.request.mode === 'navigate' || /\/(index\.html|app\.js|app\.css)$/.test(u.pathname) || /\/app\/$/.test(u.pathname);
  const dapat = segar ? fetch(u.href, { cache: 'no-cache', credentials: 'same-origin' }) : fetch(e.request);
  e.respondWith(dapat.then(r => { if (r.ok) { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))));
});
