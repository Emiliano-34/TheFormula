import { sql, poolPromise } from '../db.js';

export const getFeaturedProducts = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        P.ID_PRODUCTO AS id,
        P.NOMBRE_PRODUCTO AS name,
        P.PRECIO AS price,
        P.COSTO AS originalPrice,
        P.IMAGEN_URL AS image,
        P.CALIFICACION AS rating,
        ISNULL(R.review_count, 0) AS reviews,
        P.VENDIDOS AS sold
      FROM PRODUCTOS P
      LEFT JOIN (
        SELECT ID_PRODUCTO, COUNT(*) AS review_count
        FROM RESENAS
        GROUP BY ID_PRODUCTO
      ) R ON P.ID_PRODUCTO = R.ID_PRODUCTO
      WHERE P.EXISTENCIAS > 0
      ORDER BY P.VENDIDOS DESC
      OFFSET 0 ROWS FETCH NEXT 8 ROWS ONLY
    `);
    res.json({ success: true, products: result.recordset });
  } catch (err) {
    console.error('Error fetching featured products:', err);
    res.status(500).json({ success: false, error: 'Error al obtener los productos destacados' });
  }
};

export const getFlashDealProducts = async (req, res) => {
  const targetDate = '2025-04-25';
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('fecha', sql.Date, targetDate)
      .query(`
        SELECT 
          P.ID_PRODUCTO AS id,
          P.NOMBRE_PRODUCTO AS name,
          P.PRECIO AS price,
          P.COSTO AS original_price,
          P.CALIFICACION AS rating,
          HV.CANT_VENTAS AS sold_today,
          ROUND((P.PRECIO - P.COSTO) / P.PRECIO * 100, 0) AS discount_percent
        FROM PRODUCTOS P
        JOIN HISTORIA_VENTAS HV ON P.ID_PRODUCTO = HV.ID_PRODUCTO
        WHERE HV.FECHA = @fecha AND P.EXISTENCIAS > 0
        ORDER BY HV.CANT_VENTAS DESC
        OFFSET 0 ROWS FETCH NEXT 4 ROWS ONLY
      `);
    const products = result.recordset.map(p => ({
      ...p,
      deal_end: new Date(Date.now() + 86400000).toISOString()
    }));
    res.json({ success: true, products });
  } catch (err) {
    console.error('Error fetching flash deals:', err);
    res.status(500).json({ success: false, error: 'Error al obtener ofertas fugaces' });
  }
};

export const getCategories = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT ID_CATEGORIA AS id, NOMBRE_CATEGORIA AS name
      FROM CATEGORIA
      ORDER BY NOMBRE_CATEGORIA
    `);
    res.json({ success: true, categories: result.recordset });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ success: false, error: 'Error al obtener las categorías' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, parsedId)
      .query(`
        SELECT 
          P.ID_PRODUCTO AS id,
          P.NOMBRE_PRODUCTO AS name,
          P.PRECIO AS price,
          P.DESCRIPCION AS description,
          P.IMAGEN_URL AS image,
          P.CALIFICACION AS rating,
          P.ID_CATEGORIA AS categoriaId,
          ISNULL(R.review_count, 0) AS reviews
        FROM PRODUCTOS P
        LEFT JOIN (
          SELECT ID_PRODUCTO, COUNT(*) AS review_count
          FROM RESENAS
          GROUP BY ID_PRODUCTO
        ) R ON P.ID_PRODUCTO = R.ID_PRODUCTO
        WHERE P.ID_PRODUCTO = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    res.json({ success: true, product: result.recordset[0] });
  } catch (err) {
    console.error('Error al obtener producto:', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

export const getProductosRelacionados = async (req, res) => {
  try {
    const { categoriaId, productoId } = req.params;
    const parsedCat = parseInt(categoriaId);
    const parsedProd = parseInt(productoId);

    if (isNaN(parsedCat) || isNaN(parsedProd)) {
      return res.status(400).json({ success: false, message: 'Parámetros inválidos' });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('categoriaId', sql.Int, parsedCat)
      .input('productoId', sql.Int, parsedProd)
      .query(`
        SELECT TOP 4 
          ID_PRODUCTO AS id,
          NOMBRE_PRODUCTO AS name,
          PRECIO AS price,
          IMAGEN_URL AS image
        FROM PRODUCTOS
        WHERE ID_CATEGORIA = @categoriaId 
          AND EXISTENCIAS > 0 
          AND ID_PRODUCTO != @productoId
        ORDER BY NEWID()
      `);
    res.json({ success: true, products: result.recordset });
  } catch (err) {
    console.error('Error al obtener productos relacionados:', err);
    res.status(500).json({ success: false, message: 'Error al obtener productos relacionados' });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        ID_PRODUCTO AS id,
        NOMBRE_PRODUCTO AS name,
        PRECIO AS price,
        COSTO AS originalPrice,
        ISNULL(IMAGEN_URL, '') AS image,
        CALIFICACION AS rating,
        ID_CATEGORIA AS categoriaId
      FROM PRODUCTOS
      WHERE EXISTENCIAS > 0
    `);
    res.json({ success: true, products: result.recordset });
  } catch (err) {
    console.error('Error al obtener todos los productos:', err);
    res.status(500).json({ success: false, message: 'Error al obtener productos' });
  }
};
