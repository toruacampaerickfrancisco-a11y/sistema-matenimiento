const fetch = globalThis.fetch || require('node-fetch');

async function run() {
  const base = 'http://127.0.0.1:3000/api';
  console.log('Checking backend endpoints on', base);

  try {
    // 1) Equipment search
    console.log('\n1) Equipment search: search=Laptop');
    let r = await fetch(`${base}/equipment?search=Laptop&limit=5&page=1`);
    console.log('status', r.status);
    console.log('body:', await r.text());

    // 2) Equipment filter type=Laptop (as frontend uses capitalized)
    console.log('\n2) Equipment filter: type=Laptop');
    r = await fetch(`${base}/equipment?type=Laptop&limit=5&page=1`);
    console.log('status', r.status);
    console.log('body:', await r.text());

    // 3) Tickets search (Next API)
    console.log('\n3) Tickets (Next API) search: q=prueba');
    r = await fetch('http://127.0.0.1:30001/api/tickets?q=prueba&page=1&pageSize=5');
    console.log('status', r.status);
    console.log('body:', await r.text());

    // 4) Users search
    console.log('\n4) Users search: /api/users?search=admin');
    r = await fetch(`${base}/users?search=admin&limit=5&page=1`);
    console.log('status', r.status);
    console.log('body:', await r.text());

    // 5) Equipment export (simulate get all with filters)
    console.log('\n5) Equipment export (get all matching)');
    r = await fetch(`${base}/equipment?limit=10000&page=1`);
    console.log('status', r.status);
    const txt = await r.text();
    console.log('length', txt.length);

  } catch (err) {
    console.error('Error running checks:', err);
  }
}

run();
