// Script de verificación HTTP rápido
const fetch = globalThis.fetch || require('node-fetch');
const urls = {
  frontend: 'http://127.0.0.1:30001/',
  backend: 'http://127.0.0.1:3000/',
  login: 'http://127.0.0.1:3000/api/auth/login'
};
(async ()=>{
  try{
    const r1 = await fetch(urls.frontend, {method:'GET'});
    const t1 = await r1.text();
    console.log('FE', r1.status);
    console.log(t1.slice(0,400));
  }catch(e){ console.log('FE ERROR', e.message); }
  try{
    const r2 = await fetch(urls.backend, {method:'GET'});
    const t2 = await r2.text();
    console.log('BE', r2.status);
    console.log(t2.slice(0,800));
  }catch(e){ console.log('BE ERROR', e.message); }
  try{
    const body = { email: 'admin@sedesson.gob.mx', password: 'Sbs2025admgen' };
    const r3 = await fetch(urls.login, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
    const t3 = await r3.text();
    console.log('LOGIN', r3.status);
    console.log(t3.slice(0,2000));
  }catch(e){ console.log('LOGIN ERROR', e.message); }
})();
