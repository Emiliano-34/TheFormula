import db from '../db.js';

export const obtenerEstados = (req, res) => {
  const query = 'SELECT * FROM estados ORDER BY id';

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error al obtener estados:', err);
      return res.status(500).json({ error: 'Error al obtener los estados' });
    }

    res.status(200).json(rows);
  });
};
