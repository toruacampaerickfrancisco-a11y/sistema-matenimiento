import { useEffect, useState } from 'react';

export default function Tickets({ token }) {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/tickets', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setTickets)
      .catch(() => setError('Error al cargar tickets'));
  }, [token]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3000/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
      });
      if (!res.ok) throw new Error('Error al crear ticket');
      const newTicket = await res.json();
      setTickets([...tickets, newTicket]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Tickets</h2>
      <form onSubmit={handleAdd}>
        <input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Descripción" value={description} onChange={e => setDescription(e.target.value)} />
        <button type="submit">Agregar</button>
      </form>
      {error && <div style={{color:'red'}}>{error}</div>}
      <ul>
        {tickets.map(t => <li key={t.id}>{t.title} - {t.status}</li>)}
      </ul>
    </div>
  );
}
