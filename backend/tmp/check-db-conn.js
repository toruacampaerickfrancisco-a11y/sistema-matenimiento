import { testConnection } from '../src/config/database.js';

(async () => {
  const ok = await testConnection();
  console.log('Connection OK?', ok);
  process.exit(ok ? 0 : 1);
})();
