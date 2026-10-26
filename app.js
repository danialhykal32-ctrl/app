// BlackFox WiFi: app pelajar penuh (GitHub Pages). Apps Script hanya API (POST text/plain, tanpa preflight CORS).
(function () {
  'use strict';
  var API = 'https://script.google.com/macros/s/AKfycby_qqzGVsX5A5J_B6BE-TefzTb8m_Cqgg2q3M2419Hr4MXzmjhh48BXXoJkVeGF-w1n/exec';
  var BOT = 'blackfoxcyber_alert_bot';
  var TOK = '', MAC = '', IP = '', AK = null, INFO = null, PROF = null, TG = null, PG = 'utama', NT = 'semua', STM = 'kuota', MG = 0;

  // ---------- pembantu ----------
  function el(i) { return document.getElementById(i); }
  function qa(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } }
  function teks(e, t) { if (e) e.textContent = t; }
  function toast(t) { var x = el('toast'); x.textContent = t; x.className = 'toast'; void x.offsetWidth; x.className = 'toast on'; clearTimeout(toast.t); toast.t = setTimeout(function () { x.className = 'toast'; }, 3400); }
  function tarikh(s) { var m = String(s || '').match(/(\d{2})\/(\d{2})\/(\d{4})(?: (\d{2}):(\d{2}))?/); return m ? new Date(Date.UTC(+m[3], +m[2] - 1, +m[1], (+m[4] || 0) - 8, +m[5] || 0)) : null; }
  function hariLagi(a) { var t = a && tarikh(a.tamat); return t ? Math.max(0, Math.ceil((t.getTime() - Date.now()) / 864e5)) : 0; }
  function nombor(n) { n = Number(n) || 0; return n % 1 ? n.toFixed(1) : String(n); }
  var BULAN = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];
  var HARI = ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'];

  // ---------- ikon ----------
  var P = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  var IC = {
    gauge: P('<path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 18l4-6"/><path d="M12 6v1.5M6.3 8.3l1 1M17.7 8.3l-1 1"/>'),
    fox: '<svg viewBox="0 0 64 64"><path d="M8 6l14 14h20L56 6l-4 26-20 26L12 32z" fill="#ff6a00"/><path d="M22 20h20l-10 12z" fill="#0b0d10" opacity=".9"/><path d="M32 58L20 38h24z" fill="#0b0d10" opacity=".55"/><circle cx="24" cy="30" r="2.2" fill="#0b0d10"/><circle cx="40" cy="30" r="2.2" fill="#0b0d10"/></svg>',
    home: P('<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),
    bag: P('<path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 0 1 6 0"/>'),
    key: P('<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>'),
    send: P('<path d="M21 4L3 11l6 2 2 6 3-4 5 4z"/>'),
    spark: P('<path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z"/>'),
    user: P('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'),
    logout: P('<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3"/>'),
    wifi: P('<path d="M2 9a16 16 0 0 1 20 0M5 12.5a11 11 0 0 1 14 0M8.5 16a6 6 0 0 1 7 0"/><path d="M12 19.5h.01"/>'),
    gift: P('<rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13M12 8c-1.5-3-5-3-5-1s3 1 5 1c2 0 5 1 5-1s-3.5-2-5 1"/>'),
    plusc: P('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'),
    arrowr: P('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    arrowu: P('<path d="M12 19V5M6 11l6-6 6 6"/>'),
    chl: P('<path d="M15 5l-7 7 7 7"/>'), chr: P('<path d="M9 5l7 7-7 7"/>'),
    bell: P('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>'),
    receipt: P('<path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6M9 15h4"/>'),
    device: P('<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>'),
    clock: P('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    chart: P('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
    card: P('<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M14 10h4M14 14h4"/>'),
    lock: P('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    alert: P('<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>'),
    exit: P('<path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"/><path d="M15 8l4 4-4 4M19 12H9"/>'),
    w_cerah: P('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    w_awan: P('<path d="M8 4.5a3.5 3.5 0 0 1 5.6 2.2"/><path d="M7 19h10a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.6 1.5A3.3 3.3 0 0 0 7 19z"/>'),
    w_mendung: P('<path d="M6.5 19h11a4.5 4.5 0 0 0 .4-9 6 6 0 0 0-11.6 1.6A3.7 3.7 0 0 0 6.5 19z"/>'),
    w_hujan: P('<path d="M6.5 15h11a4 4 0 0 0 .4-8 6 6 0 0 0-11.6 1.6A3.3 3.3 0 0 0 6.5 15z"/><path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3"/>'),
    w_ribut: P('<path d="M6.5 14h11a4 4 0 0 0 .4-8 6 6 0 0 0-11.6 1.6A3.3 3.3 0 0 0 6.5 14z"/><path d="M12.5 15l-2.5 4h3l-2 4"/>'),
    w_kabus: P('<path d="M4 9h16M3 13h18M5 17h14M8 21h8"/>')
  };
  function ikon(r) { qa('i[data-ic]', r).forEach(function (i) { if (!i.firstChild && IC[i.getAttribute('data-ic')]) i.innerHTML = IC[i.getAttribute('data-ic')]; }); }

  // ---------- peranti & browser ----------
  var ua = navigator.userAgent;
  var dipasang = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  var ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var android = /Android/i.test(ua);
  var iosVer = (function () { var m = ua.match(/OS (\d+)[_.]\d/) || ua.match(/Version\/(\d+)/); return ios && m ? +m[1] : 0; })();
  // Browser dalam app (Telegram, WhatsApp, Instagram, Facebook, TikTok...). iOS: WKWebView tiada token "Safari/".
  var inApp = /FBAN|FBAV|FB_IAB|FBIOS|Instagram|WhatsApp|Telegram|TikTok|musical_ly|Bytedance|Line\/|Snapchat|GSA\/|; wv\)/i.test(ua) || (ios && !dipasang && !/Safari\//.test(ua));
  function jenisPeranti() {
    if (dipasang) return 'dipasang';
    if (inApp) return ios ? 'ios-inapp' : (android ? 'android-inapp' : 'lain');
    if (ios) return /CriOS|FxiOS|EdgiOS/.test(ua) ? 'ios-lain' : 'ios-safari';
    if (/SamsungBrowser/.test(ua)) return 'samsung';
    if (android) return /Firefox/.test(ua) ? 'firefox-android' : 'android';
    if (/Macintosh/.test(ua) && /Safari\//.test(ua) && !/Chrome|Chromium|Edg|Firefox/.test(ua)) return 'mac-safari';
    if (/Edg\/|Chrome\//.test(ua)) return 'laptop';
    return 'lain';
  }
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }

  // ---------- API ----------
  function api(req, cb, ms) {
    req.token = TOK; req.mac = MAC; req.ip = IP;
    var ctl = window.AbortController ? new AbortController() : null, t = ctl && setTimeout(function () { ctl.abort(); }, ms || 45000);
    fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ api: 1, req: req }), redirect: 'follow', signal: ctl ? ctl.signal : undefined })
      .then(function (r) { return r.json(); })
      .then(function (r) { clearTimeout(t); r = r || {}; if (r.keluar && TOK) keluar(true); else if (r.token && TOK) { TOK = r.token; ls('bfx_t', TOK); } if (r.info) setInfo(r.info); cb(r); })
      .catch(function () { clearTimeout(t); cb({ ok: false, msg: navigator.onLine === false ? 'Tiada internet. Sambung WiFi atau data telefon.' : 'Tiada sambungan ke pelayan. Cuba lagi.' }); });
  }

  // ---------- talian / notis ----------
  function setInfo(i) {
    INFO = i;
    qa('[data-line]').forEach(function (l) { l.className = 'line' + (i.up ? '' : ' down'); teks(l.querySelector('span'), i.up ? 'Online' : 'Gangguan'); });
    qa('[data-alert]').forEach(function (a) {
      a.textContent = ''; a.className = 'alert';
      if (!i.up) { var b = document.createElement('b'); b.textContent = 'Amaran talian: '; a.appendChild(b); a.appendChild(document.createTextNode('Internet asrama sedang terganggu sejak ' + i.sejak + '. Kami sedang membaiki.')); a.className = 'alert on'; }
      else if (i.notis && !a.closest('#vDash')) { var n = document.createElement('b'); n.textContent = 'Notis: '; a.appendChild(n); a.appendChild(document.createTextNode(i.notis)); a.className = 'alert on notis'; }
    });
    var c = document.querySelector('.c-talian'); if (c) c.classList.toggle('down', !i.up);
    teks(el('tChip'), i.up ? 'Online' : 'Gangguan');
    var tc = el('tTalC'); if (tc) { teks(tc, i.up ? 'Normal' : 'Terganggu'); tc.className = 'chip ' + (i.up ? 'ok' : 'bad'); }
    teks(el('tSejak'), i.up ? 'Talian asrama' : 'Sejak ' + String(i.sejak).slice(11, 16));
    el('jualTutup').hidden = !!i.jual; el('grid').hidden = !i.jual;
    el('bFree').hidden = !(AK && !AK.ada && i.percuma);
    if (AK) { promo(AK); notif(); }
  }

  // ---------- log masuk / daftar (V2) ----------
  function tab(i) {
    var a = el('auth'); if (a.getAttribute('data-b')) return; a.setAttribute('data-b', '1');
    var k = 'auth gl' + (i ? '' : ' daftar');
    a.className = k + ' out';
    setTimeout(function () { a.className = k + ' in'; setTimeout(function () { a.className = k; a.removeAttribute('data-b'); }, 720); }, 300);
  }
  function masuk() {
    var m = el('lm').value.trim(), p = el('lp').value.replace(/\s+/g, '');
    if (!m || !p) { el('lmsg').textContent = 'Isi No. Kad Matrik & PIN.'; return; }
    el('lmsg').textContent = 'Menyemak…';
    api({ a: 'login', m: m, pin: p }, function (r) { if (!r.ok) { el('lmsg').textContent = r.msg || 'Gagal.'; return; } el('lmsg').textContent = ''; masukOk(r); });
  }
  function daftar() {
    var n = el('dn').value, m = el('dm').value, p = el('dp').value;
    if (!/^[0-9]{9}$/.test(p)) { el('dmsg').textContent = 'PIN mesti tepat 9 digit nombor.'; return; }
    el('dmsg').textContent = 'Mendaftar…';
    api({ a: 'daftar', n: n, m: m, pin: p }, function (r) { if (!r.ok) { el('dmsg').textContent = r.msg || 'Gagal.'; return; } el('dmsg').textContent = ''; toast('Akaun didaftarkan'); masukOk(r); if (!r.akaun.ada) go('pakej'); });
  }
  function masukOk(r) { TOK = r.token; ls('bfx_t', TOK); document.body.classList.remove('tetamu'); setAk(r.akaun); tunjukDash(); }
  function tunjukDash() {
    el('vAuth').className = 'view'; el('vDash').className = 'view on'; document.body.classList.add('dash');
    el('bOut').hidden = !ss('bfx_wifi');
    var rl = el('rail'); rl.classList.remove('mula'); void rl.offsetWidth; rl.classList.add('mula');
    PG = ''; go('utama'); muatCS(); prefetchAsrama(); muatProfil();
  }
  // tamat = token sudah tidak sah di server (tak perlu beritahu server)
  function keluar(tamat) {
    var tetamu = !TOK;
    if (TOK && !tamat) api({ a: 'keluar' }, function () {});
    TOK = ''; AK = null; PROF = null; TG = null; ls('bfx_t', null); ls('bfx_ak', null);
    document.body.classList.remove('tetamu'); document.body.classList.remove('dash');
    el('vDash').className = 'view'; el('vAuth').className = 'view on';
    if (!tetamu) { el('lp').value = ''; el('log').textContent = ''; }
  }

  // ---------- navigasi (kabur -> jelas, sebijik V18) ----------
  function pecahKata(h) {
    if (!h || h.getAttribute('data-w') === h.textContent) return;
    var t = h.textContent; h.textContent = '';
    t.split(/(\s+)/).forEach(function (w, k) { var s = document.createElement('span'); s.className = 'w'; s.style.setProperty('--k', k / 2); s.textContent = w; h.appendChild(s); });
    h.setAttribute('data-w', t);
  }
  function go(pg) {
    if (!el('pg-' + pg)) return;
    if (document.body.classList.contains('tetamu') && pg !== 'ai') return;
    var lama = PG && el('pg-' + PG), baru = el('pg-' + pg);
    qa('.ri[data-pg]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-pg') === pg); });
    takuk();
    if (pg === PG) return;
    PG = pg;
    var tunjuk = function () {
      qa('.page').forEach(function (p) { if (p !== baru) p.className = 'page'; });
      qa('.a', baru).forEach(function (a, i) { a.style.setProperty('--i', i); });
      qa('.wr', baru).forEach(pecahKata);
      baru.className = 'page'; void baru.offsetWidth; baru.className = 'page on masuk';
      clearTimeout(go.t); go.t = setTimeout(function () { baru.classList.remove('masuk'); }, 1800);
      var m = el('main'); if (m.scrollTop) m.scrollTop = 0; if (window.scrollY) window.scrollTo(0, 0);
      kira(baru); setTimeout(kanta, 60);
      if (pg === 'tg') muatTg();
      if (pg === 'profil') muatProfil();
      if (pg === 'ai') mulaChat();
      if (pg === 'laju') lajuSedia();
    };
    if (lama && lama.classList.contains('on')) { lama.className = 'page keluar'; setTimeout(tunjuk, 210); } else tunjuk();
  }
  function takuk() {
    var b = document.querySelector('.ri.on'), n = el('notch');
    if (!b) { n.style.opacity = 0; return; }
    n.style.top = (b.offsetTop + b.offsetHeight / 2) + 'px'; n.style.opacity = 1;
  }
  // tooltip (hover / tekan)
  function tip(b, lama) {
    var t = el('tip'), r = b.getBoundingClientRect();
    t.textContent = b.getAttribute('data-tip');
    t.className = 'tip'; var w = t.offsetWidth, kiri = r.right + 12 + w > innerWidth - 8;
    t.style.left = (kiri ? r.left - 12 - w : r.right + 12) + 'px'; t.style.top = (r.top + r.height / 2 - 13) + 'px';
    t.className = 'tip on' + (kiri ? ' kiri' : ''); clearTimeout(tip.t);
    if (lama) tip.t = setTimeout(function () { t.className = 'tip'; }, lama);
  }

  // ---------- nombor dikira naik ----------
  function kira(r) {
    qa('[data-to]', r).forEach(function (e) {
      var to = Number(e.getAttribute('data-to')) || 0, dp = to % 1 ? 1 : 0, suf = e.getAttribute('data-suf') || '', s0 = Date.now();
      (function f() {
        var k = Math.min(1, (Date.now() - s0) / 1100); k = 1 - Math.pow(1 - k, 3);
        e.innerHTML = (to * k).toFixed(dp) + suf;
        if (k < 1) requestAnimationFrame(f);
      })();
    });
  }
  function letak(id, v, suf) { var e = el(id); if (!e) return; e.setAttribute('data-to', Number(v) || 0); e.setAttribute('data-suf', suf || ''); e.innerHTML = nombor(v) + (suf || ''); }

  // ---------- data akaun ----------
  function salamMasa() { var h = new Date(Date.now() + 8 * 3600e3).getUTCHours(); return h < 12 ? 'Selamat pagi' : h < 14 ? 'Selamat tengah hari' : h < 19 ? 'Selamat petang' : 'Selamat malam'; }
  function setAk(a) {
    AK = a; ls('bfx_ak', JSON.stringify(a));
    var nama = String(a.nama || a.m), depan = nama.split(' ')[0], hari = hariLagi(a), pt = a.kuota > 0 ? Math.max(0, Math.min(1, a.guna / a.kuota)) : 0;
    depan = depan.charAt(0).toUpperCase() + depan.slice(1).toLowerCase();
    var h = el('salam'); h.removeAttribute('data-w'); h.textContent = salamMasa() + ', ' + depan;
    teks(el('tNama'), depan); teks(el('tAva'), depan.charAt(0));
    teks(el('bsub'), a.ada ? (a.aktif ? 'Pelan ' + a.pelan + ' aktif sehingga ' + String(a.tamat).slice(0, 10) + '. Sambung WiFi FOX ULTRA 5G dan tekan Sambung WiFi.' : 'Pelan anda telah tamat. Pilih pakej baharu untuk teruskan.') : 'Belum ada pelan. Pilih pakej atau ambil percuma 5GB untuk mula.');
    teks(el('xp'), a.ada ? a.pelan : 'Tiada pelan');
    letak('qb', a.ada ? a.baki : 0, '<small>GB</small>');
    var c2 = el('pg2'); teks(c2, a.ada ? Math.round((1 - pt) * 100) + '% baki' : 'Baru'); c2.className = 'chip ' + (a.ada && pt < .9 ? 'ok' : 'bad');
    teks(el('xt'), a.ada ? (a.aktif ? 'Tamat ' : 'Tamat pada ') + String(a.tamat).slice(0, 10) : 'Pilih pakej untuk mula');
    letak('tKuota', a.ada ? a.kuota : 0); letak('tGuna', a.ada ? a.guna : 0); letak('tPer', a.peranti || 1);
    letak('tHari', a.ada ? hari : 0);
    var hc = el('tHariC'); teks(hc, a.ada ? (a.aktif ? 'Aktif' : 'Tamat') : 'Baru'); hc.className = 'chip';
    teks(el('tHariS'), a.ada ? 'hari sebelum tamat' : 'tiada pelan aktif');
    teks(el('tPelan'), a.ada ? a.pelan : '—'); teks(el('tPelanC'), a.ada ? a.kuota + 'GB' : 'Pilih'); teks(el('tPelanS'), a.ada ? (a.peranti || 1) + ' peranti' : 'pakej');
    teks(el('pg1'), Math.round(pt * 100) + '%');
    var mt = el('meter'); setTimeout(function () { mt.style.width = (a.ada ? Math.max(2, pt * 100) : 0) + '%'; }, 250); mt.parentNode.classList.toggle('penuh', pt >= .9);
    teks(el('mGuna'), a.ada ? nombor(a.guna) + ' GB digunakan' : '0 GB'); teks(el('mKuota'), a.ada ? a.kuota + ' GB' : '-');
    el('bFree').hidden = !(!a.ada && INFO && INFO.percuma);
    promo(a); notif(); pakejPanel(); profilAsas(); tgJubin();
    if (PG) kira(el('pg-' + PG));
  }
  function statistik() {}
  function tgJubin() {
    var on = !!((TG && TG.linked) || (PROF && PROF.telegram));
    teks(el('tTg'), on ? 'Disambung' : 'Belum'); var c = el('tTgC'); teks(c, on ? '✓ Aktif' : 'Sambung'); c.className = 'chip' + (on ? ' ok' : '');
  }
  function promo(a) {
    var b = el('prB'), cd = a && a.cadangan && INFO && INFO.jual !== false ? a.cadangan : null;
    if (cd) { teks(el('prT'), 'Cadangan BlackFox AI'); teks(el('prP'), cd.t); b.removeAttribute('data-pg'); b.setAttribute('data-beli', cd.k || ''); teks(b.querySelector('span'), cd.l || 'Lihat Pakej'); if (!cd.k) { b.removeAttribute('data-beli'); b.setAttribute('data-pg', 'pakej'); } }
    else { teks(el('prT'), a && !a.ada ? 'Mula Dengan Pakej' : 'Tambah Kuota Bila Perlu'); teks(el('prP'), a && !a.ada ? 'Saver 110GB RM17 sebulan, atau cuba percuma 5GB.' : 'Add-on dari RM10. Aktif automatik selepas bayar.'); b.removeAttribute('data-beli'); b.setAttribute('data-pg', 'pakej'); teks(b.querySelector('span'), 'Lihat Pakej'); }
  }
  function kalendar() {
    if (!el('week')) return;
    var now = new Date(Date.now() + 8 * 3600e3), d0 = new Date(now); d0.setUTCDate(now.getUTCDate() - ((now.getUTCDay() + 6) % 7) + MG * 7);
    var tamat = AK && tarikh(AK.tamat), tk = tamat ? new Date(tamat.getTime() + 8 * 3600e3).toISOString().slice(0, 10) : '', hk = now.toISOString().slice(0, 10);
    teks(el('bulan'), BULAN[d0.getUTCMonth()] + ', ' + d0.getUTCFullYear());
    var w = el('week'); w.textContent = '';
    for (var i = 0; i < 6; i++) {
      var d = new Date(d0); d.setUTCDate(d0.getUTCDate() + i); var k = d.toISOString().slice(0, 10);
      var s = document.createElement('span'); s.className = (k === hk ? 'hari' : '') + (k === tk ? ' tamat' : '');
      s.title = k === tk ? 'Pakej tamat' : '';
      s.appendChild(document.createTextNode(HARI[d.getUTCDay()])); var b = document.createElement('b'); b.textContent = d.getUTCDate(); s.appendChild(b); w.appendChild(s);
    }
  }
  function notif() {
    var L = [], a = AK || {}, i = INFO || {};
    if (i.notis) L.push({ j: 'notis', c: 'or', ic: 'bell', b: 'Notis BlackFox', p: i.notis, tg: 'Baru' });
    if (i.up === false) L.push({ j: 'notis', c: 'bad', ic: 'alert', b: 'Talian asrama terganggu', p: 'Sejak ' + i.sejak + '. Kuota anda tidak terjejas.', tg: 'Langsung' });
    if (a.cadangan && i.jual !== false) L.push({ j: 'akaun', c: 'or', ic: 'spark', b: 'Cadangan BlackFox AI', p: a.cadangan.t, tg: 'AI' });
    if (a.ada && a.kuota && a.baki <= a.kuota * 0.1) L.push({ j: 'akaun', c: 'bad', ic: 'chart', b: 'Kuota hampir habis', p: 'Baki ' + nombor(a.baki) + 'GB daripada ' + a.kuota + 'GB.' });
    if (a.ada && a.aktif && hariLagi(a) <= 3) L.push({ j: 'akaun', c: '', ic: 'clock', b: 'Pakej hampir tamat', p: 'Tamat ' + String(a.tamat).slice(0, 16) + '. Perbaharui awal supaya internet tidak terputus.' });
    if (a.m && !a.ada) L.push({ j: 'akaun', c: '', ic: 'bag', b: 'Belum ada pelan', p: 'Pilih pakej atau ambil percuma 5GB.' });
    if (TG && !TG.linked) L.push({ j: 'akaun', c: '', ic: 'send', b: 'Sambung Telegram', p: 'Terima amaran kuota & notis gangguan terus ke Telegram.' });
    if (ios) L.push({ j: 'akaun', c: '', ic: 'wifi', b: 'Tip iPhone: auto log masuk WiFi', p: 'Settings → Wi-Fi → ⓘ (FOX ULTRA 5G) → Private Wi-Fi Address → Off / Fixed. Supaya router kenal phone anda dan auto-login berfungsi.', tg: 'Tip' });
    (PROF && PROF.beli || []).slice(0, 4).forEach(function (x, k) { L.push({ j: 'akaun', c: 'cy', ic: 'receipt', b: 'Beli ' + x.p + ' · RM' + Number(x.rm).toFixed(2), p: x.w || x.t, tg: 'Resit', r: k }); });
    var n = el('notif'); n.textContent = '';
    var F = L.filter(function (x) { return NT === 'semua' || x.j === NT; });
    if (!F.length) { var k = document.createElement('div'); k.className = 'kosong'; k.textContent = 'Tiada notifikasi baharu.'; n.appendChild(k); return; }
    F.forEach(function (x, idx) {
      var d = document.createElement(x.r !== undefined ? 'button' : 'div'); d.className = 'ni ' + x.c; d.style.animationDelay = (idx * 60) + 'ms';
      if (x.r !== undefined) { d.setAttribute('data-act', 'lihatResit'); d.setAttribute('data-r', x.r); }
      d.innerHTML = '<span class="nic"><i data-ic="' + x.ic + '"></i></span><div><b></b><p></p></div>' + (x.tg ? '<span class="tg"></span>' : '');
      teks(d.querySelector('b'), x.b); teks(d.querySelector('p'), x.p); if (x.tg) teks(d.querySelector('.tg'), x.tg);
      n.appendChild(d);
    });
    ikon(n);
  }

  // ---------- pakej ----------
  var PK = [
    { k: 'saver', n: 'Saver', gb: '110', u: 'GB', d: 'Untuk guna harian. 30 hari.', rm: 17, j: 'bulanan' },
    { k: 'pro', n: 'Pro', gb: '150', u: 'GB', d: 'Streaming & game. 30 hari.', rm: 22, j: 'bulanan', hot: 1 },
    { k: 'extra', n: 'Extra', gb: '200', u: 'GB', d: 'Pengguna berat. 30 hari.', rm: 26, j: 'bulanan' },
    { k: 'kilat', n: 'Kilat 1 Jam', gb: '10', u: 'GB', d: 'Sehingga 10GB dalam 1 jam.', rm: 10, j: 'pantas' },
    { k: 'add15', n: 'Add-on +15GB', gb: '+15', u: 'GB', d: 'Tambah kuota. Perlu pelan aktif.', rm: 10, j: 'addon' },
    { k: 'add30', n: 'Add-on +30GB', gb: '+30', u: 'GB', d: 'Tambah kuota. Perlu pelan aktif.', rm: 15, j: 'addon' },
    { k: 'add50', n: 'Add-on +50GB', gb: '+50', u: 'GB', d: 'Tambah kuota. Perlu pelan aktif.', rm: 20, j: 'addon' },
    { k: 'peranti', n: 'Tambah Peranti', gb: '+1', u: 'peranti', d: 'Satu lagi peranti serentak.', rm: 2, j: 'addon' }
  ];
  var LBL = { bulanan: 'Bulanan', pantas: 'Pantas', addon: 'Add-on' };
  function binaPakej() {
    var g = el('grid');
    PK.forEach(function (p, i) {
      var c = document.createElement('div'); c.className = 'card a pk' + (p.hot ? ' hot' : ''); c.setAttribute('data-j', p.j);
      c.innerHTML = '<span class="mt" data-art="' + (2 + i % 5) + '"><em class="tag"></em><span class="gb"><b></b><small></small></span></span><h4></h4><p></p><div class="pkf"><b></b><button class="pill" data-beli="' + p.k + '"><i data-ic="bag"></i><span>Beli</span></button></div>';
      teks(c.querySelector('.tag'), p.hot ? 'POPULAR' : LBL[p.j]); teks(c.querySelector('.gb b'), p.gb); teks(c.querySelector('.gb small'), p.u);
      teks(c.querySelector('h4'), p.n); teks(c.querySelector('p'), p.d); teks(c.querySelector('.pkf b'), 'RM' + p.rm);
      g.appendChild(c);
    });
    ikon(g);
  }
  function tapis(f) {
    qa('#fTabs button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-f') === f); });
    qa('.pk').forEach(function (c, i) { var on = f === 'semua' || c.getAttribute('data-j') === f; c.hidden = !on; if (on) { c.style.animation = 'none'; void c.offsetWidth; c.style.animation = 'muncul .6s var(--out) ' + (i * 40) + 'ms backwards'; } });
  }
  function pakejPanel() {
    var a = AK; if (!a) return;
    var h = hariLagi(a), jum = a.pelan === 'Kilat 1 Jam' || a.pelan === 'Percuma 1 Hari' ? 1 : 30, pt = a.kuota ? a.guna / a.kuota : 0;
    teks(el('cr1'), a.ada ? nombor(a.guna) + ' / ' + a.kuota + ' GB' : 'Tiada pelan');
    teks(el('cr2'), a.ada ? Math.max(0, jum - h) + ' / ' + jum + ' hari' : '-');
    teks(el('cr3'), (a.peranti || 1) + ' / 3 peranti');
    teks(el('cr4b'), a.ada ? 'Pelan ' + a.pelan : 'Belum ada pelan'); teks(el('cr4'), a.ada ? (a.aktif ? 'Aktif, tamat ' + String(a.tamat).slice(0, 10) : 'Tamat') : 'Pilih pakej di sebelah');
    setTimeout(function () { el('cb1').style.width = (a.ada ? Math.min(100, pt * 100) : 0) + '%'; el('cb2').style.width = (a.ada ? Math.min(100, (jum - h) / jum * 100) : 0) + '%'; el('cb3').style.width = ((a.peranti || 1) / 3 * 100) + '%'; }, 200);
    letak('cHari', a.ada ? h : 0);
  }
  function beli(k) {
    if (!k) return;
    if (INFO && INFO.jual === false) { toast('Jualan belum dibuka'); return; }
    toast('Menyediakan bil…');
    api({ a: 'beli', k: k }, function (r) {
      if (!r.ok) { toast(r.msg || 'Gagal menyediakan bil.'); return; }
      ls('bfx_beli_t', String(Date.now()));
      var u = r.url;
      if (MAC) u = 'http://192.168.88.1/login?username=' + encodeURIComponent('T-' + MAC) + '&dst=' + encodeURIComponent(r.url);
      location.href = u;
    });
  }
  function sambung(auto) {
    var b = el('bSambung'), s = b.querySelector('span'); teks(s, auto ? 'Menyambung WiFi…' : 'Menyediakan…');
    api({ a: 'sambung' }, function (r) { teks(s, 'Sambung WiFi'); if (!r.ok) { toast(r.msg || 'Gagal.'); return; } location.href = r.url; });
  }
  function percuma() { toast('Mengaktifkan…'); api({ a: 'percuma' }, function (r) { if (r.akaun) setAk(r.akaun); if (!r.ok) { toast(r.msg || 'Gagal.'); return; } toast('Percuma 5GB diaktifkan!'); resitPercuma(); }); }

  // ---------- resit ----------
  function pilihResit() { var c = el('rsC'); c.classList.remove('kilat'); void c.offsetWidth; c.classList.add('kilat'); el('rsF').click(); }
  function resit(inp) {
    var f = inp.files && inp.files[0], M = el('rsM'); inp.value = ''; if (!f) return;
    M.className = 'msg';
    if (!/^image\//.test(f.type)) { M.textContent = 'Pilih fail gambar (screenshot resit).'; return; }
    M.textContent = 'Memproses gambar…';
    var rd = new FileReader();
    rd.onload = function () {
      var im = new Image();
      im.onload = function () {
        var s = Math.min(1, 1600 / Math.max(im.width, im.height)), cv = document.createElement('canvas');
        cv.width = Math.round(im.width * s); cv.height = Math.round(im.height * s); cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
        var d = cv.toDataURL('image/jpeg', 0.85).split(',')[1];
        M.textContent = 'Menyemak resit dengan ToyyibPay… (sehingga 30 saat)'; el('rsB').disabled = true;
        api({ a: 'resit', img: d, mime: 'image/jpeg' }, function (r) { el('rsB').disabled = false; M.className = 'msg' + (r.ok ? ' ok' : ''); M.textContent = r.msg || ''; if (r.akaun) setAk(r.akaun); if (r.ok && /disahkan/i.test(r.msg || '')) muatProfil(function () { if (PROF.beli[0]) cetakResit(PROF.beli[0]); }); });
      };
      im.onerror = function () { M.textContent = 'Gambar tidak dapat dibaca. Cuba screenshot lain.'; };
      im.src = rd.result;
    };
    rd.readAsDataURL(f);
  }

  // ---------- PIN ----------
  function tukarPin() {
    var p = el('np').value, p2 = el('np2').value, M = el('pmsg'); M.className = 'msg';
    if (!/^[0-9]{9}$/.test(p)) { M.textContent = 'PIN mesti tepat 9 digit nombor.'; return; }
    if (p !== p2) { M.textContent = 'PIN tidak sama. Taip semula.'; return; }
    M.textContent = 'Menyimpan…';
    api({ a: 'pin', baru: p }, function (r) { M.textContent = r.msg || ''; M.className = 'msg' + (r.ok ? ' ok' : ''); if (r.ok) { el('np').value = ''; el('np2').value = ''; } });
  }

  // ---------- Telegram: t.me terus pada klik pengguna ----------
  function muatTg() {
    if (TG && Date.now() - TG.t < 5 * 60000) return paparTg();
    teks(el('tgK'), '...');
    api({ a: 'tg' }, function (r) { if (!r.ok) { teks(el('tgK'), 'Cuba lagi'); return; } TG = { kod: r.kod, linked: !!r.linked, t: Date.now() }; paparTg(); notif(); });
  }
  function paparTg() {
    el('tgL').href = 'https://t.me/' + BOT + '?start=' + encodeURIComponent(TG.kod);
    teks(el('tgK'), '/start ' + TG.kod);
    var s = el('tgSt'); teks(s, TG.linked ? 'Disambung' : 'Belum'); s.className = 'chip' + (TG.linked ? ' ok' : '');
    teks(el('tgH'), TG.linked ? 'Telegram Disambung' : 'Sambung Telegram');
    tgJubin();
  }
  function salin(t, ok) {
    try { navigator.clipboard.writeText(t).then(function () { toast(ok || 'Kod disalin'); }, function () { toast(t); }); }
    catch (e) { toast(t); }
  }

  // ---------- Tanya AI ----------
  function tambah(w, t) { var d = document.createElement('div'); d.className = 'b ' + w; d.textContent = t; el('log').appendChild(d); el('log').scrollTop = 99999; return d; }
  function mulaChat() { if (!el('log').children.length) tambah('a', 'Hai! Saya BlackFox AI 🦊 Tanya apa sahaja tentang WiFi asrama: kuota, PIN, sambungan, bayaran.'); setTimeout(function () { if (matchMedia('(hover:hover)').matches) el('cq').focus(); }, 400); }
  function hantar(q) {
    var t = q || el('cq').value; if (!t) return; el('cq').value = ''; tambah('u', t);
    var w = document.createElement('div'); w.className = 'b a'; w.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>'; el('log').appendChild(w); el('log').scrollTop = 99999;
    api({ a: 'chat', msg: t, m: AK ? AK.m : el('lm').value, zon: zonKini() }, function (r) {
      w.remove(); tambah('a', r.ok ? r.balas : (r.msg || 'Ralat'));
      if (TOK) api({ a: 'akaun' }, function (x) { if (x.ok) setAk(x.akaun); });
    });
  }

  // ---------- Profil ----------
  function profilAsas() {
    var a = AK; if (!a) return;
    var nama = String(a.nama || a.m);
    teks(el('pav'), nama.charAt(0).toUpperCase()); teks(el('pnama'), nama); teks(el('pm'), a.m); teks(el('ppl'), a.ada ? 'Pelan ' + a.pelan : 'Belum ada pelan');
    teks(el('pper'), (a.peranti || 1) + ' peranti');
    var s = el('pst'); s.className = 'chip ' + (a.aktif ? 'ok' : 'bad'); s.innerHTML = '<i class="d"></i>'; s.appendChild(document.createTextNode(a.ada ? (a.aktif ? 'Aktif' : 'Tamat') : 'Baru'));
    letak('s1', a.ada ? a.kuota : 0); letak('s2', a.ada ? a.guna : 0); letak('s3', a.ada ? hariLagi(a) : 0);
    teks(el('s3e'), a.ada ? 'tamat ' + String(a.tamat).slice(0, 10) : 'tiada pelan aktif');
  }
  function muatProfil(cb) {
    paparProfil();
    api({ a: 'profil' }, function (r) {
      if (!r.ok) return; PROF = r.profil; if (TG) TG.linked = TG.linked || PROF.telegram;
      paparProfil(); carta(); notif(); tgJubin(); if (cb) cb();
    });
  }
  function paparProfil() {
    var a = AK || {}, p = PROF || { beli: [], telegram: false, jumlahRm: 0, bilBeli: 0, mula: '' };
    teks(el('ptg'), p.telegram ? 'Telegram disambung' : 'Telegram belum'); teks(el('pTg2'), p.telegram ? 'Disambung ✓' : 'Belum disambung');
    letak('s4', p.bilBeli); teks(el('s4e'), 'jumlah RM' + (Number(p.jumlahRm) || 0).toFixed(2));
    teks(el('pAbout'), a.ada ? 'Pelan ' + a.pelan + ' ' + a.kuota + 'GB' + (p.mula ? ' bermula ' + p.mula.slice(0, 10) : '') + ', ' + (a.aktif ? 'aktif sehingga ' : 'tamat pada ') + String(a.tamat).slice(0, 10) + '. Telah guna ' + nombor(a.guna) + 'GB, baki ' + nombor(a.baki) + 'GB pada ' + (a.peranti || 1) + ' peranti.' : 'Akaun berdaftar tetapi belum ada pelan aktif. Pilih pakej atau ambil percuma 5GB untuk mula.');
    var ch = el('pChips'); ch.textContent = '';
    [a.ada ? a.pelan : 'Tiada pelan', a.aktif ? 'Aktif' : (a.ada ? 'Tamat' : 'Baru'), p.telegram ? 'Telegram ✓' : 'Telegram belum', (a.peranti || 1) + ' peranti'].forEach(function (t) { var s = document.createElement('span'); s.className = 'chip'; s.textContent = t; ch.appendChild(s); });
    teks(el('pTot'), 'RM' + (Number(p.jumlahRm) || 0).toFixed(2));
    var B = el('pBars'); B.textContent = '';
    var L = p.beli.slice().reverse(), mx = Math.max.apply(null, L.map(function (x) { return x.rm; }).concat([1]));
    if (!L.length) { var k = document.createElement('div'); k.className = 'kosong'; k.textContent = 'Belum ada pembelian.'; B.appendChild(k); }
    L.forEach(function (x, i) {
      var d = document.createElement('div'), s = document.createElement('span'), sm = document.createElement('small');
      sm.textContent = String(x.t).slice(0, 5); d.appendChild(s); d.appendChild(sm); B.appendChild(d);
      if (i === L.length - 1) { var e = document.createElement('em'); e.textContent = 'RM' + x.rm; s.appendChild(e); }
      setTimeout(function () { s.style.height = Math.max(8, x.rm / mx * 100) + '%'; }, 250 + i * 70);
    });
    var A = el('pAkt'); A.textContent = '';
    if (!p.beli.length) { var k2 = document.createElement('div'); k2.className = 'kosong'; k2.textContent = 'Tiada aktiviti lagi.'; A.appendChild(k2); }
    p.beli.slice(0, 4).forEach(function (x, i) {
      var d = document.createElement('button'); d.className = 'ni' + (i ? '' : ' or'); d.style.animationDelay = (i * 60) + 'ms'; d.setAttribute('data-act', 'lihatResit'); d.setAttribute('data-r', i);
      d.innerHTML = '<span class="nic"><i data-ic="receipt"></i></span><div><b></b><p></p></div><span class="tg"></span>';
      teks(d.querySelector('b'), 'Beli ' + x.p); teks(d.querySelector('p'), x.t); teks(d.querySelector('.tg'), 'RM' + x.rm); A.appendChild(d);
    });
    ikon(A);
    kira(el('pg-profil'));
  }


  // ---------- carta perbelanjaan 6 bulan (data sebenar dari profil) ----------
  function carta() {
    var C = el('chart'); if (!C) return; C.textContent = '';
    var now = new Date(Date.now() + 8 * 3600e3), B = [], i;
    for (i = 5; i >= 0; i--) { var d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1)); B.push({ k: d.getUTCFullYear() + '-' + d.getUTCMonth(), n: BULAN[d.getUTCMonth()].slice(0, 3), rm: 0 }); }
    (PROF && PROF.beli || []).forEach(function (x) { var t = tarikh(x.w || x.t); if (!t) return; t = new Date(t.getTime() + 8 * 3600e3); var k = t.getUTCFullYear() + '-' + t.getUTCMonth(); B.forEach(function (b) { if (b.k === k) b.rm += Number(x.rm) || 0; }); });
    var mx = Math.max.apply(null, B.map(function (b) { return b.rm; }).concat([1])), jum = B.reduce(function (a, b) { return a + b.rm; }, 0);
    teks(el('chS'), jum ? 'Jumlah 6 bulan: RM' + jum.toFixed(2) : '6 bulan terakhir · belum ada pembelian');
    B.forEach(function (b, k) {
      var d = document.createElement('div'), e = document.createElement('em'), bt = document.createElement('span'), sm = document.createElement('small');
      bt.className = 'bt'; e.textContent = b.rm ? 'RM' + Math.round(b.rm) : ''; sm.textContent = b.n;
      d.appendChild(e); d.appendChild(bt); d.appendChild(sm); C.appendChild(d);
      setTimeout(function () { bt.style.height = (b.rm ? Math.max(10, b.rm / mx * 100) : 4) + '%'; }, 300 + k * 90);
    });
  }

  // ---------- togol kanta kaca (Glassy Kit) ----------
  function kanta() {
    qa('#vDash .seg, #vDash .tabs, #vDash .tog').forEach(function (g) {
      var k = g.querySelector('.knob'); if (!k) { k = document.createElement('span'); k.className = 'knob'; g.insertBefore(k, g.firstChild); }
      var b = g.querySelector('button.on'); if (!b || !b.offsetWidth) return;
      k.style.left = b.offsetLeft + 'px'; k.style.width = b.offsetWidth + 'px';
    });
  }

  // ---------- RESIT (cetak dari slot) ----------
  var RC = null;
  function tempohPelan(p) { return /kilat/i.test(p) ? '1 jam' : /percuma/i.test(p) ? '1 hari' : /add-?on|peranti/i.test(p) ? 'ikut pelan semasa' : '30 hari'; }
  function kodBar(ref) {
    var B = el('rcBar'); B.textContent = ''; var h = 0, i, s3 = String(ref || 'BLACKFOX');
    for (i = 0; i < s3.length; i++) h = (h * 31 + s3.charCodeAt(i)) >>> 0;
    for (i = 0; i < 64; i++) { h = (h * 1103515245 + 12345) >>> 0; var x = document.createElement('i'); x.style.width = (1 + (h >> 16) % 3) * 1.2 + 'px'; B.appendChild(x); }
    teks(el('rcKod'), s3);
  }
  function isiDl(id, rows) { var D = el(id); D.textContent = ''; rows.forEach(function (r) { if (r[1] === '' || r[1] === undefined) return; var t = document.createElement('dt'), d = document.createElement('dd'); t.textContent = r[0]; d.textContent = r[1]; D.appendChild(t); D.appendChild(d); }); }
  function bukaResit(o) {
    RC = o; var a = AK || {};
    teks(el('rcT'), o.percuma ? 'Internet percuma diaktifkan' : 'Resit anda');
    teks(el('rcS'), o.percuma ? 'Percuma 5GB · RM0.00' : 'RM' + Number(o.rm).toFixed(2) + ' dibayar dengan ' + (o.cara || 'FPX / DuitNow QR'));
    isiDl('rcA', [['Resit', o.ref], ['Tarikh', o.w], ['No. Matrik', a.m], ['Nama', String(a.nama || '').slice(0, 22)]]);
    isiDl('rcB', [['Pakej', o.p], ['Kuota', o.gb ? o.gb + ' GB' : ''], ['Tempoh', tempohPelan(o.p)], ['Peranti', (a.peranti || 1) + ' serentak'], ['Harga', 'RM' + Number(o.rm).toFixed(2)], ['Caj', 'RM0.00']]);
    teks(el('rcJ'), 'RM' + Number(o.rm).toFixed(2));
    teks(el('rcCop').querySelector('b'), o.percuma ? 'FREE' : 'PAID'); teks(el('rcCopT'), String(o.w || '').slice(0, 10));
    isiDl('rcC', [['Bayaran', o.percuma ? 'Percuma pengguna baru' : o.cara], ['Status', o.percuma ? 'AKTIF' : 'DILULUSKAN']]);
    kodBar(o.ref);
    cetakSemula();
  }
  function cetakSemula() {
    var r = el('rc'); clearTimeout(cetakSemula.t);
    r.className = 'rc on'; void r.offsetWidth; r.className = 'rc on cetak';
    cetakSemula.t = setTimeout(function () { r.className = 'rc on cetak siap'; }, 3300);
  }
  function cetakResit(x) { if (!x) return; ls('bfx_resit_dicetak', x.ref); bukaResit({ ref: x.ref, w: x.w || x.t, p: x.p, rm: x.rm, gb: x.gb, cara: x.cara || 'FPX / DuitNow QR' }); }
  function resitPercuma() {
    var a = AK || {}, w = new Date(Date.now() + 8 * 3600e3), d2 = function (n) { return (n < 10 ? '0' : '') + n; };
    var t = d2(w.getUTCDate()) + '/' + d2(w.getUTCMonth() + 1) + '/' + w.getUTCFullYear() + ' ' + d2(w.getUTCHours()) + ':' + d2(w.getUTCMinutes());
    bukaResit({ percuma: 1, ref: 'FREE-' + String(a.m || '').slice(-4) + '-' + w.getUTCFullYear() + d2(w.getUTCMonth() + 1) + d2(w.getUTCDate()), w: t, p: 'Percuma 5GB', rm: 0, gb: 5, cara: 'Percuma' });
  }
  // Pulang dari ToyyibPay (?bayar=1&status_id=..): tunggu callback direkod, kemudian cetak resit
  function tungguBayaran(st) {
    if (st === '3') { toast('Pembayaran tidak berjaya / dibatalkan.'); return; }
    // terima HANYA bayaran yang direkod selepas pelajar tekan Beli (atau 30 minit terakhir), dan belum pernah dicetak
    var r = el('rc'), sejak = (+ls('bfx_beli_t') || Date.now() - 30 * 60e3) - 10 * 60e3, n = 0;
    teks(el('rcT'), 'Mengesahkan bayaran…'); teks(el('rcS'), 'Menunggu pengesahan ToyyibPay. Jangan tutup app.');
    r.className = 'rc on tunggu';
    (function semak() {
      api({ a: 'profil' }, function (x) {
        if (x.ok) { PROF = x.profil; var b = PROF.beli[0], tb = b && tarikh(b.w || b.t); if (b && tb && tb.getTime() >= sejak && b.ref !== ls('bfx_resit_dicetak')) { ls('bfx_beli_t', null); api({ a: 'akaun' }, function (y) { if (y.ok) setAk(y.akaun); }); carta(); notif(); cetakResit(b); return; } }
        if (++n >= 30) { r.className = 'rc'; toast('Bayaran belum disahkan. Jika sudah bayar, tekan Hantar Resit di Pakej.'); return; }
        setTimeout(semak, 4000);
      });
    })();
  }

  // ---------- peristiwa ----------
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act],[data-pg],[data-beli],[data-st],[data-nt],[data-f],.qk button');
    if (!t) return;
    if (t.matches('.qk button')) { hantar(t.textContent); return; }
    if (t.hasAttribute('data-beli')) { e.preventDefault(); beli(t.getAttribute('data-beli')); return; }
    if (t.hasAttribute('data-st')) { STM = t.getAttribute('data-st'); statistik(); kira(document.querySelector('.c-stat')); return; }
    if (t.hasAttribute('data-nt')) { NT = t.getAttribute('data-nt'); qa('#nTabs button').forEach(function (b) { b.classList.toggle('on', b === t); }); notif(); kanta(); return; }
    if (t.hasAttribute('data-f')) { tapis(t.getAttribute('data-f')); kanta(); return; }
    var act = t.getAttribute('data-act');
    if (t.hasAttribute('data-pg') && !act) { e.preventDefault(); go(t.getAttribute('data-pg')); if (t.classList.contains('ri') && matchMedia('(hover:none)').matches) tip(t, 900); return; }
    if (!act) return;
    e.preventDefault();
    switch (act) {
      case 'kemaskini': kemaskini(); break;
      case 'tab0': tab(0); break;
      case 'tab1': tab(1); break;
      case 'keluar': keluar(); break;
      case 'sambung': sambung(); break;
      case 'percuma': percuma(); break;
      case 'resit': if (PG !== 'pakej') go('pakej'); pilihResit(); break;
      case 'resitPg': go('pakej'); setTimeout(pilihResitKilat, 700); break;
      case 'askAI': go('ai'); setTimeout(function () { el('cq').focus(); }, 450); break;
      case 'lihatResit': cetakResit(PROF && PROF.beli[+t.getAttribute('data-r')]); break;
      case 'rcUlang': cetakSemula(); break;
      case 'rcTutup': el('rc').className = 'rc'; break;
      case 'mgL': MG--; kalendar(); break;
      case 'mgR': MG++; kalendar(); break;
      case 'salinKod': salin(el('tgK').textContent); break;
      case 'aiLupa': document.body.classList.add('tetamu'); el('vAuth').className = 'view'; el('vDash').className = 'view on'; PG = ''; go('ai'); setTimeout(function () { hantar('Saya lupa PIN'); }, 500); break;
      case 'aNanti': tolak('sA'); break;
      case 'aPasang': pasang(); break;
      case 'aOk': el('sA').className = 'sheet'; break;
      case 'ikonTiada': el('sA').className = 'sheet'; panduan('android'); break;
      case 'pasangApp': if (ev) { pasangSheet(); } else panduan(jenisPeranti()); break;
      case 'pTutup': tutupPanduan(); break;
      case 'salinLink': salin(linkApp(), 'Link disalin. Tampal dalam Safari / Chrome.'); break;
      case 'zon': bukaZon(); break;
      case 'csCuba': muatCS(true); break;
      case 'windy': bukaWindy(); break;
      case 'wTutup': tutupWindy(); break;
      case 'lajuMula': lajuMula(); break;
      case 'zTutup': el('mZ').className = 'modal'; break;
      case 'zAsrama': simpanZon(''); break;
      case 'zSimpan': simpanZon(el('zZon').value); break;
    }
  });
  function pilihResitKilat() { var c = el('rsC'); c.classList.remove('kilat'); void c.offsetWidth; c.classList.add('kilat'); c.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  document.addEventListener('submit', function (e) {
    var f = e.target.getAttribute('data-form'); if (!f) return; e.preventDefault();
    if (f === 'masuk') masuk(); else if (f === 'daftar') daftar(); else if (f === 'pin') tukarPin(); else if (f === 'chat') hantar();
  });
  document.addEventListener('input', function (e) { if (e.target.hasAttribute('data-digit')) e.target.value = e.target.value.replace(/[^0-9]/g, ''); });
  el('rsF').addEventListener('change', function () { resit(this); });
  qa('.ri, #bOut').forEach(function (b) {
    // tooltip hanya untuk tetikus & papan kekunci; mouseenter pada skrin sentuh iPhone menyebabkan tekan dua kali
    b.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') tip(b); });
    b.addEventListener('pointerleave', function () { el('tip').className = 'tip'; });
    b.addEventListener('focus', function () { if (b.matches(':focus-visible')) tip(b, 1200); });
  });
  window.addEventListener('resize', function () { takuk(); kanta(); el('tip').className = 'tip'; });

  // ---------- UJI LAJU (@cloudflare/speedtest, dimuat hanya bila diperlukan) ----------
  // Maks ~22MB (turun 16.9MB + naik 4.8MB); sekali setiap 10 minit. Tiada log ke Cloudflare (logAimApiUrl null).
  var LJ = null, LJ_MEAS = [
    { type: 'latency', numPackets: 1 }, { type: 'download', bytes: 1e5, count: 1, bypassMinDuration: true }, { type: 'latency', numPackets: 20 },
    { type: 'download', bytes: 1e5, count: 8 }, { type: 'download', bytes: 1e6, count: 6 }, { type: 'upload', bytes: 1e5, count: 8 },
    { type: 'upload', bytes: 1e6, count: 4 }, { type: 'download', bytes: 1e7, count: 1 }
  ];
  function mbps(b) { return typeof b === 'number' && b > 0 ? b / 1e6 : null; }
  function f1(n) { return n === null || n === undefined ? '–' : n >= 100 ? String(Math.round(n)) : (Math.round(n * 10) / 10).toFixed(1); }
  function meter(v, fasa, unit) {
    var p = v ? Math.min(100, Math.sqrt(Math.min(v, 100) / 100) * 100) : 0; // skala punca kuasa: kelajuan rendah tetap nampak
    el('ljArka').style.strokeDashoffset = String(100 - p);
    teks(el('ljNom'), v === null || v === undefined ? '0' : f1(v)); teks(el('ljUnit'), unit || 'Mbps'); teks(el('ljFasa'), fasa);
  }
  function lajuBaki() { var t = +ls('bfx_laju_t') || 0, b = 600e3 - (Date.now() - t); return b > 0 ? Math.ceil(b / 60e3) : 0; }
  function lajuSej() {
    var L = []; try { L = JSON.parse(ls('bfx_laju_sej') || '[]'); } catch (e) {}
    var w = el('ljSej'); w.textContent = '';
    if (!L.length) return;
    var h = document.createElement('h4'); h.textContent = 'Ujian terakhir'; w.appendChild(h);
    L.forEach(function (x) { var d = document.createElement('p'), b = document.createElement('b'); b.textContent = '⬇ ' + f1(x.d) + ' · ⬆ ' + f1(x.u) + ' Mbps'; d.appendChild(b); d.appendChild(document.createTextNode(' ' + x.lok + (x.bilik ? ' ' + x.bilik : '') + ' · ' + jam(x.t))); w.appendChild(d); });
  }
  function lajuSedia() {
    if (!el('ljLok').value && ls('bfx_lok')) el('ljLok').value = ls('bfx_lok');
    if (!el('ljBilik').value && ls('bfx_bilik')) el('ljBilik').value = ls('bfx_bilik');
    var b = lajuBaki(), M = el('ljMsg');
    if (!LJ) { M.className = 'msg'; teks(M, b ? 'Uji semula dalam ' + b + ' minit.' : 'Ujian guna sedikit kuota (~25MB). Sekali setiap 10 minit.'); }
    lajuSej();
  }
  function lajuMula() {
    if (LJ) return;
    var M = el('ljMsg'), B = el('ljB'), lok = el('ljLok').value, bilik = el('ljBilik').value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 10);
    if (!lok) { M.className = 'msg'; teks(M, 'Pilih lokasi (blok) dahulu.'); el('ljLok').focus(); return; }
    ls('bfx_lok', lok); ls('bfx_bilik', bilik || null);
    var b = lajuBaki(); if (b) { M.className = 'msg'; teks(M, 'Uji laju sekali setiap 10 minit. Cuba lagi dalam ' + b + ' minit.'); return; }
    LJ = 1; B.disabled = true; teks(B, 'Menyemak…'); M.className = 'msg ok'; teks(M, '');
    var habis = function (t, ok) { LJ = null; B.disabled = false; teks(B, 'Uji Semula'); M.className = 'msg' + (ok ? ' ok' : ''); teks(M, t); };
    api({ a: 'laju', cek: 1 }, function (r) {
      if (!r.ok) { habis(r.msg || 'Tiada sambungan ke pelayan.'); return; }
      if (r.tunggu > 0) { ls('bfx_laju_t', String(Date.now() - (600 - r.tunggu) * 1000)); habis('Uji laju sekali setiap 10 minit. Cuba lagi dalam ' + Math.ceil(r.tunggu / 60) + ' minit.'); return; }
      teks(B, 'Memuat…');
      import('./speedtest.js').then(function (mod) {
        ls('bfx_laju_t', String(Date.now())); // dikira dari mula (ujian guna kuota walaupun terhenti)
        var E = new mod.default({ autoStart: false, logAimApiUrl: null, logMeasurementApiUrl: null, measureDownloadLoadedLatency: false, measureUploadLoadedLatency: false, measurements: LJ_MEAS });
        LJ = E; teks(B, 'Sedang menguji…'); meter(0, 'Ping');
        E.onResultsChange = function (p) {
          var R = E.results, d = mbps(R.getDownloadBandwidth()), u = mbps(R.getUploadBandwidth()), pi = R.getUnloadedLatency(), ji = R.getUnloadedJitter();
          teks(el('ljD'), f1(d)); teks(el('ljU'), f1(u)); teks(el('ljP'), pi ? String(Math.round(pi)) : '–'); teks(el('ljJ'), ji ? f1(ji) : '–');
          var t = p && p.type;
          if (t === 'upload') meter(u, 'Muat naik'); else if (t === 'download') meter(d, 'Muat turun'); else if (t === 'latency' && pi) meter(pi, 'Ping', 'ms');
        };
        E.onError = function (e) { habis('Ujian gagal: ' + String(e || 'ralat rangkaian').slice(0, 80)); };
        E.onFinish = function (R) {
          var d = mbps(R.getDownloadBandwidth()), u = mbps(R.getUploadBandwidth()), pi = R.getUnloadedLatency(), ji = R.getUnloadedJitter();
          meter(d, 'Selesai · muat turun');
          if (!d) { habis('Ujian tidak lengkap. Cuba lagi selepas 10 minit.'); return; }
          var x = { t: Date.now(), lok: lok, bilik: bilik, d: d, u: u || 0 }, L = [];
          try { L = JSON.parse(ls('bfx_laju_sej') || '[]'); } catch (e) {}
          L.unshift(x); ls('bfx_laju_sej', JSON.stringify(L.slice(0, 5))); lajuSej();
          habis('Siap. Menyimpan keputusan…', true);
          api({ a: 'laju', lok: lok, bilik: bilik, down: d, up: u || 0, ping: pi || 0, jitter: ji || 0 }, function (r) {
            M.className = 'msg' + (r.ok ? ' ok' : ''); teks(M, r.ok ? 'Keputusan disimpan. Terima kasih! Uji semula selepas 10 minit.' : (r.msg || 'Keputusan tidak dapat disimpan.'));
          }, 20000);
        };
        E.play();
      }).catch(function () { habis('Gagal memuat ujian. Semak sambungan internet.'); });
    }, 15000);
  }

  // ---------- pasang app ikut peranti ----------
  var ev = null;
  var baruTolak = Date.now() - (+ls('bfx_tolak') || 0) < 3 * 864e5; // popup keluar semula selepas 3 hari jika belum pasang
  var APP_URL = 'https://danialhykal32-ctrl.github.io/app/';
  function qMac() { return MAC ? '?mac=' + encodeURIComponent(MAC) + (IP ? '&ip=' + encodeURIComponent(IP) : '') : ''; }
  function linkApp() { return APP_URL + qMac(); }
  function intentChrome() { return 'intent://danialhykal32-ctrl.github.io/app/' + qMac() + '#Intent;scheme=https;package=com.android.chrome;end'; }
  function tolak(id) { el(id).className = 'sheet'; ls('bfx_tolak', String(Date.now())); }
  function pasangSheet() {
    teks(el('sAT'), 'Pasang BlackFox App?'); teks(el('sAP'), 'Buka terus dari skrin utama, penuh skrin, tanpa browser.');
    el('sAx').hidden = true;
    el('sAB').innerHTML = '<button data-act="aNanti">Nanti</button><button class="pri" data-act="aPasang">Pasang</button>';
    el('sA').className = 'sheet on';
  }
  function pasang() {
    el('sA').className = 'sheet';
    if (!ev) { panduan(jenisPeranti()); return; }
    ev.prompt();
    ev.userChoice.then(function (r) { if (r.outcome !== 'accepted') ls('bfx_tolak', String(Date.now())); ev = null; });
  }
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); ev = e; if (!dipasang && !baruTolak) setTimeout(pasangSheet, 2500); });
  // Chrome kadang-kadang keluarkan appinstalled tetapi WebAPK gagal dipasang (cth. Honor): jangan kata "dipasang ✓"
  window.addEventListener('appinstalled', function () {
    teks(el('sAT'), 'Sedang dipasang…'); teks(el('sAP'), 'Semak Home Screen dalam 1 minit.');
    el('sAx').hidden = false;
    el('sAB').innerHTML = '<button class="pri" data-act="aOk">OK</button>';
    el('sA').className = 'sheet on';
  });

  var K = function (t) { return '<span class="k">' + t + '</span>'; };
  var PANDUAN = {
    'ios-safari': { s: 'iPhone / iPad · Safari', v: 1, l: ['Tekan ' + K('&equiv;') + ' di bar alamat', 'Pilih <b>Share</b>', 'Tekan <b>View More</b>', 'Pilih <b>Add to Home Screen</b>', 'Tekan <b>Add</b>'] },
    'ios-lain': { s: 'Chrome / Edge / Firefox di iPhone', l: ['Tekan <b>Share</b> ' + K('⬆️') + ' di bar alamat', 'Pilih <b>Add to Home Screen</b>', 'Tekan <b>Add</b>'], n: 'Boleh pasang terus dari browser ini (iOS 16.4 ke atas).' },
    'ios-inapp': { t: 'Buka dalam Safari', s: 'Anda dalam browser dalam app (Telegram / WhatsApp / Instagram…). App tidak boleh dipasang dari sini.', l: ['Tekan ' + K('•••') + ' (atau ' + K('⬆️') + ') di penjuru skrin', 'Pilih <b>Open in Safari</b>', 'Dalam Safari, pasang app ke Home Screen'], n: 'Tiada pilihan itu? Tekan <b>Salin Link</b> dan tampal dalam Safari.', b: ['salin'] },
    'android-inapp': { t: 'Buka dalam Chrome', s: 'Browser dalam app (Telegram / WhatsApp / Instagram…) tidak boleh pasang app.', l: ['Tekan <b>Buka dalam Chrome</b> di bawah', 'Jika tidak terbuka: tekan ' + K('⋮') + ' → <b>Open in Chrome</b> / <b>Open in browser</b>'], b: ['chrome', 'salin'] },
    'android': { s: 'Android · Chrome', l: ['Tekan ' + K('⋮') + ' di penjuru kanan atas', 'Pilih <b>Add to Home screen</b> atau <b>Install app</b>', 'Pilih <b>Install</b> atau <b>Create shortcut</b> → <b>Add</b>'], n: 'Ikon tak keluar? Pastikan <b>Desktop site</b> TIDAK ditanda dalam menu ⋮. Honor / Huawei: Settings → Apps → Chrome → Permissions → benarkan <b>Home screen shortcuts</b>. Atau guna Microsoft Edge: ⋯ → <b>Add to phone</b>.' },
    'samsung': { s: 'Samsung Internet', l: ['Tekan ' + K('&equiv;') + ' di bawah kanan', 'Pilih <b>Add page to</b>', 'Pilih <b>Home screen</b> → <b>Add</b>'] },
    'firefox-android': { s: 'Firefox Android', l: ['Tekan ' + K('⋮'), 'Pilih <b>Install</b> atau <b>Add to Home screen</b>', 'Tekan <b>Add</b>'] },
    'laptop': { s: 'Laptop · Chrome / Edge', l: ['Klik ikon <b>Pasang</b> ' + K('⊕') + ' di hujung kanan bar alamat', 'Klik <b>Install</b>'], n: 'Tiada ikon? Chrome: ⋮ → Cast, save and share → <b>Install page as app</b>. Edge: ⋯ → Apps → <b>Install this site as an app</b>.' },
    'mac-safari': { s: 'Mac · Safari', l: ['Klik menu <b>File</b> di bar atas', 'Pilih <b>Add to Dock</b>', 'Klik <b>Add</b>'] },
    'lain': { s: 'Browser anda', l: ['Buka menu browser', 'Pilih <b>Add to Home screen</b> / <b>Install app</b>', 'Tekan <b>Add</b>'], n: 'Untuk hasil terbaik guna Safari (iPhone) atau Chrome (Android).' },
    'dipasang': { t: 'App sudah dipasang ✓', s: 'Anda sedang guna BlackFox App dari skrin utama.', l: [] }
  };
  function panduan(j) {
    var g = PANDUAN[j] || PANDUAN.lain, v = el('pVid');
    teks(el('mPT'), g.t || 'Pasang BlackFox App'); teks(el('mPS'), g.s || '');
    el('mPL').innerHTML = g.l.map(function (x) { return '<li>' + x + '</li>'; }).join('');
    el('mPN').hidden = !g.n; el('mPN').innerHTML = g.n || '';
    var B = '';
    (g.b || []).forEach(function (x) {
      if (x === 'chrome') B += '<a class="pri" href="' + intentChrome().replace(/&/g, '&amp;') + '">Buka dalam Chrome</a>';
      if (x === 'salin') B += '<button data-act="salinLink">Salin Link</button>';
    });
    el('mPB').innerHTML = B + '<button class="pri" data-act="pTutup">Dah faham</button>';
    el('mPV').hidden = !g.v;
    if (g.v && !v.getAttribute('src')) { v.muted = true; v.setAttribute('src', 'pasang-ios.mp4'); } // video dimuat hanya bila popup dibuka
    el('mP').className = 'modal on';
    if (g.v) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
  }
  function tutupPanduan() {
    var v = el('pVid'); el('mP').className = 'modal'; ls('bfx_tolak', String(Date.now()));
    if (v.getAttribute('src')) { v.pause(); v.removeAttribute('src'); v.load(); }
  }
  function autoPasang() {
    var j = jenisPeranti();
    if (j === 'dipasang') return;
    // dari butang "Pasang App" di status WiFi (?src=pasang) dalam Safari iPhone: terus tunjuk video pasang (abaikan tempoh 3 hari)
    if (j === 'ios-safari' && new URLSearchParams(location.search).get('src') === 'pasang') { history.replaceState(null, '', location.pathname); panduan(j); return; }
    if (baruTolak) return;
    if (j === 'android-inapp') { // cuba buka Chrome SEKALI, kemudian tunjuk panduan
      if (!ss('bfx_intent')) { ss('bfx_intent', '1'); location.href = intentChrome(); setTimeout(function () { if (!document.hidden) panduan(j); }, 1500); }
      else panduan(j);
      return;
    }
    if (j === 'ios-inapp') { // iOS 17+: cuba x-safari SEKALI; jika masih dalam app selepas 1.5s, tunjuk panduan
      if (iosVer >= 17 && !ss('bfx_xsaf')) { ss('bfx_xsaf', '1'); location.href = 'x-safari-' + linkApp(); setTimeout(function () { if (!document.hidden) panduan(j); }, 1500); }
      else panduan(j);
      return;
    }
    if (j === 'ios-safari' || j === 'ios-lain' || j === 'samsung' || j === 'mac-safari') panduan(j);
    // android / laptop Chrome: tunggu beforeinstallprompt. Tiada prompt = tiada popup (panduan manual di Profil).
  }
  // video belum ada / gagal dimuat: sorok kotak video, langkah teks kekal
  el('pVid').addEventListener('error', function () { if (this.getAttribute('src')) el('mPV').hidden = true; });
  // ---------- versi baru: notis "Kemas kini" (SW baru menunggu, tekan sekali -> skipWaiting + muat semula) ----------
  var SWW = null, mahuMuat = false;
  function kemaskini() {
    el('versi').hidden = true; mahuMuat = true;
    if (SWW) SWW.postMessage({ t: 'skip' });
    setTimeout(function () { location.reload(); }, 3000); // sandaran jika controllerchange tidak berlaku
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', function () { if (mahuMuat) { mahuMuat = false; location.reload(); } });
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(function (reg) {
      function sedia(w) { if (!w || !navigator.serviceWorker.controller) return; SWW = w; el('versi').hidden = false; } // tiada notis pada pasangan pertama
      if (reg.waiting) sedia(reg.waiting);
      reg.addEventListener('updatefound', function () { var w = reg.installing; if (w) w.addEventListener('statechange', function () { if (w.state === 'installed') sedia(w); }); });
      document.addEventListener('visibilitychange', function () { if (!document.hidden) reg.update().catch(function () {}); }); // semak bila app dibuka semula
      setInterval(function () { reg.update().catch(function () {}); }, 30 * 60e3);
    }).catch(function () {});
  }

  // ---------- waktu solat & cuaca (zon dalam phone SAHAJA, tiada GPS) ----------
  var ZON = {
    'Johor': [['JHR01', 'Pulau Aur dan Pulau Pemanggil'], ['JHR02', 'Johor Bahru, Kota Tinggi, Mersing, Kulai'], ['JHR03', 'Kluang, Pontian'], ['JHR04', 'Batu Pahat, Muar, Segamat, Gemas Johor, Tangkak']],
    'Kedah': [['KDH01', 'Kota Setar, Kubang Pasu, Pokok Sena (Daerah Kecil)'], ['KDH02', 'Kuala Muda, Yan, Pendang'], ['KDH03', 'Padang Terap, Sik'], ['KDH04', 'Baling'], ['KDH05', 'Bandar Baharu, Kulim'], ['KDH06', 'Langkawi'], ['KDH07', 'Puncak Gunung Jerai']],
    'Kelantan': [['KTN01', 'Bachok, Kota Bharu, Machang, Pasir Mas, Pasir Puteh, Tanah Merah, Tumpat, Kuala Krai, Mukim Chiku'], ['KTN02', 'Gua Musang (Daerah Galas Dan Bertam), Jeli, Jajahan Kecil Lojing']],
    'Melaka': [['MLK01', 'Seluruh Negeri Melaka']],
    'Negeri Sembilan': [['NGS01', 'Tampin, Jempol'], ['NGS02', 'Jelebu, Kuala Pilah, Rembau'], ['NGS03', 'Port Dickson, Seremban']],
    'Pahang': [['PHG01', 'Pulau Tioman'], ['PHG02', 'Kuantan, Pekan, Muadzam Shah'], ['PHG03', 'Jerantut, Temerloh, Maran, Bera, Chenor, Jengka'], ['PHG04', 'Bentong, Lipis, Raub'], ['PHG05', 'Genting Sempah, Janda Baik, Bukit Tinggi'], ['PHG06', 'Cameron Highlands, Genting Higlands, Bukit Fraser'], ['PHG07', 'Zon Khas Daerah Rompin (Mukim Rompin, Mukim Endau, Mukim Pontian)']],
    'Perlis': [['PLS01', 'Kangar, Padang Besar, Arau']],
    'Pulau Pinang': [['PNG01', 'Seluruh Negeri Pulau Pinang']],
    'Perak': [['PRK01', 'Tapah, Slim River, Tanjung Malim'], ['PRK02', 'Kuala Kangsar, Sg. Siput, Ipoh, Batu Gajah, Kampar'], ['PRK03', 'Lenggong, Pengkalan Hulu, Grik'], ['PRK04', 'Temengor, Belum'], ['PRK05', 'Kg Gajah, Teluk Intan, Bagan Datuk, Seri Iskandar, Beruas, Parit, Lumut, Sitiawan, Pulau Pangkor'], ['PRK06', 'Selama, Taiping, Bagan Serai, Parit Buntar'], ['PRK07', 'Bukit Larut']],
    'Sabah': [['SBH01', 'Bahagian Sandakan (Timur), Bukit Garam, Semawang, Temanggong, Tambisan, Bandar Sandakan, Sukau'], ['SBH02', 'Beluran, Telupid, Pinangah, Terusan, Kuamut, Bahagian Sandakan (Barat)'], ['SBH03', 'Lahad Datu, Silabukan, Kunak, Sahabat, Semporna, Tungku, Bahagian Tawau (Timur)'], ['SBH04', 'Bandar Tawau, Balong, Merotai, Kalabakan, Bahagian Tawau (Barat)'], ['SBH05', 'Kudat, Kota Marudu, Pitas, Pulau Banggi, Bahagian Kudat'], ['SBH06', 'Gunung Kinabalu'], ['SBH07', 'Kota Kinabalu, Ranau, Kota Belud, Tuaran, Penampang, Papar, Putatan, Bahagian Pantai Barat'], ['SBH08', 'Pensiangan, Keningau, Tambunan, Nabawan, Bahagian Pendalaman (Atas)'], ['SBH09', 'Beaufort, Kuala Penyu, Sipitang, Tenom, Long Pasia, Membakut, Weston, Bahagian Pendalaman (Bawah)']],
    'Selangor': [['SGR01', 'Gombak, Petaling, Sepang, Hulu Langat, Hulu Selangor, S.Alam'], ['SGR02', 'Kuala Selangor, Sabak Bernam'], ['SGR03', 'Klang, Kuala Langat']],
    'Sarawak': [['SWK01', 'Limbang, Lawas, Sundar, Trusan'], ['SWK02', 'Miri, Niah, Bekenu, Sibuti, Marudi'], ['SWK03', 'Pandan, Belaga, Suai, Tatau, Sebauh, Bintulu'], ['SWK04', 'Sibu, Mukah, Dalat, Song, Igan, Oya, Balingian, Kanowit, Kapit'], ['SWK05', 'Sarikei, Matu, Julau, Rajang, Daro, Bintangor, Belawai'], ['SWK06', 'Lubok Antu, Sri Aman, Roban, Debak, Kabong, Lingga, Engkelili, Betong, Spaoh, Pusa, Saratok'], ['SWK07', 'Serian, Simunjan, Samarahan, Sebuyau, Meludam'], ['SWK08', 'Kuching, Bau, Lundu, Sematan'], ['SWK09', 'Zon Khas (Kampung Patarikan)']],
    'Terengganu': [['TRG01', 'Kuala Terengganu, Marang, Kuala Nerus'], ['TRG02', 'Besut, Setiu'], ['TRG03', 'Hulu Terengganu'], ['TRG04', 'Dungun, Kemaman']],
    'Wilayah Persekutuan': [['WLY01', 'Kuala Lumpur, Putrajaya'], ['WLY02', 'Labuan']]
  };
  var ZNAMA = {}, CS = null;
  Object.keys(ZON).forEach(function (n) { ZON[n].forEach(function (z) { ZNAMA[z[0]] = [n, z[1]]; }); });
  var ASRAMA = 'NGS01', LIMA = ['Subuh', 'Zohor', 'Asar', 'Maghrib', 'Isyak'];
  var HIJRI = ['Muharram', 'Safar', 'Rabiulawal', 'Rabiulakhir', 'Jamadilawal', 'Jamadilakhir', 'Rejab', 'Syaaban', 'Ramadan', 'Syawal', 'Zulkaedah', 'Zulhijjah'];
  function zonKini() { var z = ls('bfx_zon'); return ZNAMA[z] ? z : ASRAMA; }
  function zonPendek(z) { var n = ZNAMA[z]; return /^Seluruh Negeri/.test(n[1]) ? n[0] : n[1].split(', ').slice(0, 2).join(', '); }
  function dua(n) { return (n < 10 ? '0' : '') + n; }
  function myt() { return new Date(Date.now() + 8 * 3600e3); }
  function hariIni() { var d = myt(); return dua(d.getUTCDate()) + '/' + dua(d.getUTCMonth() + 1) + '/' + d.getUTCFullYear(); }
  function minit(hm) { var m = String(hm || '').match(/(\d{1,2}):(\d{2})/); return m ? +m[1] * 60 + +m[2] : -1; }
  function jam(t) { var d = new Date(t + 8 * 3600e3); return dua(d.getUTCHours()) + ':' + dua(d.getUTCMinutes()); }
  function tempoh(m) { var j = Math.floor(m / 60), n = m % 60; return j ? j + 'j ' + n + 'm' : n + 'm'; }
  function csSimpan(z, o) { ls('bfx_cs_' + z, JSON.stringify(o)); }
  function csBaca(z) { try { return JSON.parse(ls('bfx_cs_' + z) || 'null'); } catch (e) { return null; } }
  // Muat solat & cuaca SATU zon. Cache phone dipapar serta-merta; tiada cache = rangka "Memuatkan…".
  // Respons lama (zon lain / permintaan lama) diabaikan. Tamat masa 15s, cuba semula sekali automatik.
  var CSQ = 0, CSM = false, CSJ = {};
  function ambilCS(z, cb) { // satu permintaan setiap zon pada satu masa; respons diberi kepada semua yang menunggu
    if (CSJ[z]) { CSJ[z].push(cb); return; }
    CSJ[z] = [cb];
    var siap = function (o) { var L = CSJ[z] || []; delete CSJ[z]; L.forEach(function (f) { f(o); }); };
    var cuba = function (n) {
      api({ a: 'cuaca', zon: z }, function (r) {
        var adaC = r.ok && r.cuaca && r.cuaca.ok, adaS = r.ok && r.solat && r.solat.ok;
        if (!adaC && !adaS && n < 1) { cuba(n + 1); return; } // cuba semula sekali sebelum papar gagal
        var o = csBaca(z) || {}, now = Date.now();
        if (adaC) { o.c = r.cuaca; o.c.t = now; }
        if (adaS) { o.s = r.solat; o.s.t = now; }
        o.gagal = !(adaC && adaS);
        if (adaC || adaS) csSimpan(z, o);
        siap(o);
      }, 15000);
    };
    cuba(0);
  }
  function muatCS(paksa) {
    var z = zonKini(), lama = csBaca(z), sq = ++CSQ;
    teks(el('zonN'), zonPendek(z)); teks(el('zonN2'), zonPendek(z));
    var segar = lama && lama.c && lama.s && Date.now() - lama.c.t < 15 * 60e3 && lama.s.tarikh === hariIni();
    CSM = !(segar && !paksa);
    CS = lama; paparCS();
    if (!CSM) return;
    ambilCS(z, function (o) {
      if (sq !== CSQ || z !== zonKini()) return; // abaikan respons yang bukan zon semasa
      CSM = false; CS = o; paparCS();
    });
  }
  // Prefetch zon asrama (NGS01) semasa app dibuka supaya "Kembali ke Asrama" terus ada data
  function prefetchAsrama() {
    var o = csBaca(ASRAMA);
    if (zonKini() !== ASRAMA && !(o && o.c && Date.now() - o.c.t < 15 * 60e3 && o.s && o.s.tarikh === hariIni())) ambilCS(ASRAMA, function () {});
  }
  function rangka(id, n) { var e = el(id); e.textContent = ''; for (var i = 0; i < n; i++) { var s = document.createElement('span'); s.className = 'sk'; e.appendChild(s); } }
  function paparCS() {
    var o = CS || {}, s = o.s, c = o.c;
    el('pg-utama').querySelector('.c-solat').classList.toggle('memuat', !s && CSM);
    el('pg-utama').querySelector('.c-cuaca').classList.toggle('memuat', !c && CSM);
    // waktu solat
    var W = el('sWaktu'); W.textContent = '';
    if (s && s.w) {
      var now = myt(), kini = now.getUTCHours() * 60 + now.getUTCMinutes(), basi = s.tarikh !== hariIni();
      var L = s.w.filter(function (x) { return LIMA.indexOf(x[0]) >= 0; }), nx = -1;
      if (!basi) for (var i = 0; i < L.length; i++) if (minit(L[i][1]) > kini) { nx = i; break; }
      L.forEach(function (x, i) {
        var e = document.createElement('span'); e.className = basi ? '' : (i === nx ? 'kini' : (nx < 0 || i < nx ? 'lalu' : ''));
        e.appendChild(document.createTextNode(x[0])); var b = document.createElement('b'); b.textContent = x[1]; e.appendChild(b); W.appendChild(e);
      });
      var N = el('sNext'); N.textContent = '';
      if (basi) N.textContent = 'Mengemas kini waktu hari ini…';
      else {
        var nama = nx < 0 ? 'Subuh' : L[nx][0], baki = nx < 0 ? minit(s.esok) + 1440 - kini : minit(L[nx][1]) - kini;
        var em = document.createElement('em'); em.textContent = nama; N.appendChild(em); N.appendChild(document.createTextNode(' dalam ' + tempoh(baki)));
      }
      var h = String(s.hijri || '').match(/(\d{4})-(\d{2})-(\d{2})/);
      teks(el('sHijri'), h ? (+h[3]) + ' ' + HIJRI[+h[2] - 1] + ' ' + h[1] + 'H' : '');
    } else if (CSM) { rangka('sWaktu', 5); teks(el('sNext'), 'Memuatkan…'); teks(el('sHijri'), ''); }
    else { teks(el('sNext'), '-'); teks(el('sHijri'), ''); }
    upd('sUpd', s, o.gagal);
    // cuaca
    var A = el('cAmaran'), R = el('cRamal'), J = el('cJam'); A.textContent = ''; J.textContent = '';
    if (c) {
      el('cIk').innerHTML = IC['w_' + c.ikon] || IC.w_awan;
      var su = el('cSuhu');
      su.textContent = c.suhu !== undefined && c.suhu !== null ? c.suhu + '°' : c.min + '–' + c.max + '°';
      var sm = document.createElement('small'); sm.textContent = 'C'; su.appendChild(sm);
      teks(el('cDesc'), c.desc + (c.bila && !/tiada/i.test(c.desc) ? ' (' + String(c.bila).toLowerCase() + ')' : ''));
      var p = [c.lokasi || ''];
      if (c.min !== undefined && c.max !== undefined && c.suhu !== undefined) p.push(c.min + '–' + c.max + '°C');
      if (typeof c.lembap === 'number') p.push('Lembap ' + c.lembap + '%');
      teks(el('cHujan'), p.filter(Boolean).join(' · '));
      (c.amaran || []).forEach(function (a) { var b = document.createElement('b'); b.textContent = '⚠️ ' + a.tajuk; var t = document.createElement('span'); t.textContent = a.teks; A.appendChild(b); A.appendChild(t); });
      A.hidden = !(c.amaran && c.amaran.length);
      R.hidden = !c.ramal; teks(R, c.ramal ? '🕒 ' + c.ramal : '');
      (c.jam || []).forEach(function (x) { var d = document.createElement('span'), h = x.h % 12 || 12; d.innerHTML = '<small></small><i></i><b></b>'; teks(d.firstChild, h + (x.h < 12 ? 'pg' : 'ptg')); d.children[1].innerHTML = IC['w_' + x.ik] || IC.w_awan; teks(d.lastChild, x.t + '°'); J.appendChild(d); });
      el('cWU').href = c.wu || 'https://www.wunderground.com/';
    } else {
      el('cIk').innerHTML = ''; teks(el('cSuhu'), CSM ? '' : '-'); teks(el('cDesc'), CSM ? 'Memuatkan…' : '-'); teks(el('cHujan'), ''); A.hidden = true; R.hidden = true;
      if (CSM) rangka('cJam', 6);
    }
    upd('cUpd', c, o.gagal, c && c.norway ? 'Data: MET Norway' : '');
  }
  function upd(id, d, gagal, kredit) {
    var e = el(id); e.textContent = '';
    if (!d) {
      if (CSM) { e.className = 'upd'; e.textContent = 'Memuatkan…'; return; }
      e.className = 'upd bad'; e.textContent = 'Data tidak tersedia · ';
      var b = document.createElement('button'); b.className = 'cuba'; b.setAttribute('data-act', 'csCuba'); b.textContent = 'Cuba lagi'; e.appendChild(b); return;
    }
    e.className = 'upd' + (gagal && !CSM ? ' bad' : '');
    e.textContent = (CSM ? 'Mengemas kini… · ' : '') + 'Dikemas kini ' + jam(d.t) + (gagal && !CSM ? ' · data terakhir (tiada sambungan)' : '') + (d.sumber ? ' · ' + d.sumber : '') + (kredit && !/Norway/.test(d.sumber || '') ? ' · ' + kredit : '');
  }
  // Peta Windy: iframe dimuat hanya bila dibuka, dibuang bila ditutup (jimat kuota)
  function bukaWindy() {
    var c = (CS && CS.c) || {}, z = ZNAMA[zonKini()], la = c.lat || 2.53, lo = c.lon || 102.4, f = document.createElement('iframe');
    f.src = 'https://embed.windy.com/embed2.html?lat=' + la + '&lon=' + lo + '&detailLat=' + la + '&detailLon=' + lo + '&zoom=8&level=surface&overlay=rain&product=ecmwf&menu=&message=true&marker=true&calendar=now&type=map&location=coordinates&metricWind=km%2Fh&metricTemp=%C2%B0C';
    f.title = 'Peta Windy ' + (z ? z[1] : ''); f.setAttribute('loading', 'lazy'); f.setAttribute('referrerpolicy', 'no-referrer');
    var w = el('wFr'); w.textContent = ''; w.appendChild(f);
    el('mW').className = 'modal on';
  }
  function tutupWindy() { el('mW').className = 'modal'; el('wFr').textContent = ''; }
  function bukaZon() {
    var z = zonKini(), N = el('zNeg');
    if (!N.options.length) Object.keys(ZON).forEach(function (n) { var o = document.createElement('option'); o.value = n; o.textContent = n; N.appendChild(o); });
    N.value = ZNAMA[z][0]; isiZon(z);
    el('mZ').className = 'modal on';
  }
  function isiZon(pilih) {
    var Z = el('zZon'); Z.textContent = '';
    ZON[el('zNeg').value].forEach(function (x) { var o = document.createElement('option'); o.value = x[0]; o.textContent = x[0] + ' · ' + x[1]; Z.appendChild(o); });
    if (pilih && ZNAMA[pilih] && ZNAMA[pilih][0] === el('zNeg').value) Z.value = pilih;
  }
  function simpanZon(z) {
    if (z && z !== ASRAMA) ls('bfx_zon', z); else ls('bfx_zon', null);
    el('mZ').className = 'modal'; toast('📍 ' + zonPendek(zonKini()));
    muatCS(true);
  }
  el('zNeg').addEventListener('change', function () { isiZon(); });
  setInterval(function () { if (CS) { if (CS.s && CS.s.tarikh !== hariIni()) muatCS(true); else paparCS(); } }, 30000); // kiraan masa setiap minit
  setInterval(function () { if (AK && !document.hidden) muatCS(true); }, 15 * 60e3); // cuaca setiap 15 minit
  document.addEventListener('visibilitychange', function () {
    if (document.hidden || !AK) return;
    var c = CS && CS.c; muatCS(!c || Date.now() - c.t > 2 * 60e3);
  });

  // ---------- mula ----------
  (function () {
    var c = window.CSS && CSS.supports;
    if (!(c && (CSS.supports('backdrop-filter', 'blur(1px)') || CSS.supports('-webkit-backdrop-filter', 'blur(1px)')))) document.documentElement.className += ' nob';
    // MAC & IP dari portal sahaja (format ditapis)
    var q = new URLSearchParams(location.search), mac = String(q.get('mac') || '').toUpperCase(), ip = String(q.get('ip') || '');
    if (/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/.test(mac)) { MAC = mac; ls('bfx_mac', MAC); } else MAC = /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/.test(ls('bfx_mac') || '') ? ls('bfx_mac') : '';
    if (/^192\.168\.88\.\d{1,3}$/.test(ip)) { IP = ip; ls('bfx_ip', IP); } else IP = /^192\.168\.88\.\d{1,3}$/.test(ls('bfx_ip') || '') ? ls('bfx_ip') : '';
    if (q.get('mac')) ss('bfx_wifi', '1'); // dibuka dari halaman WiFi -> tunjuk butang Keluar ke WiFi
    var bayar = q.get('bayar') ? String(q.get('status_id') || '0') : '';
    if (q.get('mac') || q.get('ip') || q.get('bayar')) history.replaceState(null, '', location.pathname + (q.get('src') ? '?src=' + encodeURIComponent(q.get('src')) : ''));
    ikon(); binaPakej(); kalendar();
    // Auto sambung WiFi: dibuka dari portal (ada mac) + sudah log masuk + pakej aktif -> SEKALI sahaja (tiada loop)
    var dariPortal = !!(MAC && q.get('mac')) && q.get('src') !== 'status';
    var autoWifi = function (a) {
      if (!dariPortal || !a || !a.aktif) return;
      var k = (ls('bfx_auto') || '').split('|');
      if (k[0] === MAC && Date.now() - (+k[1] || 0) < 30 * 60e3) return;
      ls('bfx_auto', MAC + '|' + Date.now()); dariPortal = false;
      toast('Menyambung WiFi…'); teks(el('bSambung').querySelector('span'), 'Menyambung WiFi…');
      setTimeout(function () { sambung(true); }, 1200);
    };
    var t = ls('bfx_t');
    if (t) {
      // Log masuk kekal: terus ke dashboard (data terakhir dalam phone), kemudian segarkan dari server
      TOK = t;
      var ak0 = null; try { ak0 = JSON.parse(ls('bfx_ak') || 'null'); } catch (e) {}
      if (ak0) { setAk(ak0); tunjukDash(); } else el('muat').className = 'muat on';
      api({ a: 'akaun' }, function (r) {
        el('muat').className = 'muat';
        if (r.ok) { setAk(r.akaun); if (!ak0) tunjukDash(); if (bayar) tungguBayaran(bayar); else autoWifi(r.akaun); return; }
        if (r.keluar || !TOK) { el('vDash').className = 'view'; el('vAuth').className = 'view on'; return; }
        if (!ak0) { el('vAuth').className = 'view on'; toast(r.msg || 'Tiada sambungan. Cuba lagi.'); }
      });
    } else { el('vAuth').className = 'view on'; api({ a: 'info' }, function () {}); }
    setTimeout(autoPasang, 2500);
    setInterval(function () { api({ a: 'info' }, function () {}); }, 60000);
    setInterval(function () { if (TOK && !document.hidden) api({ a: 'akaun' }, function (r) { if (r.ok) setAk(r.akaun); }); }, 180000);
  })();
})();
