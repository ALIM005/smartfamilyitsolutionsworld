const fs = require('fs');


const FILE = '.env.local';
const text = fs.readFileSync(FILE, 'utf8');
const m = text.match(/^MONGODB_URI=(.*)$/m);


if (!m) {
  console.log('MONGODB_URI was not found in .env.local');
  process.exit(1);
}


const raw = m[1].trim().replace(/^["']|["']$/g, '');
const parsed = raw.match(/^mongodb\+srv:\/\/(.+)@([^@/?]+)(\/[^?]*)?(\?.*)?$/);


if (!parsed) {
  console.log('The link is not of the mongodb+srv:// type; no change is needed.');
  process.exit(0);
}


const userinfo = parsed[1];
const host = parsed[2];
const dbName = ((parsed[3] || '').replace(/^\//, '')) || 'smartfamily';


// DNS-over-HTTPS: HTTPS works even if the ISP blocks the DNS port
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
      // Try the next source
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
    console.log('Server addresses were not found. Check whether the Atlas cluster name is correct.');
    process.exit(1);
  }


  const opts = txt.length
    ? txt[0].data.replace(/^"|"$/g, '').replace(/" "/g, '')
    : 'authSource=admin';


  const newUri = `mongodb://${userinfo}@${hosts.join(',')}/${dbName}?tls=true&${opts}&retryWrites=true&w=majority`;


  // The original srv link is kept in a separate key (the app does not read it; it will be useful for Vercel)
  const replaced = text.replace(
    m[0],
    () => `MONGODB_URI_SRV=${raw}\nMONGODB_URI=${newUri}`
  );
  fs.writeFileSync(FILE, replaced);


  console.log('Success. .env.local has been updated.');
  console.log('Cluster host      :', host);
  console.log('Number of servers :', hosts.length);
  console.log('Database name     :', dbName);
})().catch((e) => {
  console.log('Failed:', e.message);
  process.exit(1);
});