// BlackFox: pengawal permulaan (dimuat SEBELUM app.js, ES5, tiada kebergantungan).
// Jika app gagal render dalam 5 saat (ralat JS / CSP / cache rosak / fail hilang), tunjuk skrin sandaran
// "Ralat memuatkan app" + butang Muat semula: nyahdaftar service worker + buang semua cache + muat semula.
// Gaya ditetapkan melalui element.style (dibenarkan CSP) supaya skrin ini tetap kelihatan walaupun app.css gagal.
(function () {
  'use strict';
  var ralat = [], dipapar = false;
  function catat(m) { if (ralat.length < 5) ralat.push(String(m || 'ralat tidak diketahui').slice(0, 200)); }
  function siap() { // app dianggap sudah render jika ada paparan aktif (log masuk / dashboard) atau skrin memuat
    var v = document.querySelector('.view.on, .muat.on');
    return !!(v && v.getBoundingClientRect().height > 50);
  }
  function gaya(e, s) { for (var k in s) e.style[k] = s[k]; return e; }
  function muatSemula(b) {
    b.disabled = true; b.textContent = 'Membersihkan…';
    // simpan sesi & tetapan pelajar; buang data paparan yang mungkin rosak
    try { var simpan = { bfx_t: 1, bfx_mac: 1, bfx_ip: 1, bfx_cid: 1, bfx_tempat: 1, bfx_zon: 1, bfx_lok: 1, bfx_bilik: 1 };
      for (var i = localStorage.length - 1; i >= 0; i--) { var k = localStorage.key(i); if (k && k.indexOf('bfx_') === 0 && !simpan[k]) localStorage.removeItem(k); } } catch (e) {}
    var kerja = [];
    try { if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) kerja.push(navigator.serviceWorker.getRegistrations().then(function (R) { return Promise.all(R.map(function (r) { return r.unregister(); })); })); } catch (e) {}
    try { if (window.caches && caches.keys) kerja.push(caches.keys().then(function (K) { return Promise.all(K.map(function (k) { return caches.delete(k); })); })); } catch (e) {}
    var pergi = function () { location.replace(location.pathname + '?src=app&r=' + Date.now()); };
    (window.Promise ? Promise.all(kerja).then(pergi, pergi) : pergi());
    setTimeout(pergi, 4000);
  }
  function papar(sebab) {
    if (dipapar || siap()) return; dipapar = true;
    var w = gaya(document.createElement('div'), { position: 'fixed', left: '0', top: '0', right: '0', bottom: '0', zIndex: '2147483647', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center', background: '#120a24', color: '#f5f3ff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' });
    w.id = 'bfxGagal'; w.setAttribute('role', 'alert');
    var h = gaya(document.createElement('h1'), { fontSize: '20px', margin: '0 0 8px', fontWeight: '700' }); h.textContent = 'Ralat memuatkan app';
    var p = gaya(document.createElement('p'), { fontSize: '14px', lineHeight: '1.5', margin: '0 0 20px', maxWidth: '320px', color: 'rgba(245,243,255,.75)' });
    p.textContent = 'Tekan Muat semula untuk membersihkan cache. Log masuk anda tidak dipadam. Jika masih gagal, buka 192.168.88.1 dalam Safari / Chrome.';
    var b = gaya(document.createElement('button'), { minHeight: '48px', padding: '0 28px', border: '0', borderRadius: '999px', fontSize: '16px', fontWeight: '700', color: '#fff',
      background: 'linear-gradient(135deg,#8b5cf6,#6366f1 55%,#ec4899 120%)', cursor: 'pointer' });
    b.type = 'button'; b.textContent = 'Muat semula'; b.addEventListener('click', function () { muatSemula(b); });
    var d = gaya(document.createElement('small'), { marginTop: '18px', fontSize: '11px', color: 'rgba(245,243,255,.45)', maxWidth: '320px', wordBreak: 'break-word' });
    d.textContent = (sebab || '') + (ralat.length ? ' · ' + ralat[0] : '');
    w.appendChild(h); w.appendChild(p); w.appendChild(b); w.appendChild(d);
    (document.body || document.documentElement).appendChild(w);
  }
  window.addEventListener('error', function (e) {
    var t = e && e.target;
    if (t && t !== window && (t.tagName === 'SCRIPT' || t.tagName === 'LINK')) { // fail app gagal dimuat
      var u = t.src || t.href || ''; if (/\/(app\.js|app\.css)(\?|$)/.test(u)) { catat('Fail gagal dimuat: ' + u.split('/').pop()); setTimeout(function () { papar('Fail app gagal dimuat'); }, 300); }
      return;
    }
    catat(e && (e.message || (e.error && e.error.message)));
    if (document.readyState === 'complete') setTimeout(function () { if (!siap()) papar('Ralat JavaScript'); }, 300);
  }, true);
  window.addEventListener('unhandledrejection', function (e) { catat('Promise: ' + (e && e.reason && (e.reason.message || e.reason))); });
  setTimeout(function () { if (!siap()) papar('App tidak dipaparkan dalam 5 saat'); }, 5000);
  window.bfxRalat = function () { return ralat.slice(); };
})();
