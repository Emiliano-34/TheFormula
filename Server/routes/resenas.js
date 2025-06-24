import express from 'express';
import { poolPromise, sql } from '../db.js';

const router = express.Router();

// Obtener reseñas de un producto
router.get('/:idProducto', async (req, res) => {
  const { idProducto } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('idProducto', sql.Int, idProducto)
      .query('SELECT ID as id, CALIFICACION as calificacion, TEXTO as texto FROM RESENAS WHERE ID_PRODUCTO = @idProducto');

    res.json({ success: true, reseñas: result.recordset });
  } catch (err) {
    console.error('Error al obtener reseñas:', err);
    res.status(500).json({ success: false, message: 'Error al obtener reseñas' });
  }
});

// POST /api/resenas/:id
router.post('/:id', async (req, res) => {
  const idProducto = parseInt(req.params.id);
  const { calificacion, texto } = req.body;

  if (!idProducto || !calificacion || !texto) {
    return res.status(400).json({ success: false, message: 'Faltan campos requeridos' });
  }

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('idProducto', sql.Int, idProducto)
      .input('calificacion', sql.Decimal(2, 1), calificacion)
      .input('texto', sql.NVarChar(sql.MAX), texto)
      .query(`
        INSERT INTO RESENAS (ID_PRODUCTO, CALIFICACION, TEXTO)
        VALUES (@idProducto, @calificacion, @texto)
      `);

    res.json({ success: true, message: 'Reseña agregada' });
  } catch (err) {
    console.error('Error al guardar reseña:', err);
    res.status(500).json({ success: false, message: 'Error al guardar reseña' });
  }
});


export default router;
