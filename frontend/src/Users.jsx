import { useEffect, useState } from 'react';

export default function Users({ token }) {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setUsers)
      .catch(() => setError('Error al cargar usuarios'));
  }, [token]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('Error al crear usuario');
      const newUser = await res.json();
      setUsers([...users, newUser]);
      setUsername('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Usuarios</h2>
      <form onSubmit={handleAdd}>
        <input placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} />
        <input placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Agregar</button>
      </form>
      {error && <div style={{color:'red'}}>{error}</div>}
      <ul>
        {users.map(u => <li key={u.id}>{u.username}</li>)}
      </ul>
    </div>
  );
}
