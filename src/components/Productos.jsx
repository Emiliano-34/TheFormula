// src/components/Productos.js
import React, { useEffect, useState } from 'react';
import './Productos.css';

const Productos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/products') // Cambia esto si tu ruta real es distinta
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error al obtener productos:', err));
  }, []);

  return (
    <div className="form-container">
      <div className="top-info">
        <div className="breadcrumb">Home / <span>Admin</span></div>
        <div className="welcome">¡Bienvenido! <span className="admin-name">Admin</span></div>
      </div>

      <h2 className="titulo-formulario">Productos</h2>

      <div className="form-card centered-card">
        <table className="products-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre del producto</th>
              <th>ID</th>
              <th>Cantidad</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, index) => (
              <tr key={index}>
                <td><img src={p.imagen} alt={p.nombre} width="40" /></td>
                <td>{p.nombre}</td>
                <td>{p.sku || p.id}</td>
                <td>{p.cantidad}</td>
                <td>${p.precio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Productos;
