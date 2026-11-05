const fs = require('fs');
const net = require('net');
const mongoose = require('mongoose');


const m = fs.readFileSync('.env.local', 'utf8').match(/^MONGODB_URI=(.*)$/m);
if (!m) {
  console.log('MONGODB_URI was not found');
  process.exit(1);
}
const uri = m[1].trim().replace(/^["']|["']$/g, '');
const mask = (s) => String(s).replace(/(mongodb(?:\+srv)?:\/\/)[^@\s]*@/gi, '$1***:***@');


const isSrv = uri.startsWith('mongodb+srv://');
const isStd = uri.startsWith('mongodb://');
console.log(
  'Link type       :',
  isSrv ? 'srv (get-hosts.js did not work or was not run)' : isStd ? 'standard (OK)' : 'unknown'
);


const afterAt = uri.replace(/^mongodb(\+srv)?:\/\/[^@]*@/, '');
console.log('Database name:', afterAt.split('?')[0].split('/')[1] || '(none)');


function tcp(hostport) {
  return new Promise((resolve) => {
    const [host, port] = hostport.split(':');
    const s = net.connect({ host, port: Number(port) || 27017, timeout: 6000 });
    s.on('connect', () => {
      s.destroy();
      resolve('port open');
    });
    s.on('timeout', () => {
      s.destroy();
      resolve('timeout (ISP or network is blocking the port)');
    });
    s.on('error', (e) => resolve('failed: ' + e.code));
  });
}


(async () => {
  if (isStd) {
    const hosts = afterAt.split(/[/?]/)[0].split(',');
    for (const h of hosts) {
      console.log('Server          :', h.split('.')[0], '->', await tcp(h));
    }
  }


  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('Result          : success, database connected');
    await mongoose.disconnect();
  } catch (e) {
    console.log('Result          : failed');
    console.log('Type            :', e.name);
    console.log('Message         :', mask(e.message).slice(0, 250));
    process.exit(1);
  }
})();