import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Inventario</h3>
      <ul>
      <li><Link to="/admin/productos">Productos</Link></li>
      <li><Link to="/admin/agregar-producto">Agregar producto</Link></li>
        <li><Link to="/admin/actualizar-inventario">Actualizar inventario</Link></li>
      </ul>
      <h3>Ventas</h3>
      <ul>
        <li><Link to="/admin/ventas-por-categoria">Ventas por categoría</Link></li>
      </ul>
    </aside>
  );
}

export default Sidebar;