const fetch = globalThis.fetch || require('node-fetch');

const base = 'http://127.0.0.1:3000/api';

async function tryLogin(creds) {
  try {
    const r = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(creds)
    });
    const body = await r.json();
    return { status: r.status, body };
  } catch (e) {
    return { error: String(e) };
  }
}

async function run() {
  console.log('Attempting login with candidate credentials...');
  const candidates = [
    { email: 'admin@bienestar.sonora.gob.mx', password: 'Sbs2025admgen' },
    { email: 'admin@sedesson.gob.mx', password: 'Sbs2025admgen' },
    { username: 'admin', password: 'admin123' }
  ];

  let token = null;
  for (const c of candidates) {
    const res = await tryLogin(c);
    console.log('Tried', c, '->', res.status || res.error);
    if (res && res.status === 200 && res.body && res.body.data && res.body.data.token) {
      token = res.body.data.token;
      console.log('Login success, token obtained');
      break;
    }
  }

  if (!token) {
    console.error('No token obtained. Cannot run authenticated checks.');
    return;
  }

  // Run equipment checks with token
  try {
    console.log('\nAuthenticated: GET /api/equipment?search=Laptop');
    let r = await fetch(`${base}/equipment?search=Laptop&limit=5&page=1`, { headers: { Authorization: 'Bearer ' + token } });
    console.log('status', r.status);
    console.log(await r.text());

    console.log('\nAuthenticated: GET /api/equipment?type=Laptop');
    r = await fetch(`${base}/equipment?type=Laptop&limit=5&page=1`, { headers: { Authorization: 'Bearer ' + token } });
    console.log('status', r.status);
    console.log(await r.text());

    console.log('\nAuthenticated: GET /api/users?search=admin');
    r = await fetch(`${base}/users?search=admin&limit=5&page=1`, { headers: { Authorization: 'Bearer ' + token } });
    console.log('status', r.status);
    console.log(await r.text());

    console.log('\nAuthenticated: GET /api/equipment?limit=10000 (export)');
    r = await fetch(`${base}/equipment?limit=10000&page=1`, { headers: { Authorization: 'Bearer ' + token } });
    console.log('status', r.status);
    const txt = await r.text();
    console.log('length', txt.length);
  } catch (err) {
    console.error('Error during authenticated checks:', err);
  }
}

run();
