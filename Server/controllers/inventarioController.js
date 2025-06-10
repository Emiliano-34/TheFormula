// inventarioController.js
import { poolPromise, sql } from '../db.js';

export const actualizarInventario = async (req, res) => {
  const { codigo_barras, cantidad } = req.body;

  if (!codigo_barras || !cantidad || cantidad <= 0) {
    return res.status(400).json({ success: false, error: 'Datos inválidos' });
  }

  try {
    const pool = await poolPromise;

    // Obtener existencias actuales
    const result = await pool.request()
      .input('codigo_barras', sql.VarChar, codigo_barras)
      .query('SELECT EXISTENCIAS FROM PRODUCTOS WHERE CODIGO_BARRAS = @codigo_barras');

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }

    const existenciasActuales = result.recordset[0].EXISTENCIAS || 0;
    const nuevasExistencias = existenciasActuales + cantidad;

    // Actualizar existencias
    await pool.request()
      .input('codigo_barras', sql.VarChar, codigo_barras)
      .input('nuevasExistencias', sql.Int, nuevasExistencias)
      .query('UPDATE PRODUCTOS SET EXISTENCIAS = @nuevasExistencias WHERE CODIGO_BARRAS = @codigo_barras');

    res.json({ success: true, nuevasExistencias });
  } catch (error) {
    console.error('Error al actualizar inventario:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
