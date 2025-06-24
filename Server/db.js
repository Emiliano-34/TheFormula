// Server/db.js
import sql from 'mssql';

const config = {
  user: 'Ozuna',                 // ← asegurarte que es del tipo: usuario@servidor
  password: 'Admin-1234',
  server: 'theformula-sql.database.windows.net', // ✅ sin http:// y sin /
  database: 'THE_FORMULA',
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

const poolPromise = sql.connect(config);

export { sql, poolPromise };
