const fetch = globalThis.fetch || require('node-fetch');
const creds = { email: 'admin@bienestar.sonora.gob.mx', password: 'Sbs2025admgen' };
const endpoints = [
  { name: 'Backend (Koa)', url: 'http://127.0.0.1:3000/api/auth/login' },
  { name: 'Frontend Next API', url: 'http://127.0.0.1:30001/api/auth/login' }
];
(async ()=>{
  for (const e of endpoints) {
    try {
      const res = await fetch(e.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(creds) });
      const txt = await res.text();
      console.log(`=== ${e.name} -> ${e.url} ===`);
      console.log('Status:', res.status);
      console.log('Body:', txt);
    } catch (err) {
      console.log(`=== ${e.name} -> ${e.url} ===`);
      console.log('ERROR:', err.message);
    }
    console.log();
  }
})();
