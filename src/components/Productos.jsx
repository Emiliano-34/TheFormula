import React, { useEffect, useState } from 'react';
import './Productos.css';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/products/all')
      .then(res => res.json())
      .then(data => setProductos(data.products || []))
      .catch(err => console.error('Error al obtener productos:', err));

    fetch('http://localhost:3001/api/products/categories')
      .then(res => res.json())
      .then(data => setCategorias(data.categories || []))
      .catch(err => console.error('Error al obtener categorías:', err));
  }, []);

const productosFiltrados = productos.filter(p => {
  const coincideCategoria = categoriaSeleccionada
    ? p.categoriaId === parseInt(categoriaSeleccionada)
    : true;

  // Validar que p.nombre exista antes de usar toLowerCase
  const nombreProducto = p.nombre || ''; // Si no existe, cadena vacía
  const coincideBusqueda = nombreProducto.toLowerCase().includes(busqueda.toLowerCase());

  return coincideCategoria && coincideBusqueda;
});


  return (
    <div className="form-container">
      <div className="top-info">
        <div className="breadcrumb">Home / <span>Admin</span></div>
        <div className="welcome">¡Bienvenido! <span className="admin-name">Admin</span></div>
      </div>

      <h2 className="titulo-formulario">Productos</h2>

      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '40px' }}>
        <div className="filtro-categoria" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="categoriaFiltro" style={{ fontWeight: '600', fontSize: '14px' }}>Filtrar por categoría:</label>
          <select
            id="categoriaFiltro"
            value={categoriaSeleccionada}
            onChange={e => setCategoriaSeleccionada(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '14px',
              minWidth: '180px',
              cursor: 'pointer'
            }}
          >
            <option value="">Todas</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="buscador-producto" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="busquedaProducto" style={{ fontWeight: '600', fontSize: '14px' }}>Buscar producto:</label>
          <input
            type="text"
            id="busquedaProducto"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Nombre del producto"
            style={{
              padding: '6px 12px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '14px',
              width: '250px',
            }}
          />
        </div>
      </div>

      <div className="form-card centered-card">
        <table className="products-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>ID</th>
              <th>Código de Barras</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Costo</th>
              <th>Existencias</th>
            </tr>
          </thead>
<tbody>
  {productosFiltrados.map((p) => (
    <tr key={p.id}>
      <td><img src={p.imagen || ''} alt={p.nombre} width="100" /></td>
      <td>{p.nombre}</td>
      <td>{p.id}</td>
      <td>{p.codigo_barras}</td>
      <td>{p.categoriaId}</td>
      <td>${p.precio}</td>
      <td>${p.costo}</td>
      <td>{p.existencias}</td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default Productos;