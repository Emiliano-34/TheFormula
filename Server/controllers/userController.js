import { sql, poolPromise } from '../db.js';
import bcrypt from 'bcrypt';

// Registro de nuevo usuario
export const registerUser = async (req, res) => {
  const { nombre, apellido, correo, telefono, contrasena } = req.body;

  try {
    const pool = await poolPromise;
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await pool.request()
      .input('nombre', sql.NVarChar, nombre)
      .input('apellido', sql.NVarChar, apellido)
      .input('correo', sql.NVarChar, correo)
      .input('telefono', sql.VarChar, telefono)
      .input('contrasena', sql.VarChar, hashedPassword)
      .input('admin', sql.Bit, 0)
      .query(`
        INSERT INTO USUARIOS (NOMBRE, APELLIDO, CORREO, TELEFONO, CONTRASENA, ADMIN)
        VALUES (@nombre, @apellido, @correo, @telefono, @contrasena, @admin)
      `);

    const result = await pool.request()
      .input('correo', sql.NVarChar, correo)
      .query(`
        SELECT ID_USUARIO AS id, NOMBRE, APELLIDO, CORREO, ADMIN 
        FROM USUARIOS 
        WHERE CORREO = @correo
      `);

    res.status(201).json({ success: true, user: result.recordset[0] });

  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ success: false, error: 'Error del servidor al registrar usuario' });
  }
};

// Inicio de sesión
export const loginUser = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('correo', sql.NVarChar, correo)
      .query(`
        SELECT ID_USUARIO AS id, NOMBRE, APELLIDO, CORREO, CONTRASENA, ADMIN 
        FROM USUARIOS 
        WHERE CORREO = @correo
      `);

    const user = result.recordset[0];
    if (!user) return res.status(401).json({ success: false, error: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(contrasena, user.CONTRASENA);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Contraseña incorrecta' });

    delete user.CONTRASENA;
    res.status(200).json({ success: true, user });

  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ success: false, error: 'Error del servidor al iniciar sesión' });
  }
};

// Obtener usuario por ID
export const getUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'ID de usuario inválido' });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT 
  ID_USUARIO AS id, 
  NOMBRE AS nombre, 
  APELLIDO AS apellido, 
  CORREO AS correo, 
  TELEFONO AS telefono 
