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
    alert: P('<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>')
  };
  function ikon(r) { qa('i[data-ic]', r).forEach(function (i) { if (!i.firstChild && IC[i.getAttribute('data-ic')]) i.innerHTML = IC[i.getAttribute('data-ic')]; }); }

  // ---------- API ----------
  function api(req, cb) {
    req.token = TOK; req.mac = MAC; req.ip = IP;
    var ctl = window.AbortController ? new AbortController() : null, t = ctl && setTimeout(function () { ctl.abort(); }, 45000);
    fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ api: 1, req: req }), redirect: 'follow', signal: ctl ? ctl.signal : undefined })
      .then(function (r) { return r.json(); })
      .then(function (r) { clearTimeout(t); r = r || {}; if (r.keluar && TOK) keluar(); if (r.info) setInfo(r.info); cb(r); })
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
    var c = document.querySelector('.c-talian'); if (c) c.className = 'card a c-talian' + (i.up ? '' : ' down');
    teks(el('tChip'), i.up ? 'Online' : 'Gangguan');
    teks(el('tSejak'), i.up ? 'Talian asrama normal' : 'Terganggu sejak ' + i.sejak);
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
    var m = el('lm').value, p = el('lp').value;
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
    el('vAuth').className = 'view'; el('vDash').className = 'view on';
    var rl = el('rail'); rl.classList.remove('mula'); void rl.offsetWidth; rl.classList.add('mula');
    PG = ''; go('utama');
  }
  function keluar() {
    var tetamu = !TOK;
    TOK = ''; AK = null; PROF = null; TG = null; ls('bfx_t', null);
    document.body.classList.remove('tetamu');
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
      kira(baru);
      if (pg === 'tg') muatTg();
      if (pg === 'profil') muatProfil();
      if (pg === 'ai') mulaChat();
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
    t.style.left = (r.right + 12) + 'px'; t.style.top = (r.top + r.height / 2 - 13) + 'px';
    t.className = 'tip on'; clearTimeout(tip.t);
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
  function setAk(a) {
    AK = a;
    var nama = String(a.nama || a.m), depan = nama.split(' ')[0], hari = hariLagi(a), pt = a.kuota > 0 ? Math.max(0, Math.min(1, a.guna / a.kuota)) : 0;
    var h = el('salam'); h.removeAttribute('data-w'); h.textContent = 'Assalamualaikum, ' + depan.charAt(0).toUpperCase() + depan.slice(1).toLowerCase();
    teks(el('bsub'), a.ada ? (a.aktif ? 'Pelan ' + a.pelan + ' aktif sehingga ' + String(a.tamat).slice(0, 10) + '. Sambung WiFi FOX ULTRA 5G dan tekan Sambung WiFi.' : 'Pelan anda telah tamat. Pilih pakej baharu untuk teruskan.') : 'Belum ada pelan. Pilih pakej atau ambil percuma 5GB untuk mula.');
    letak('tKuota', a.ada ? a.kuota : 0); letak('tHari', a.ada ? hari : 0); letak('tPer', a.peranti || 1);
    teks(el('xp'), a.ada ? a.pelan : 'Tiada pelan'); teks(el('xt'), a.ada ? 'Tamat ' + String(a.tamat).slice(0, 10) : '-');
    letak('qb', a.ada ? a.baki : 0, '<small>GB</small>');
    el('sg1').parentNode.style.flexBasis = Math.max(6, pt * 100) + '%'; el('sg2').parentNode.style.flexBasis = Math.max(6, (1 - pt) * 100) + '%';
    teks(el('pg1'), Math.round(pt * 100) + '% guna'); teks(el('pg2'), Math.round((1 - pt) * 100) + '% baki');
    statistik();
    letak('st3', a.peranti || 1); letak('st4', a.ada ? hari : 0);
    el('bFree').hidden = !(!a.ada && INFO && INFO.percuma);
    promo(a); kalendar(); notif(); pakejPanel(); profilAsas();
    if (PG) kira(el('pg-' + PG));
  }
  function statistik() {
    var a = AK; if (!a) return;
    qa('.tog button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-st') === STM); });
    if (STM === 'kuota') { letak('st1', a.ada ? a.guna : 0); letak('st2', a.ada ? a.baki : 0); teks(el('stl'), 'GB telah guna · GB baki'); }
    else { var h = hariLagi(a), jum = a.pelan === 'Kilat 1 Jam' || a.pelan === 'Percuma 1 Hari' ? 1 : 30; letak('st1', a.ada ? Math.max(0, jum - h) : 0); letak('st2', a.ada ? h : 0); teks(el('stl'), 'hari berlalu · hari berbaki'); }
  }
  function promo(a) {
    var c = document.querySelector('.c-promo'), b = el('prB'), cd = a && a.cadangan && INFO && INFO.jual !== false ? a.cadangan : null;
    c.classList.toggle('ai', !!cd);
    if (cd) { teks(el('prT'), 'Cadangan BlackFox AI'); teks(el('prP'), cd.t); b.removeAttribute('data-pg'); b.setAttribute('data-beli', cd.k || ''); teks(b.querySelector('span'), cd.l || 'Lihat Pakej'); if (!cd.k) { b.removeAttribute('data-beli'); b.setAttribute('data-pg', 'pakej'); } }
    else { teks(el('prT'), a && !a.ada ? 'Mula Dengan Pakej' : 'Tambah Kuota Bila Perlu'); teks(el('prP'), a && !a.ada ? 'Saver 110GB RM17 sebulan, atau cuba percuma 5GB.' : 'Add-on dari RM10. Aktif automatik selepas bayar.'); b.removeAttribute('data-beli'); b.setAttribute('data-pg', 'pakej'); teks(b.querySelector('span'), 'Lihat Pakej'); }
  }
  function kalendar() {
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
    var n = el('notif'); n.textContent = '';
    var F = L.filter(function (x) { return NT === 'semua' || x.j === NT; });
    if (!F.length) { var k = document.createElement('div'); k.className = 'kosong'; k.textContent = 'Tiada notifikasi baharu.'; n.appendChild(k); return; }
    F.forEach(function (x, idx) {
      var d = document.createElement('div'); d.className = 'ni ' + x.c; d.style.animationDelay = (idx * 60) + 'ms';
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
      var u = r.url;
      if (MAC) u = 'http://192.168.88.1/login?username=' + encodeURIComponent('T-' + MAC) + '&dst=' + encodeURIComponent(r.url);
      location.href = u;
    });
  }
  function sambung() {
    var b = el('bSambung'), s = b.querySelector('span'); teks(s, 'Menyediakan…');
    api({ a: 'sambung' }, function (r) { teks(s, 'Sambung WiFi'); if (!r.ok) { toast(r.msg || 'Gagal.'); return; } location.href = r.url; });
  }
  function percuma() { toast('Mengaktifkan…'); api({ a: 'percuma' }, function (r) { toast(r.ok ? 'Percuma 5GB diaktifkan!' : (r.msg || 'Gagal.')); if (r.akaun) setAk(r.akaun); }); }

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
        api({ a: 'resit', img: d, mime: 'image/jpeg' }, function (r) { el('rsB').disabled = false; M.className = 'msg' + (r.ok ? ' ok' : ''); M.textContent = r.msg || ''; if (r.akaun) setAk(r.akaun); });
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
    teks(el('mTgS'), TG.linked ? 'Disambung ✓' : 'Notis · PIN · AI');
  }
  function salin(t) {
    try { navigator.clipboard.writeText(t).then(function () { toast('Kod disalin'); }, function () { toast(t); }); }
    catch (e) { toast(t); }
  }

  // ---------- Tanya AI ----------
  function tambah(w, t) { var d = document.createElement('div'); d.className = 'b ' + w; d.textContent = t; el('log').appendChild(d); el('log').scrollTop = 99999; return d; }
  function mulaChat() { if (!el('log').children.length) tambah('a', 'Hai! Saya BlackFox AI 🦊 Tanya apa sahaja tentang WiFi asrama: kuota, PIN, sambungan, bayaran.'); setTimeout(function () { if (matchMedia('(hover:hover)').matches) el('cq').focus(); }, 400); }
  function hantar(q) {
    var t = q || el('cq').value; if (!t) return; el('cq').value = ''; tambah('u', t);
    var w = document.createElement('div'); w.className = 'b a'; w.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>'; el('log').appendChild(w); el('log').scrollTop = 99999;
    api({ a: 'chat', msg: t, m: AK ? AK.m : el('lm').value }, function (r) {
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
  function muatProfil() { paparProfil(); api({ a: 'profil' }, function (r) { if (!r.ok) return; PROF = r.profil; if (TG) TG.linked = TG.linked || PROF.telegram; paparProfil(); }); }
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
      var d = document.createElement('div'); d.className = 'ni' + (i ? '' : ' or'); d.style.animationDelay = (i * 60) + 'ms';
      d.innerHTML = '<span class="nic"><i data-ic="receipt"></i></span><div><b></b><p></p></div><span class="tg"></span>';
      teks(d.querySelector('b'), 'Beli ' + x.p); teks(d.querySelector('p'), x.t); teks(d.querySelector('.tg'), 'RM' + x.rm); A.appendChild(d);
    });
    ikon(A);
    kira(el('pg-profil'));
  }

  // ---------- peristiwa ----------
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act],[data-pg],[data-beli],[data-st],[data-nt],[data-f],.qk button');
    if (!t) return;
    if (t.matches('.qk button')) { hantar(t.textContent); return; }
    if (t.hasAttribute('data-beli')) { e.preventDefault(); beli(t.getAttribute('data-beli')); return; }
    if (t.hasAttribute('data-st')) { STM = t.getAttribute('data-st'); statistik(); kira(document.querySelector('.c-stat')); return; }
    if (t.hasAttribute('data-nt')) { NT = t.getAttribute('data-nt'); qa('#nTabs button').forEach(function (b) { b.classList.toggle('on', b === t); }); notif(); return; }
    if (t.hasAttribute('data-f')) { tapis(t.getAttribute('data-f')); return; }
    var act = t.getAttribute('data-act');
    if (t.hasAttribute('data-pg') && !act) { e.preventDefault(); go(t.getAttribute('data-pg')); if (t.classList.contains('ri') && matchMedia('(hover:none)').matches) tip(t, 900); return; }
    if (!act) return;
    e.preventDefault();
    switch (act) {
      case 'tab0': tab(0); break;
      case 'tab1': tab(1); break;
      case 'keluar': keluar(); break;
      case 'sambung': sambung(); break;
      case 'percuma': percuma(); break;
      case 'resit': if (PG !== 'pakej') go('pakej'); pilihResit(); break;
      case 'resitPg': go('pakej'); setTimeout(pilihResitKilat, 700); break;
      case 'mgL': MG--; kalendar(); break;
      case 'mgR': MG++; kalendar(); break;
      case 'salinKod': salin(el('tgK').textContent); break;
      case 'aiLupa': document.body.classList.add('tetamu'); el('vAuth').className = 'view'; el('vDash').className = 'view on'; PG = ''; go('ai'); setTimeout(function () { hantar('Saya lupa PIN'); }, 500); break;
      case 'aNanti': tolak('sA'); break;
      case 'aPasang': pasang(); break;
      case 'iOk': tolak('sI'); break;
    }
  });
  function pilihResitKilat() { var c = el('rsC'); c.classList.remove('kilat'); void c.offsetWidth; c.classList.add('kilat'); c.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  document.addEventListener('submit', function (e) {
    var f = e.target.getAttribute('data-form'); if (!f) return; e.preventDefault();
    if (f === 'masuk') masuk(); else if (f === 'daftar') daftar(); else if (f === 'pin') tukarPin(); else if (f === 'chat') hantar();
  });
  document.addEventListener('input', function (e) { if (e.target.hasAttribute('data-digit')) e.target.value = e.target.value.replace(/[^0-9]/g, ''); });
  el('rsF').addEventListener('change', function () { resit(this); });
  qa('.ri').forEach(function (b) {
    b.addEventListener('mouseenter', function () { tip(b); });
    b.addEventListener('mouseleave', function () { el('tip').className = 'tip'; });
    b.addEventListener('focus', function () { tip(b, 1200); });
  });
  window.addEventListener('resize', function () { takuk(); el('tip').className = 'tip'; });

  // ---------- pasang app (PWA) ----------
  var ev = null;
  var dipasang = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  var baruTolak = Date.now() - (+ls('bfx_tolak') || 0) < 3 * 864e5;
  function tolak(id) { el(id).className = 'sheet'; ls('bfx_tolak', String(Date.now())); }
  function pasang() { el('sA').className = 'sheet'; if (ev) { ev.prompt(); ev.userChoice.then(function (r) { if (r.outcome !== 'accepted') ls('bfx_tolak', String(Date.now())); ev = null; }); } }
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); ev = e; if (!dipasang && !baruTolak) setTimeout(function () { el('sA').className = 'sheet on'; }, 2500); });
  window.addEventListener('appinstalled', function () { el('sA').className = 'sheet'; toast('BlackFox App dipasang ✓'); });
  var ua = navigator.userAgent, ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && 'ontouchend' in document);
  var safari = ios && !/CriOS|FxiOS|EdgiOS|GSA|Instagram|FBAN|FBAV|Line\//.test(ua);
  if (safari && !dipasang && !baruTolak) setTimeout(function () { el('sI').className = 'sheet on'; }, 3000);
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(function () {});

  // ---------- mula ----------
  (function () {
    var c = window.CSS && CSS.supports;
    if (!(c && (CSS.supports('backdrop-filter', 'blur(1px)') || CSS.supports('-webkit-backdrop-filter', 'blur(1px)')))) document.documentElement.className += ' nob';
    // MAC & IP dari portal sahaja (format ditapis)
    var q = new URLSearchParams(location.search), mac = String(q.get('mac') || '').toUpperCase(), ip = String(q.get('ip') || '');
    if (/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/.test(mac)) { MAC = mac; ls('bfx_mac', MAC); } else MAC = /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/.test(ls('bfx_mac') || '') ? ls('bfx_mac') : '';
    if (/^192\.168\.88\.\d{1,3}$/.test(ip)) { IP = ip; ls('bfx_ip', IP); } else IP = /^192\.168\.88\.\d{1,3}$/.test(ls('bfx_ip') || '') ? ls('bfx_ip') : '';
    if (q.get('mac') || q.get('ip')) history.replaceState(null, '', location.pathname + (q.get('src') ? '?src=' + encodeURIComponent(q.get('src')) : ''));
    ikon(); binaPakej(); kalendar();
    var t = ls('bfx_t');
    if (t) {
      TOK = t; el('muat').className = 'muat on';
      api({ a: 'akaun' }, function (r) {
        el('muat').className = 'muat';
        if (r.ok) { setAk(r.akaun); tunjukDash(); return; }
        if (r.keluar) { TOK = ''; ls('bfx_t', null); }
        el('vAuth').className = 'view on'; if (r.msg && !r.keluar) toast(r.msg);
      });
    } else { el('vAuth').className = 'view on'; api({ a: 'info' }, function () {}); }
    setInterval(function () { api({ a: 'info' }, function () {}); }, 60000);
    setInterval(function () { if (TOK && !document.hidden) api({ a: 'akaun' }, function (r) { if (r.ok) setAk(r.akaun); }); }, 180000);
  })();
})();
