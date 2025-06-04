// Server/routes/pedidosRoutes.js
import express from 'express';
import { poolPromise } from '../db.js';

const router = express.Router();

// Crear pedido y productos asociados
router.post('/', async (req, res) => {
  const { userId, direccionId, productos } = req.body;

  if (!userId || !direccionId || !productos?.length) {
    return res.status(400).json({ success: false, error: 'Datos incompletos' });
  }

  try {
    const pool = await poolPromise;

    const insertPedidoQuery = `
      INSERT INTO PEDIDOS_TEMP (ID_CLIENTE, ID_DIRECCION, FECHA_PEDIDO, ESTADO)
      VALUES (@userId, @direccionId, GETDATE(), 1);
      SELECT SCOPE_IDENTITY() AS pedidoId;
    `;

    const result = await pool.request()
      .input('userId', userId)
      .input('direccionId', direccionId)
      .query(insertPedidoQuery);

    const pedidoId = result.recordset[0].pedidoId;

    const insertProductoQuery = `
      INSERT INTO PRODUCTOS_PEDIDOS (ID_PRODUCTO, ID_PEDIDO, CANTIDAD)
      VALUES (@idProducto, @idPedido, @cantidad)
    `;

    for (const producto of productos) {
      await pool.request()
        .input('idProducto', producto.id)
        .input('idPedido', pedidoId)
        .input('cantidad', producto.quantity)
        .query(insertProductoQuery);
    }

    res.json({ success: true, pedidoId });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener historial de pedidos
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .query(`
        SELECT p.ID_PEDIDO AS id, p.FECHA_PEDIDO AS fecha, p.ESTADO AS estado,
               p.ID_DIRECCION AS direccionId, p.ID_CLIENTE AS clienteId
        FROM PEDIDOS_TEMP p
        ORDER BY p.FECHA_PEDIDO DESC
      `);

    res.json({ success: true, pedidos: result.recordset });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

