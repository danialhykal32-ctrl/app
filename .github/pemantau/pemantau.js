// Pemantau 24 jam BlackFox WiFi (GitHub Actions, setiap 15 minit).
// Token Telegram datang dari GitHub Secrets melalui env TG_TOKEN & TG_CHAT. Jangan tulis token dalam fail ini.
'use strict';
const fs = require('fs'), path = require('path');

const WEB = process.env.URL_WEB || 'https://script.google.com/macros/s/AKfycby_qqzGVsX5A5J_B6BE-TefzTb8m_Cqgg2q3M2419Hr4MXzmjhh48BXXoJkVeGF-w1n/exec';
const APP = process.env.URL_APP || 'https://danialhykal32-ctrl.github.io/app/';
const TG_API = process.env.TG_API || 'https://api.telegram.org';
const FAIL = process.env.FAIL_STATUS || '.pemantau-status/status.json';
const AMBANG = 2; // gagal berturut-turut sebelum amaran
const masa = t => new Date(t).toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });

async function ambil(url) {
  let e1 = null;
  for (let cubaan = 0; cubaan < 2; cubaan++) {
    try {
      const r = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(25000), headers: { 'User-Agent': 'BlackFox-Pemantau' } });
      return { kod: r.status, teks: await r.text() };
    } catch (e) { e1 = e; if (!cubaan) await new Promise(s => setTimeout(s, 5000)); }
  }
  return { kod: 0, teks: '', ralat: e1 && e1.name === 'TimeoutError' ? 'tiada jawapan dalam 25 saat' : (e1 && e1.message) || 'gagal disambung' };
}

async function semak() {
  const hasil = [];
  const a = await ambil(APP);
  hasil.push({ nama: 'App GitHub Pages', ok: a.kod === 200 && /app\.js/.test(a.teks), sebab: a.kod === 200 ? 'kandungan app tidak dijumpai' : (a.ralat || 'HTTP ' + a.kod) });
  const w = await ambil(WEB + '?app=1');
  hasil.push({ nama: 'Web App Apps Script', ok: w.kod === 200, sebab: w.ralat || 'HTTP ' + w.kod });
  const p = await ambil(WEB + '?ping=1');
  let j = null; try { j = JSON.parse(p.teks); } catch (e) {}
  if (!j || j.ok !== true) hasil.push({ nama: 'Endpoint ping', ok: false, sebab: p.ralat || (p.kod !== 200 ? 'HTTP ' + p.kod : 'jawapan bukan JSON {ok:true} (endpoint ?ping=1 belum di-deploy?)') });
  else hasil.push({ nama: 'Router (heartbeat)', ok: j.router_online === true, sebab: 'router senyap sejak ' + (j.hb_terakhir ? masa(j.hb_terakhir) : 'tidak diketahui') });
  return hasil;
}

async function telegram(teks) {
  const tok = process.env.TG_TOKEN, chat = process.env.TG_CHAT;
  if (!tok || !chat) { console.log('::warning title=Telegram::Secrets TG_TOKEN / TG_CHAT belum ditetapkan. Amaran tidak dihantar.'); return false; }
  try {
    const r = await fetch(TG_API + '/bot' + tok + '/sendMessage', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text: teks }), signal: AbortSignal.timeout(20000) });
    if (!r.ok) { console.log('::warning title=Telegram::Telegram menolak mesej (HTTP ' + r.status + '). Semak TG_TOKEN / TG_CHAT.'); return false; }
    return true;
  } catch (e) { console.log('::warning title=Telegram::Gagal hubungi Telegram.'); return false; }
}

(async () => {
  const now = Date.now();
  let st = { gagal: 0, amaran: false, sejak: 0 };
  try { st = Object.assign(st, JSON.parse(fs.readFileSync(FAIL, 'utf8'))); } catch (e) {}
  const hasil = await semak(), rosak = hasil.filter(h => !h.ok);
  const senarai = hasil.map(h => (h.ok ? '✅ ' : '❌ ') + h.nama + (h.ok ? '' : ': ' + h.sebab)).join('\n');
  let tindakan = 'tiada';
  if (rosak.length) {
    if (!st.gagal) st.sejak = now;
    st.gagal++;
    if (st.gagal >= AMBANG && !st.amaran) {
      const ok = await telegram('🚨 PEMANTAU BlackFox (GitHub)\nGagal ' + st.gagal + ' kali berturut-turut sejak ' + masa(st.sejak) + ':\n\n' + senarai +
        '\n\nTaip /doktor dalam bot untuk semakan penuh. Mesej "pulih" akan dihantar bila semua OK.');
      if (ok) { st.amaran = true; tindakan = 'amaran dihantar'; } else tindakan = 'amaran GAGAL dihantar (akan cuba lagi)';
    } else tindakan = st.amaran ? 'amaran sudah dihantar, tidak diulang' : 'gagal kali pertama, tunggu semakan seterusnya';
  } else {
    if (st.amaran) {
      const minit = Math.max(1, Math.round((now - st.sejak) / 60000));
      await telegram('✅ PULIH: semua semakan BlackFox OK semula.\nGangguan lebih kurang ' + minit + ' minit (sejak ' + masa(st.sejak) + ').\n\n' + senarai);
      tindakan = 'mesej pulih dihantar';
    }
    st = { gagal: 0, amaran: false, sejak: 0 };
  }
  fs.mkdirSync(path.dirname(FAIL), { recursive: true });
  fs.writeFileSync(FAIL, JSON.stringify(st));
  const ringkas = '## ' + (rosak.length ? '❌ Ada masalah' : '✅ Semua OK') + ' (' + masa(now) + ')\n\n' + senarai.replace(/\n/g, '\n\n') +
    '\n\nGagal berturut-turut: ' + st.gagal + ' | Tindakan: ' + tindakan;
  console.log(ringkas);
  rosak.forEach(h => console.log('::warning title=' + h.nama + '::' + h.sebab));
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, ringkas + '\n');
})();
