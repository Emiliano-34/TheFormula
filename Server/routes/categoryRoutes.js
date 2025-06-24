import express from 'express';
import { poolPromise } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    
    // CORRECCIÓN FINAL: Cambiando 'CATEGORIAS' a 'CATEGORIA'
    const result = await pool.request()
      .query('SELECT ID_CATEGORIA AS id, NOMBRE_CATEGORIA AS nombre FROM CATEGORIA ORDER BY ID_CATEGORIA');
    
    res.json({ success: true, categories: result.recordset }); // Corregido de 'categorias' a 'categories' para coincidir con el frontend
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
