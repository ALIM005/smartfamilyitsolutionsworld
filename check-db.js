const fs = require('fs');
const net = require('net');
const mongoose = require('mongoose');

const m = fs.readFileSync('.env.local', 'utf8').match(/^MONGODB_URI=(.*)$/m);
if (!m) {
  console.log('MONGODB_URI পাওয়া যায়নি');
  process.exit(1);
}
const uri = m[1].trim().replace(/^["']|["']$/g, '');
const mask = (s) => String(s).replace(/(mongodb(?:\+srv)?:\/\/)[^@\s]*@/gi, '$1***:***@');

const isSrv = uri.startsWith('mongodb+srv://');
const isStd = uri.startsWith('mongodb://');
console.log(
  'লিংকের ধরন :',
  isSrv ? 'srv (get-hosts.js কাজ করেনি বা চালানো হয়নি)' : isStd ? 'standard (ঠিক আছে)' : 'অজানা'
);

const afterAt = uri.replace(/^mongodb(\+srv)?:\/\/[^@]*@/, '');
console.log('ডাটাবেস নাম:', afterAt.split('?')[0].split('/')[1] || '(নেই)');

function tcp(hostport) {
  return new Promise((resolve) => {
    const [host, port] = hostport.split(':');
    const s = net.connect({ host, port: Number(port) || 27017, timeout: 6000 });
    s.on('connect', () => {
      s.destroy();
      resolve('পোর্ট খোলা');
    });
    s.on('timeout', () => {
      s.destroy();
      resolve('টাইমআউট (ISP বা নেটওয়ার্ক পোর্ট আটকাচ্ছে)');
    });
    s.on('error', (e) => resolve('ব্যর্থ: ' + e.code));
  });
}

(async () => {
  if (isStd) {
    const hosts = afterAt.split(/[/?]/)[0].split(',');
    for (const h of hosts) {
      console.log('সার্ভার     :', h.split('.')[0], '->', await tcp(h));
    }
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('ফলাফল     : সফল, ডাটাবেস সংযোগ হয়েছে');
    await mongoose.disconnect();
  } catch (e) {
    console.log('ফলাফল     : ব্যর্থ');
    console.log('ধরন       :', e.name);
    console.log('বার্তা     :', mask(e.message).slice(0, 250));
    process.exit(1);
  }
})();