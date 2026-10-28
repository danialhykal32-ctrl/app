// Ujian asap app BlackFox (Playwright): Chromium + WebKit (enjin Safari iPhone), iPhone 390px, Safari biasa + Home Screen (standalone).
// GAGAL jika: ralat JS, ralat console (termasuk CSP), fail precache service worker hilang, atau skrin kosong.
// API Apps Script, Google Fonts & Cloudflare Turnstile dipalsukan supaya ujian stabil (tiada rangkaian luar).
const { chromium, webkit, devices } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..'), OUT = path.join(ROOT, 'hasil-uji'); fs.mkdirSync(OUT, { recursive: true });
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };
const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]); if (!p.startsWith('/app/')) { r.writeHead(301, { Location: '/app/' }); return r.end(); }
  p = p.slice(5) || 'index.html'; const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || /(^|\/)\./.test(p)) { r.writeHead(404); return r.end(); }
  fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); });
}).listen(0);
const AK = { m: 'CONTOH01', nama: 'Ahmad Pelajar', ada: true, aktif: true, pelan: 'Pro', kuota: 150, guna: 40, baki: 110, tamat: '24/11/2030 14:10:00', peranti: 1 };
const TS = 'window.turnstile={render:function(){return 1},getResponse:function(){return "TOK"},reset:function(){}};';
const hari = () => { const d = new Date(Date.now() + 8 * 3600e3), p = n => String(n).padStart(2, '0'); return p(d.getUTCDate()) + '/' + p(d.getUTCMonth() + 1) + '/' + d.getUTCFullYear(); };
function api(req) {
  const a = req.a, info = { up: true, sejak: '-', notis: '', jual: true, percuma: true };
  if (a === 'akaun' || a === 'info' || a === 'login') return { ok: true, token: 'T', akaun: AK, info };
  if (a === 'profil') return { ok: true, profil: { telegram: false, bilBeli: 0, jumlahRm: 0, beli: [] } };
  if (a === 'cuaca') return { ok: true, cuaca: { ok: true, ikon: 'awan', desc: 'Berawan', min: 24, max: 33, suhu: 31, terasa: 35, lembap: 70, angin: 9, owm: true, jam: [], amaran: [], sumber: 'Weather data © OpenWeather', masa: Date.now() },
    solat: { ok: true, kod: 'NGS01', tarikh: hari(), hijri: '1448-05-14', w: [['Imsak', '05:40'], ['Subuh', '05:50'], ['Syuruk', '07:00'], ['Zohor', '13:05'], ['Asar', '16:20'], ['Maghrib', '19:08'], ['Isyak', '20:18']], esok: '05:50', sumber: 'JAKIM' } };
  if (a === 'hujan') return { ok: true, skor: 20, ikon: 'awan', ayat: '🌤️ Tiada hujan dijangka 12 jam akan datang', panas: '', ketepatan: '', sumber: ['OpenWeather'], kredit: '', masa: Date.now() };
  if (a === 'tg') return { ok: true, kod: 'abc123', linked: false };
  if (a === 'chatSejarah') return { ok: true, sejarah: [], baki: 30, had: 30 };
  return { ok: true };
}
const KES = [
  { n: 'tetamu-safari', ls: {} },
  { n: 'tetamu-homescreen', ls: {}, sa: 1 },
  { n: 'login-homescreen', ls: { bfx_t: 'T', bfx_ak: JSON.stringify(AK) }, sa: 1, dash: 1 },
  { n: 'login-tanpa-cache', ls: { bfx_t: 'T' }, sa: 1, dash: 1 }
];
(async () => {
  const gagal = [], lulus = [];
  // fail precache service worker mesti wujud
  const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8'), shell = (sw.match(/SHELL\s*=\s*\[([^\]]*)\]/) || [])[1] || '';
  shell.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean).forEach(u => { if (u !== './' && !fs.existsSync(path.join(ROOT, u))) gagal.push('sw.js SHELL: fail hilang ' + u); });
  for (const [nama, jenis] of [['chromium', chromium], ['webkit', webkit]]) {
    let br; try { br = await jenis.launch(); } catch (e) { gagal.push(nama + ': tidak dapat dilancar: ' + e.message.split('\n')[0]); continue; }
    for (const k of KES) {
      const ctx = await br.newContext({ ...devices['iPhone 13'] }), pg = await ctx.newPage(), E = [];
      pg.on('pageerror', e => E.push('PAGEERROR ' + e.message));
      const LOG = [];
      pg.on('console', m => { LOG.push(m.type() + ': ' + m.text().slice(0, 200)); if (m.type() === 'error') E.push('console.error ' + m.text().slice(0, 300)); });
      pg.on('response', r => { if (r.status() >= 400) E.push('HTTP ' + r.status() + ' ' + r.url()); });
      const CORS = { 'Access-Control-Allow-Origin': '*' };
      await ctx.route(/fonts\.googleapis\.com/, r => r.fulfill({ contentType: 'text/css', headers: CORS, body: '' }));
      await ctx.route(/fonts\.gstatic\.com/, r => r.fulfill({ status: 204, body: '' }));
      await ctx.route(/challenges\.cloudflare\.com/, r => r.fulfill({ contentType: 'text/javascript', body: TS }));
      await ctx.route(/script\.google(usercontent)?\.com/, r => { let q = {}; try { q = JSON.parse(r.request().postData() || '{}').req || {}; } catch (e) {} API_LOG.push(r.request().method() + ' ' + (q.a || '?')); r.fulfill({ contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(api(q)) }); });
      await pg.addInitScript(() => { // diagnostik: pelanggaran CSP & siapa padam token sesi
        window.__diag = [];
        document.addEventListener('securitypolicyviolation', e => window.__diag.push('CSP ' + e.violatedDirective + ' src=' + (e.sourceFile || '') + ':' + (e.lineNumber || '') + ' blocked=' + (e.blockedURI || '') + ' sample=' + String(e.sample || '').slice(0, 80)));
        try { const rm = Storage.prototype.removeItem, cl = Storage.prototype.clear;
          Storage.prototype.removeItem = function (k) { if (k === 'bfx_t') window.__diag.push('removeItem(bfx_t) ' + String(new Error().stack || '').split('\n').slice(1, 4).join(' < ')); return rm.call(this, k); };
          Storage.prototype.clear = function () { window.__diag.push('localStorage.clear()'); return cl.call(this); }; } catch (e) {}
      });
      const API_LOG = [];
      await pg.addInitScript(([ls, sa]) => { try { localStorage.setItem('bfx_tolak', String(Date.now())); for (const x in ls) localStorage.setItem(x, ls[x]); } catch (e) {} if (sa) try { Object.defineProperty(navigator, 'standalone', { value: true }); } catch (e) {} }, [k.ls, !!k.sa]);
      const url = 'http://localhost:' + srv.address().port + '/app/?src=app';
      let st = null;
      try {
        await pg.goto(url, { waitUntil: 'load', timeout: 30000 }); await pg.waitForTimeout(3500);
        await pg.reload({ waitUntil: 'load', timeout: 30000 }); await pg.waitForTimeout(3500); // kali kedua: melalui service worker
        st = await pg.evaluate(() => {
          const v = document.querySelector('.view.on'), r = v ? v.getBoundingClientRect() : null, g = document.getElementById('bfxGagal');
          return { diag: (window.__diag || []).slice(0, 8), auth: document.getElementById('vAuth').className, dash: document.getElementById('vDash').className, t: !!localStorage.getItem('bfx_t'), ralat: window.bfxRalat ? window.bfxRalat() : [], view: v ? v.id : '', w: r ? Math.round(r.width) : 0, h: r ? Math.round(r.height) : 0, teks: (v ? v.innerText : '').replace(/\s+/g, ' ').trim().slice(0, 80), gagal: !!(g && g.offsetParent),
            sw: !!(navigator.serviceWorker && navigator.serviceWorker.controller), bg: getComputedStyle(document.body).backgroundColor };
        });
      } catch (e) { E.push('MUAT ' + e.message.split('\n')[0]); }
      await pg.screenshot({ path: path.join(OUT, nama + '-' + k.n + '.png'), caret: 'initial' }).catch(() => {}); // caret 'initial': elak <style> suntikan Playwright (CSP)
      const id = nama + ' / ' + k.n;
      const kosong = !st || !st.view || (k.dash && !/\bon\b/.test(st.dash)) || (k.dash && /\bon\b/.test(st.auth)) || st.w < 100 || st.h < 100 || st.teks.length < 10 || st.gagal || (k.dash ? st.view !== 'vDash' : st.view !== 'vAuth');
      if (st && st.diag && st.diag.length) st.diag.forEach(x => gagal.push(id + ': diag ' + x));
      if (kosong) { gagal.push(id + ': SKRIN KOSONG / salah ' + JSON.stringify(st) + ' API=' + API_LOG.join(',')); LOG.slice(-12).forEach(x => gagal.push(id + ': log ' + x)); }
      E.forEach(x => gagal.push(id + ': ' + x));
      if (!kosong && !E.length) lulus.push(id + ' ✓ ' + st.view + ' "' + st.teks.slice(0, 40) + '" sw=' + st.sw);
      await ctx.close();
    }
    await br.close();
  }
  srv.close();
  console.log(lulus.map(x => '✅ ' + x).join('\n')); if (gagal.length) console.log(gagal.map(x => '❌ ' + x).join('\n'));
  console.log(gagal.length ? 'GAGAL ' + gagal.length : 'SEMUA LULUS (' + lulus.length + ')');
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, '## Ujian app (Chromium + WebKit, iPhone 390px)\n\n' + lulus.map(x => '- ✅ ' + x).concat(gagal.map(x => '- ❌ ' + x)).join('\n') + '\n');
  process.exit(gagal.length ? 1 : 0);
})();
