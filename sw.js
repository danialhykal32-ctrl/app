// BlackFox WiFi: service worker. Simpan "kulit" app sahaja; data sentiasa dari API Google (tidak disimpan).
// Halaman (index.html), app.js, app.css, boot.js: NETWORK-FIRST (cache:'no-cache'). Jika rangkaian lambat (> 4s halaman / 8s fail)
// atau gagal, guna salinan cache; jika tiada langsung, halaman "Tiada sambungan" (bukan skrin kosong).
// Safari menolak respons SW yang "redirected" untuk navigasi (skrin putih/kelabu) -> sentiasa dibersihkan.
// SW baru menunggu sehingga pelajar tekan "Kemas kini" (mesej 'skip'), atau app ditutup & dibuka semula.
const V = 'bfx-v13';
const SHELL = ['./', './index.html', './boot.js', './app.css', './app.js', './bg.svg', './manifest.webmanifest', './speedtest.js', './ikon.svg', './ikon-180.png', './ikon-192.png', './ikon-512.png', './ikon-512m.png', './maskot.svg'];
self.addEventListener('install', e => {
  // satu fail gagal TIDAK menggagalkan pemasangan (addAll akan gagal semua)
  e.waitUntil(caches.open(V).then(c => Promise.all(SHELL.map(u => fetch(new Request(u, { cache: 'reload' })).then(r => r.ok ? c.put(u, r) : null).catch(() => null)))));
});
self.addEventListener('message', e => { if (e.data && e.data.t === 'skip') self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
function bersih(r) { // Safari: respons "redirected" tidak boleh digunakan untuk navigasi
  if (!r || !r.redirected) return r;
  return r.blob().then(b => new Response(b, { status: r.status, statusText: r.statusText, headers: r.headers }));
}
const LUAR_TALIAN = '<!doctype html><html lang="ms"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<title>BlackFox WiFi</title></head><body style="margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;' +
  'background:#120a24;color:#f5f3ff;font-family:-apple-system,system-ui,sans-serif;text-align:center;padding:24px;box-sizing:border-box">' +
  '<h1 style="font-size:20px;margin:0 0 8px">Tiada sambungan</h1><p style="opacity:.75;max-width:320px;line-height:1.5">Sambung WiFi asrama atau data telefon, kemudian cuba lagi. ' +
  'Untuk log masuk WiFi, buka 192.168.88.1.</p><a href="./?src=app" style="margin-top:16px;padding:14px 28px;border-radius:999px;background:#7c3aed;color:#fff;text-decoration:none;font-weight:700">Cuba lagi</a></body></html>';
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // jangan sentuh API Google / laman lain
  if (e.request.headers.has('range') || /\.mp4$/.test(u.pathname)) return; // video panduan: terus dari rangkaian, tidak disimpan
  const nav = e.request.mode === 'navigate';
  const segar = nav || /\/(index\.html|app\.js|app\.css|boot\.js)$/.test(u.pathname) || /\/$/.test(u.pathname);
  const kunci = nav ? './index.html' : e.request;
  const dariCache = () => caches.match(kunci, { ignoreSearch: true }).then(r => r || (nav ? caches.match('./') : undefined));
  const rangkaian = (segar ? fetch(u.href, { cache: 'no-cache', credentials: 'same-origin' }) : fetch(e.request)).then(r => {
    if (r.ok && !r.redirected) { const c = r.clone(); caches.open(V).then(x => x.put(kunci, c)).catch(() => {}); }
    return r;
  });
  e.respondWith(new Promise(selesai => {
    let siap = false;
    const beri = r => { if (!siap && r) { siap = true; selesai(r); } };
    // rangkaian lambat (contoh: WiFi belum log masuk) -> salinan cache selepas 4s (halaman) / 8s (fail lain)
    const t = setTimeout(() => dariCache().then(beri), nav ? 4000 : 8000);
    rangkaian.then(r => { clearTimeout(t); beri(r); }).catch(() => {
      clearTimeout(t);
      dariCache().then(r => beri(r || (nav ? new Response(LUAR_TALIAN, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }) : Response.error())));
    });
  }).then(bersih));
});
