const fs = require('fs');
const path = require('path');
const envPath = path.resolve(__dirname, '..', '.env');
let txt = fs.readFileSync(envPath, 'utf8');
txt = txt.replace(/DB_USER=.*/i, 'DB_USER=erp_user');
txt = txt.replace(/DB_PASSWORD=.*/i, 'DB_PASSWORD=erp_password_2025');
txt = txt.replace(/DB_NAME=.*/i, 'DB_NAME=respaldo-sistema-mantenimiento');
fs.writeFileSync(envPath, txt, 'utf8');
console.log('updated', envPath);
