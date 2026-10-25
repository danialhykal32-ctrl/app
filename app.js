(function () {
  'use strict';
  var BASE = 'https://script.google.com/macros/s/AKfycby_qqzGVsX5A5J_B6BE-TefzTb8m_Cqgg2q3M2419Hr4MXzmjhh48BXXoJkVeGF-w1n/exec';
  var $ = function (i) { return document.getElementById(i); };

  // Hanya terima MAC & IP yang sah dari portal; selain itu dibuang (elak suntikan link pelik).
  var q = new URLSearchParams(location.search), src = BASE + '?app=1';
  var mac = q.get('mac') || '', ip = q.get('ip') || '';
  if (/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/.test(mac)) src += '&mac=' + encodeURIComponent(mac.toUpperCase());
  if (/^192\.168\.88\.\d{1,3}$/.test(ip)) src += '&ip=' + encodeURIComponent(ip);

  function muat() {
    if (!navigator.onLine) { $('off').style.display = 'flex'; $('load').style.display = 'none'; return; }
    $('off').style.display = 'none'; $('load').style.display = 'flex'; $('load').style.opacity = 1;
    $('f').src = src;
  }
  $('f').addEventListener('load', function () { $('load').style.opacity = 0; setTimeout(function () { $('load').style.display = 'none'; }, 400); });
  $('cuba').addEventListener('click', muat);
  window.addEventListener('online', muat);
  muat();

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(function () {});

  // Pemasangan: minta kebenaran secara automatik (sekali setiap 3 hari jika ditolak).
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var dipasang = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  var baruTolak = Date.now() - (+ls('bfx_tolak') || 0) < 3 * 864e5;
  if (dipasang || baruTolak) return;
  function tolak(id) { $(id).className = 'sheet'; ls('bfx_tolak', String(Date.now())); }

  var ev = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); ev = e;
    setTimeout(function () { $('sA').className = 'sheet on'; }, 2500);
  });
  $('aPasang').addEventListener('click', function () {
    $('sA').className = 'sheet';
    if (ev) { ev.prompt(); ev.userChoice.then(function (r) { if (r.outcome !== 'accepted') ls('bfx_tolak', String(Date.now())); ev = null; }); }
  });
  $('aNanti').addEventListener('click', function () { tolak('sA'); });

  var ua = navigator.userAgent, ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && 'ontouchend' in document);
  var safari = ios && !/CriOS|FxiOS|EdgiOS|GSA|Instagram|FBAN|FBAV|Line\//.test(ua);
  if (safari) setTimeout(function () { $('sI').className = 'sheet on'; }, 3000);
  $('iOk').addEventListener('click', function () { tolak('sI'); });
})();
