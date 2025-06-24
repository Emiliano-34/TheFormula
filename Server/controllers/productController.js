import { sql, poolPromise } from '../db.js';

export const getFeaturedProducts = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT
        P.ID_PRODUCTO AS id,
        P.NOMBRE_PRODUCTO AS name,
        ISNULL(ROUND(P.PRECIO * (1 - O.DESCUENTO / 100.0), 2), P.PRECIO) AS price,
        P.PRECIO AS originalPrice,
        P.IMAGEN_URL AS image,
        P.CALIFICACION AS rating,
        ISNULL(R.review_count, 0) AS reviews,
        P.VENDIDOS AS sold,
        O.DESCUENTO AS discountPercent
      FROM PRODUCTOS P
      LEFT JOIN (
        SELECT * FROM OFERTAS
        WHERE FECHA_INICIO <= GETDATE() AND FECHA_FIN >= GETDATE()
      ) O ON P.ID_PRODUCTO = O.ID_PRODUCTO
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

export const getCategories = async (req, res) => {
  try {
    const pool = await poolPromise;
    // CORRECCIÓN DEFINITIVA: Usando el nombre de tabla correcto 'CATEGORIA'
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

// ... (El resto de las funciones se mantienen igual)
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
          P.ID_PRODUCTO AS id,
          P.NOMBRE_PRODUCTO AS name,
          ISNULL(ROUND(P.PRECIO * (1 - O.DESCUENTO / 100.0), 2), P.PRECIO) AS price,
          P.PRECIO AS originalPrice,
          P.IMAGEN_URL AS image,
          O.DESCUENTO AS discountPercent
        FROM PRODUCTOS P
        LEFT JOIN (
          SELECT * FROM OFERTAS
          WHERE FECHA_INICIO <= GETDATE() AND FECHA_FIN >= GETDATE()
        ) O ON P.ID_PRODUCTO = O.ID_PRODUCTO
        WHERE
          P.ID_CATEGORIA = @categoriaId
          AND P.EXISTENCIAS > 0
          AND P.ID_PRODUCTO != @productoId
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
        P.ID_PRODUCTO AS id,
        P.NOMBRE_PRODUCTO AS name,
        P.CODIGO_BARRAS AS codigo_barras,
        P.ID_CATEGORIA AS categoriaId,
        P.PRECIO AS price,
        P.COSTO AS costo,
        P.EXISTENCIAS AS existencias,
        ISNULL(P.IMAGEN_URL, '') AS image
      FROM PRODUCTOS P
    `);
    res.json({ success: true, products: result.recordset });
  } catch (err) {
    console.error('Error al obtener todos los productos:', err);
    res.status(500).json({ success: false, message: 'Error al obtener productos' });
  }
};


export const getOfertasActivas = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT
        O.ID_PRODUCTO AS id,
        P.NOMBRE_PRODUCTO AS name,
        ROUND(P.PRECIO * (1 - O.DESCUENTO / 100.0), 2) AS price,
        P.PRECIO AS originalPrice,
        P.IMAGEN_URL AS image,
        P.CALIFICACION AS rating,
        O.DESCUENTO AS discountPercent,
        O.FECHA_FIN AS deal_end
      FROM OFERTAS O
      JOIN PRODUCTOS P ON P.ID_PRODUCTO = O.ID_PRODUCTO
      WHERE
        O.FECHA_INICIO <= GETDATE()
        AND O.FECHA_FIN >= GETDATE()
        AND P.EXISTENCIAS > 0
    `);

    res.json({ success: true, products: result.recordset });
  } catch (err) {
    console.error('Error al obtener ofertas activas:', err);
    res.status(500).json({ success: false, message: 'Error al obtener ofertas activas' });
  }
};

export const searchProducts = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === '') {
    return res.json({ success: true, products: [] });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('q', sql.VarChar, `%${q}%`)
      .query(`
        SELECT
          P.ID_PRODUCTO AS id,
          P.NOMBRE_PRODUCTO AS name,
          ROUND(
            CASE
              WHEN O.DESCUENTO IS NOT NULL THEN P.PRECIO * (1 - O.DESCUENTO / 100.0)
              ELSE P.PRECIO
            END, 2
          ) AS price,
          P.PRECIO AS originalPrice,
          P.IMAGEN_URL AS image,
          P.CALIFICACION AS rating,
          ISNULL(O.DESCUENTO, 0) AS discountPercent
        FROM PRODUCTOS P
        LEFT JOIN OFERTAS O
          ON O.ID_PRODUCTO = P.ID_PRODUCTO
          AND O.FECHA_INICIO <= GETDATE()
          AND O.FECHA_FIN >= GETDATE()
        WHERE P.NOMBRE_PRODUCTO LIKE @q
      `);

    res.json({ success: true, products: result.recordset });
  } catch (err) {
    console.error('Error en búsqueda:', err);
    res.status(500).json({ success: false, message: 'Error al buscar productos' });
  }
};

export const createProduct = async (req, res) => {
  const { nombre_producto, codigo_barras, id_categoria, precio, costo, descripcion, imagen_url } = req.body;

  if (!nombre_producto || !codigo_barras || !id_categoria || !precio || !costo || !descripcion || !imagen_url) {
    return res.status(400).json({ success: false, error: 'Datos incompletos' });
  }

  try {
    const pool = await poolPromise;

    const randomId = Math.floor(100000 + Math.random() * 900000);

    const insertQuery = `
      INSERT INTO PRODUCTOS
      (ID_PRODUCTO, NOMBRE_PRODUCTO, CODIGO_BARRAS, ID_CATEGORIA, PRECIO, COSTO, DESCRIPCION, EXISTENCIAS, CALIFICACION, IMAGEN_URL)
      VALUES (@idProducto, @nombre, @codigo, @categoria, @precio, @costo, @descripcion, 0, 0, @imagenUrl)
    `;

    await pool.request()
      .input('idProducto', sql.Int, randomId)
      .input('nombre', sql.VarChar, nombre_producto)
      .input('codigo', sql.VarChar, codigo_barras)
      .input('categoria', sql.Int, id_categoria)
      .input('precio', sql.Decimal(10, 2), precio)
      .input('costo', sql.Decimal(10, 2), costo)
      .input('descripcion', sql.VarChar, descripcion)
      .input('imagenUrl', sql.VarChar, imagen_url)
      .query(insertQuery);

    res.json({ success: true, message: 'Producto agregado correctamente', idProducto: randomId });
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
