const fs = require('fs');
const path = require('path');

function getSizeSync(p) {
  try {
    const stat = fs.lstatSync(p);
    if (stat.isFile()) return stat.size;
    if (stat.isDirectory()) {
      const entries = fs.readdirSync(p);
      let total = 0;
      for (const e of entries) {
        total += getSizeSync(path.join(p, e));
      }
      return total;
    }
    return 0;
  } catch (e) {
    return 0;
  }
}

function formatMB(n) { return (n/1024/1024).toFixed(2); }

const root = path.resolve(__dirname, '..'); // backend
const items = fs.readdirSync(root, { withFileTypes: true });
const rows = [];
for (const it of items) {
  const full = path.join(root, it.name);
  const size = getSizeSync(full);
  rows.push({ name: it.name, isDir: it.isDirectory(), sizeBytes: size, sizeMB: formatMB(size) });
}
rows.sort((a,b)=>b.sizeBytes - a.sizeBytes);
console.table(rows.map(r=>({Name: r.name, IsDirectory: r.isDir, SizeMB: r.sizeMB})));

const candidates = rows.filter(r=> r.isDir && (r.name === 'node_modules' || r.name === 'public' || r.name === 'tmp' || r.name === 'database' || r.name === 'test' || r.name === 'src'));
if(candidates.length) {
  console.log('\nCandidates to review in backend:');
  candidates.forEach(c=> console.log(`${c.name}\t${c.sizeMB} MB`));
}
