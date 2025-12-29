import { useState } from 'react';
import Login from './Login';
import Users from './Users';
import Equipment from './Equipment';
import Tickets from './Tickets';

export default function App() {
  const [token, setToken] = useState(null);

  if (!token) return <Login onLogin={setToken} />;

  return (
    <div>
      <h1>Bienvenido al ERP de Mantenimiento</h1>
      <button onClick={() => setToken(null)}>Cerrar sesión</button>
      <Users token={token} />
      <Equipment token={token} />
      <Tickets token={token} />
    </div>
  );
}
