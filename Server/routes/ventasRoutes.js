// Server/routes/ventasRoutes.js
import express from 'express';
import { poolPromise } from '../db.js';

const router = express.Router();

router.get('/categorias-ventas', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT C.NOMBRE_CATEGORIA, SUM(P.VENDIDOS) AS total_vendidos
      FROM PRODUCTOS P
      JOIN CATEGORIA C ON P.ID_CATEGORIA = C.ID_CATEGORIA
      GROUP BY C.NOMBRE_CATEGORIA
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener ventas:', err);
    res.status(500).send('Error interno del servidor');
  }
});

export default router;
