import { useEffect, useState } from 'react';

function Estados() {
  const [estados, setEstados] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/estados')
      .then((res) => res.json())
      .then((data) => setEstados(data))
      .catch((err) => console.error('Error:', err));
  }, []);

  return (
    <div>
      <h2>Estados de México</h2>
      <ul>
        {estados.map((estado) => (
          <li key={estado.id}>{estado.nombre_estado}</li>
        ))}
      </ul>
    </div>
  );
}

export default Estados;