FROM USUARIOS 
WHERE ID_USUARIO = @id

      `);

    const user = result.recordset[0];
    if (!user) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });

    res.json({ success: true, user });

  } catch (err) {
    console.error('❌ Error fetching user:', err);
    res.status(500).json({ success: false, error: 'Error del servidor al obtener usuario' });
  }
};

// Actualizar perfil
export const updateUserProfile = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, apellido, telefono, nuevaContrasena } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: 'ID inválido' });
  }

  try {
    const pool = await poolPromise;

    if (nuevaContrasena) {
      const hashed = await bcrypt.hash(nuevaContrasena, 10);
      await pool.request()
        .input('id', sql.Int, id)
        .input('nombre', sql.NVarChar, nombre)
        .input('apellido', sql.NVarChar, apellido)
        .input('telefono', sql.VarChar, telefono)
        .input('contrasena', sql.VarChar, hashed)
        .query(`
          UPDATE USUARIOS 
          SET NOMBRE = @nombre, APELLIDO = @apellido, TELEFONO = @telefono, CONTRASENA = @contrasena
          WHERE ID_USUARIO = @id
        `);
    } else {
      await pool.request()
        .input('id', sql.Int, id)
        .input('nombre', sql.NVarChar, nombre)
        .input('apellido', sql.NVarChar, apellido)
        .input('telefono', sql.VarChar, telefono)
        .query(`
          UPDATE USUARIOS 
          SET NOMBRE = @nombre, APELLIDO = @apellido, TELEFONO = @telefono
          WHERE ID_USUARIO = @id
        `);
    }

    res.json({ success: true, message: 'Perfil actualizado correctamente' });

  } catch (err) {
    console.error('❌ Error actualizando perfil:', err);
    res.status(500).json({ success: false, error: 'Error del servidor al actualizar perfil' });
  }
};

// Crear cuenta admin temporal
export const crearAdmin = async (req, res) => {
  try {
    const pool = await poolPromise;
    const correoUnico = `admin${Date.now()}@theformula.com`;
    const hashed = await bcrypt.hash('admin123', 10);

    await pool.request()
      .input('nombre', sql.NVarChar, 'Admin')
      .input('apellido', sql.NVarChar, 'Prueba')
      .input('correo', sql.NVarChar, correoUnico)
      .input('telefono', sql.VarChar, '0000000000')
      .input('contrasena', sql.VarChar, hashed)
      .input('admin', sql.Bit, 1)
      .query(`
        INSERT INTO USUARIOS (NOMBRE, APELLIDO, CORREO, TELEFONO, CONTRASENA, ADMIN)
        VALUES (@nombre, @apellido, @correo, @telefono, @contrasena, @admin)
      `);

    res.status(201).json({
      success: true,
      message: 'Admin creado correctamente',
      correo: correoUnico
    });

  } catch (err) {
    console.error('❌ Error al crear admin:', err);
    res.status(500).json({ error: 'Error del servidor al crear admin' });
  }
};

export const getDireccionByUserId = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ success: false, error: 'ID inválido' });

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_usuario', sql.Int, id)
      .query(`
        SELECT 
          CALLE AS calle, 
          NUM_EXT AS numero, 
          MUNICIPIO AS ciudad, 
          ID_ESTADO AS estado, 
          CODIGO_POSTAL AS codigoPostal
        FROM DIRECCIONES
        WHERE ID_USUARIO = @id_usuario
      `);

    if (!result.recordset.length) {
      return res.status(404).json({ success: false, direccion: null });
    }

    res.json({ success: true, direccion: result.recordset[0] });
  } catch (err) {
    console.error('❌ Error al obtener dirección:', err);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};


export const saveDireccion = async (req, res) => {
  const idUsuario = parseInt(req.params.id);
  const { calle, numero, ciudad, estado, codigoPostal } = req.body;

  if (isNaN(idUsuario)) {
    return res.status(400).json({ success: false, error: 'ID inválido' });
  }

  try {
    const pool = await poolPromise;

    // Verificar si ya existe una dirección
    const check = await pool.request()
      .input('id_usuario', sql.Int, idUsuario)
      .query('SELECT COUNT(*) AS total FROM DIRECCIONES WHERE ID_USUARIO = @id_usuario');

    const existe = check.recordset[0].total > 0;

    if (existe) {
      // Actualizar dirección
      await pool.request()
        .input('id_usuario', sql.Int, idUsuario)
        .input('calle', sql.NVarChar, calle)
        .input('numero', sql.NVarChar, numero)
        .input('ciudad', sql.NVarChar, ciudad)
        .input('estado', sql.Int, parseInt(estado))
        .input('codigoPostal', sql.VarChar, codigoPostal)
        .query(`
          UPDATE DIRECCIONES
          SET CALLE = @calle, NUM_EXT = @numero, MUNICIPIO = @ciudad, ID_ESTADO = @estado, CODIGO_POSTAL = @codigoPostal
          WHERE ID_USUARIO = @id_usuario
        `);
    } else {
      // Insertar nueva dirección
      await pool.request()
        .input('id_usuario', sql.Int, idUsuario)
        .input('calle', sql.NVarChar, calle)
        .input('numero', sql.NVarChar, numero)
        .input('ciudad', sql.NVarChar, ciudad)
        .input('estado', sql.Int, parseInt(estado))
        .input('codigoPostal', sql.VarChar, codigoPostal)
        .query(`
          INSERT INTO DIRECCIONES (ID_USUARIO, CALLE, NUM_EXT, MUNICIPIO, ID_ESTADO, CODIGO_POSTAL)
          VALUES (@id_usuario, @calle, @numero, @ciudad, @estado, @codigoPostal)
        `);
    }

    res.json({ success: true, message: existe ? 'Dirección actualizada' : 'Dirección guardada correctamente' });

  } catch (err) {
    console.error('❌ Error guardando dirección:', err);
    res.status(500).json({ success: false, error: 'Error del servidor al guardar dirección' });
  }
};

export const updateDireccionByUserId = async (req, res) => {
  const id = parseInt(req.params.id);
  const { calle, numero, ciudad, estado, codigoPostal } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: 'ID inválido' });
  }

  try {
    const pool = await poolPromise;

    const existe = await pool.request()
      .input('id_usuario', sql.Int, id)
      .query('SELECT 1 FROM DIRECCIONES WHERE ID_USUARIO = @id_usuario');

    if (existe.recordset.length) {
      // Actualiza dirección existente
      await pool.request()
        .input('id_usuario', sql.Int, id)
        .input('calle', sql.NVarChar, calle)
        .input('numero', sql.VarChar, numero)
        .input('ciudad', sql.NVarChar, ciudad)
        .input('estado', sql.Int, estado)
        .input('codigoPostal', sql.VarChar, codigoPostal)
        .query(`
          UPDATE DIRECCIONES
          SET CALLE = @calle, NUM_EXT = @numero, MUNICIPIO = @ciudad,
              ID_ESTADO = @estado, CODIGO_POSTAL = @codigoPostal
          WHERE ID_USUARIO = @id_usuario
        `);
    } else {
      // Inserta nueva dirección
      await pool.request()
        .input('id_usuario', sql.Int, id)
        .input('calle', sql.NVarChar, calle)
        .input('numero', sql.VarChar, numero)
        .input('ciudad', sql.NVarChar, ciudad)
        .input('estado', sql.Int, estado)
        .input('codigoPostal', sql.VarChar, codigoPostal)
        .query(`
          INSERT INTO DIRECCIONES (ID_USUARIO, CALLE, NUM_EXT, MUNICIPIO, ID_ESTADO, CODIGO_POSTAL)
          VALUES (@id_usuario, @calle, @numero, @ciudad, @estado, @codigoPostal)
        `);
    }

    res.json({ success: true, message: 'Dirección guardada correctamente' });

  } catch (err) {
    console.error('❌ Error al guardar dirección:', err);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

export const getMetodoPagoByUserId = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT 
  MP.ID_METODO AS id_metodo, 
  MP.TITULAR AS titular, 
  MP.NUMERO_ENMASCARADO AS numero_enmascarado, 
  MP.VENCIMIENTO as vencimiento, 
  TP.NOMBRE AS tipo
FROM METODOS_PAGO MP
JOIN TIPOS_METODO_PAGO TP ON MP.ID_TIPO = TP.ID_TIPO
WHERE MP.ID_USUARIO = @id

      `);

    if (!result.recordset.length) {
      return res.status(404).json({ success: false, metodos: [] });
    }

    res.json({ success: true, metodos: result.recordset });
  } catch (err) {
    console.error('❌ Error al obtener método de pago:', err);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

export const updateMetodoPagoByUserId = async (req, res) => {
  const id = parseInt(req.params.id);
  const { titular, numero, vencimiento, tipoId = 1 } = req.body;

  try {
    const pool = await poolPromise;

    const numeroEnmascarado = numero.slice(-4).padStart(numero.length, '*');

    // Siempre INSERTAR, no actualizar
    await pool.request()
      .input('titular', sql.NVarChar, titular)
      .input('numero', sql.VarChar, numeroEnmascarado)
      .input('vencimiento', sql.VarChar, vencimiento)
      .input('id_usuario', sql.Int, id)
      .input('id_tipo', sql.Int, tipoId)
      .query(`
        INSERT INTO METODOS_PAGO (ID_USUARIO, ID_TIPO, TITULAR, NUMERO_ENMASCARADO, VENCIMIENTO)
        VALUES (@id_usuario, @id_tipo, @titular, @numero, @vencimiento)
      `);

    res.json({ success: true, message: 'Método de pago guardado correctamente' });
  } catch (err) {
    console.error('❌ Error al guardar método de pago:', err);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};


export const getTiposMetodoPago = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.query(`SELECT ID_TIPO AS id_tipo, NOMBRE AS nombre FROM TIPOS_METODO_PAGO`);
    res.json({ success: true, tipos: result.recordset });
  } catch (err) {
    console.error('❌ Error al obtener tipos de método de pago:', err);
    res.status(500).json({ success: false, error: 'Error al obtener tipos' });
  }
};

export const deleteMetodoPagoByUserId = async (req, res) => {
  const id = parseInt(req.params.id);
  const idMetodo = parseInt(req.params.idMetodo);

  if (isNaN(id) || isNaN(idMetodo)) {
    return res.status(400).json({ success: false, error: 'ID inválido' });
  }

  try {
    const pool = await poolPromise;

    await pool.request()
      .input('idMetodo', sql.Int, idMetodo)
      .input('idUsuario', sql.Int, id)
      .query(`
        DELETE FROM METODOS_PAGO
        WHERE ID_METODO = @idMetodo AND ID_USUARIO = @idUsuario
      `);

    res.json({ success: true, message: 'Método de pago eliminado correctamente' });
  } catch (err) {
    console.error('❌ Error al eliminar método de pago:', err);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};
