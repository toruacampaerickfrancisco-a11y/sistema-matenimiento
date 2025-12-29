import { useEffect, useState } from 'react';

export default function Equipment({ token }) {
  const [equipment, setEquipment] = useState([]);
  const [name, setName] = useState('');
  const [serial, setSerial] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/equipment', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setEquipment)
      .catch(() => setError('Error al cargar equipos'));
  }, [token]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3000/equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, serial, description })
      });
      if (!res.ok) throw new Error('Error al crear equipo');
      const newEq = await res.json();
      setEquipment([...equipment, newEq]);
      setName('');
      setSerial('');
      setDescription('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Equipos</h2>
      <form onSubmit={handleAdd}>
        <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Serie" value={serial} onChange={e => setSerial(e.target.value)} />
        <input placeholder="Descripción" value={description} onChange={e => setDescription(e.target.value)} />
        <button type="submit">Agregar</button>
      </form>
      {error && <div style={{color:'red'}}>{error}</div>}
      <ul>
        {equipment.map(eq => <li key={eq.id}>{eq.name} ({eq.serial})</li>)}
      </ul>
    </div>
  );
}
