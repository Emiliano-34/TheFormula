import express from 'express';
import { poolPromise } from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {

const { userId, direccionId, productos, total } = req.body;

console.log('Total recibido:', total); // Agrega este log para verificar en consola

if (!userId || !direccionId || !productos?.length || total === undefined) {
  return res.status(400).json({ success: false, error: 'Datos incompletos' });
}



  try {
    const pool = await poolPromise;

const insertPedidoQuery = `
  INSERT INTO PEDIDOS_TEMP (ID_CLIENTE, ID_DIRECCION, FECHA_PEDIDO, ESTADO, TOTAL)
  VALUES (@userId, @direccionId, GETDATE(), 1, @total);
  SELECT SCOPE_IDENTITY() AS pedidoId;
`;


const result = await pool.request()
  .input('userId', userId)
  .input('direccionId', direccionId)
  .input('total', total) // ¡Aquí falta esta línea!
  .query(insertPedidoQuery);

const pedidoId = result.recordset[0].pedidoId;

    const insertProductoQuery = `
      INSERT INTO PRODUCTOS_PEDIDOS_TEMP (ID_PRODUCTO, ID_PEDIDO, CANTIDAD)
      VALUES (@idProducto, @idPedido, @cantidad);
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

router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .query(`
SELECT 
  ID_PEDIDO AS id, 
  FECHA_PEDIDO AS fecha, 
  ESTADO AS estado,
  ID_DIRECCION AS direccionId, 
  ID_CLIENTE AS clienteId,
  TOTAL AS total
FROM PEDIDOS_TEMP
ORDER BY FECHA_PEDIDO DESC;

      `);

    res.json({ success: true, pedidos: result.recordset });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


export default router;
