const fetch = globalThis.fetch || require('node-fetch');
const url = 'http://127.0.0.1:3000/api/auth/login';
const email = 'admin@sedesson.gob.mx';
const pass = 'Sbs2025admgen';
const trials = [
  { email, password: pass },
  { username: email, password: pass },
  { usuario: email, password: pass },
  { correo: email, password: pass },
  { email: email, password: pass, extra: 'test' }
];
(async ()=>{
  for(const t of trials){
    try{
      const r = await fetch(url, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(t)});
      const txt = await r.text();
      console.log('Payload:', JSON.stringify(t));
      console.log('Status:', r.status);
      console.log('Body:', txt);
    }catch(e){
      console.log('ERROR', e.message);
    }
    console.log('---');
  }
})();
