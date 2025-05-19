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
  const targetDate = '2025-04-25'; // Puedes cambiar esta fecha por req.query.fecha si se desea

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
        WHERE HV.FECHA = @fecha
        AND P.EXISTENCIAS > 0
        ORDER BY HV.CANT_VENTAS DESC
        OFFSET 0 ROWS FETCH NEXT 4 ROWS ONLY
      `);

    const products = result.recordset.map(product => ({
      ...product,
      deal_end: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }));

    return res.json({ success: true, products });

  } catch (err) {
    console.error('Error fetching flash deals:', err);
    return res.status(500).json({
      success: false,
      error: 'Database operation failed'
    });
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

    res.json({
      success: true,
      categories: result.recordset
    });

  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({
      success: false,
      error: 'Error al obtener las categorías'
    });
  }
};
