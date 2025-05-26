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
