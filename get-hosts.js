const fs = require('fs');

const FILE = '.env.local';
const text = fs.readFileSync(FILE, 'utf8');
const m = text.match(/^MONGODB_URI=(.*)$/m);

if (!m) {
  console.log('.env.local-এ MONGODB_URI পাওয়া যায়নি');
  process.exit(1);
}

const raw = m[1].trim().replace(/^["']|["']$/g, '');
const parsed = raw.match(/^mongodb\+srv:\/\/(.+)@([^@/?]+)(\/[^?]*)?(\?.*)?$/);

if (!parsed) {
  console.log('লিংকটি mongodb+srv:// ধরনের নয়, বদলানোর দরকার নেই।');
  process.exit(0);
}

const userinfo = parsed[1];
const host = parsed[2];
const dbName = ((parsed[3] || '').replace(/^\//, '')) || 'smartfamily';

// DNS-over-HTTPS: ISP-র DNS পোর্ট আটকালেও HTTPS চলে
async function ask(name, type) {
  const sources = [
    { url: `https://dns.google/resolve?name=${name}&type=${type}`, headers: {} },
    {
      url: `https://cloudflare-dns.com/dns-query?name=${name}&type=${type}`,
      headers: { accept: 'application/dns-json' },
    },
  ];
  for (const s of sources) {
    try {
      const r = await fetch(s.url, { headers: s.headers });
      const j = await r.json();
      if (j.Answer && j.Answer.length) return j.Answer;
    } catch {
      // পরের উৎস চেষ্টা করুন
    }
  }
  return [];
}

(async () => {
  const srv = await ask(`_mongodb._tcp.${host}`, 'SRV');
  const txt = await ask(host, 'TXT');

  const hosts = srv.map((a) => {
    const p = a.data.trim().split(/\s+/);
    return `${p[3].replace(/\.$/, '')}:${p[2]}`;
  });

  if (!hosts.length) {
    console.log('সার্ভারের ঠিকানা পাওয়া যায়নি। Atlas-এর ক্লাস্টারের নাম ঠিক আছে কি না দেখুন।');
    process.exit(1);
  }

  const opts = txt.length
    ? txt[0].data.replace(/^"|"$/g, '').replace(/" "/g, '')
    : 'authSource=admin';

  const newUri = `mongodb://${userinfo}@${hosts.join(',')}/${dbName}?tls=true&${opts}&retryWrites=true&w=majority`;

  // আসল srv লিংক আলাদা কী-তে রাখা হয় (অ্যাপ এটি পড়ে না, Vercel-এর জন্য কাজে লাগবে)
  const replaced = text.replace(
    m[0],
    () => `MONGODB_URI_SRV=${raw}\nMONGODB_URI=${newUri}`
  );
  fs.writeFileSync(FILE, replaced);

  console.log('সফল। .env.local আপডেট হয়েছে।');
  console.log('ক্লাস্টার হোস্ট :', host);
  console.log('সার্ভার সংখ্যা   :', hosts.length);
  console.log('ডাটাবেস নাম     :', dbName);
})().catch((e) => {
  console.log('ব্যর্থ:', e.message);
  process.exit(1);
});