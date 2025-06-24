// Server/controllers/cartController.js
import { sql, poolPromise } from '../db.js';

// Obtener productos del carrito del cliente
export const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('id_cliente', sql.Int, userId)
      .query(`
        SELECT PCC.ID_PRODUCTO, PCC.CANTIDAD, 
               P.NOMBRE, P.IMAGEN, P.PRECIO
        FROM PRODUCTOS_CARRITO_COMPRAS PCC
        JOIN PRODUCTOS P ON PCC.ID_PRODUCTO = P.ID
        WHERE PCC.ID_CLIENTE = @id_cliente
      `);

    const cartItems = result.recordset.map(item => ({
      product: {
        id: item.ID_PRODUCTO,
        name: item.NOMBRE,
        image: item.IMAGEN
      },
      quantity: item.CANTIDAD,
      price: item.PRECIO
    }));

    res.json({
      items: cartItems,
      coupon: null
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

// Agregar producto al carrito
export const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  try {
    const pool = await poolPromise;

    // Verificar si el producto ya está en el carrito
    const existing = await pool.request()
      .input('id_cliente', sql.Int, userId)
      .input('id_producto', sql.Int, productId)
      .query(`
        SELECT CANTIDAD FROM PRODUCTOS_CARRITO_COMPRAS 
        WHERE ID_CLIENTE = @id_cliente AND ID_PRODUCTO = @id_producto
      `);

    if (existing.recordset.length > 0) {
      // Actualizar cantidad
      const newQuantity = existing.recordset[0].CANTIDAD + quantity;
      await pool.request()
        .input('id_cliente', sql.Int, userId)
        .input('id_producto', sql.Int, productId)
        .input('cantidad', sql.Int, newQuantity)
        .query(`
          UPDATE PRODUCTOS_CARRITO_COMPRAS 
          SET CANTIDAD = @cantidad 
          WHERE ID_CLIENTE = @id_cliente AND ID_PRODUCTO = @id_producto
        `);
    } else {
      // Insertar nuevo producto
      await pool.request()
        .input('id_cliente', sql.Int, userId)
        .input('id_producto', sql.Int, productId)
        .input('cantidad', sql.Int, quantity)
        .query(`
          INSERT INTO PRODUCTOS_CARRITO_COMPRAS (ID_CLIENTE, ID_PRODUCTO, CANTIDAD)
          VALUES (@id_cliente, @id_producto, @cantidad)
        `);
    }

    return getCart(req, res); // devolver carrito actualizado

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
};

// Eliminar un producto del carrito
export const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input('id_cliente', sql.Int, userId)
      .input('id_producto', sql.Int, productId)
      .query(`
        DELETE FROM PRODUCTOS_CARRITO_COMPRAS
        WHERE ID_CLIENTE = @id_cliente AND ID_PRODUCTO = @id_producto
      `);

    return getCart(req, res); // devolver carrito actualizado

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar del carrito' });
  }
};

// Limpiar todo el carrito del cliente
export const clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input('id_cliente', sql.Int, userId)
      .query(`
        DELETE FROM PRODUCTOS_CARRITO_COMPRAS
        WHERE ID_CLIENTE = @id_cliente
      `);

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al vaciar el carrito' });
  }
};

// Actualizar la cantidad de un producto en el carrito
export const updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Cantidad inválida' });
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('id_cliente', sql.Int, userId)
      .input('id_producto', sql.Int, itemId)
      .input('cantidad', sql.Int, quantity)
      .query(`
        UPDATE PRODUCTOS_CARRITO_COMPRAS
        SET CANTIDAD = @cantidad
        WHERE ID_CLIENTE = @id_cliente AND ID_PRODUCTO = @id_producto
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Error al actualizar cantidad:', error);
    res.status(500).json({ error: 'Error al actualizar el producto del carrito' });
  }
};

// Aplicar un cupón de descuento
export const applyCoupon = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Código de cupón requerido' });
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('codigo', sql.VarChar, code)
      .query(`
        SELECT CODIGO, PORCENTAJE
        FROM CUPONES
        WHERE CODIGO = @codigo AND ACTIVO = 1
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Cupón no válido o inactivo' });
    }

    const coupon = result.recordset[0];

    res.json({
      success: true,
      coupon: {
        code: coupon.CODIGO,
        discount: coupon.PORCENTAJE
      }
    });

  } catch (error) {
    console.error('Error al aplicar cupón:', error);
    res.status(500).json({ error: 'Error al aplicar el cupón' });
  }
};
