const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
console.log('DB_USER=', process.env.DB_USER);
console.log('DB_PASSWORD=', process.env.DB_PASSWORD ? '***REDACTED***' : null);
