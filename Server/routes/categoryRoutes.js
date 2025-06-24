// Server/routes/categoriasRoutes.js
import express from 'express';
import { poolPromise } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT ID_CATEGORIA AS id, NOMBRE_CATEGORIA AS nombre FROM CATEGORIAS ORDER BY ID_CATEGORIA');
    res.json({ success: true, categorias: result.recordset });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
