import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const archivos = [
  'creatinas',
  'omegasYProb',
  'preentrenadores',
  'proteinas',
  'vitaminas',
];

export function cargarCatalogoProductos() {
  const productos = [];

  archivos.forEach(nombreArchivo => {
    const filePath = path.join('Server/data', `${nombreArchivo}.csv`);
    if (fs.existsSync(filePath)) {
      const contenido = fs.readFileSync(filePath, 'utf-8');
      const registros = parse(contenido, {
        columns: true,
        skip_empty_lines: true,
      });

      registros.forEach(reg => {
        productos.push({
          nombre: reg.producto_nombre,
          ingredientes: reg.ingredientes,
          categoria: nombreArchivo
        });
      });
    }
  });

  return productos;
}
