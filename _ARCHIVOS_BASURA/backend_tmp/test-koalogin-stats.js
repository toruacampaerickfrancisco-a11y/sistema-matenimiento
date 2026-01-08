const fetch = globalThis.fetch || require('node-fetch');
(async ()=>{
  try{
    const creds = { email: 'admin@bienestar.sonora.gob.mx', password: 'Sbs2025admgen' };
    const login = await fetch('http://127.0.0.1:3000/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(creds) });
    const loginBody = await login.text();
    console.log('Koa login status', login.status);
    console.log('Koa login body:', loginBody);
    if (login.status === 200) {
      const parsed = JSON.parse(loginBody);
      const token = parsed.data?.token || parsed.token || parsed.accessToken;
      console.log('token:', token ? token.slice(0,40)+'...' : 'none');
      const stats = await fetch('http://127.0.0.1:3000/api/dashboard/stats', { headers: { Authorization: 'Bearer '+token } });
      console.log('stats status', stats.status);
      console.log(await stats.text());
    }
  }catch(e){ console.error('ERROR', e); }
})();
