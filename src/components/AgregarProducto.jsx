import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AgregarProducto.css';

const categoriasFijas = [
  { id: 1, nombre: 'Proteínas' },
  { id: 2, nombre: 'Vitaminas' },
  { id: 3, nombre: 'Pre-entrenadores' },
  { id: 4, nombre: 'Creatinas' },
  { id: 5, nombre: 'Omegas y Probióticos' },
];

const AgregarProducto = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    categoria: '',
    codigo: '',
    precio: '',
    costo: '',
    nombre: '',
    descripcion: '',
    imagenUrl: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(form).some(v => v.trim() === '')) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_producto: form.nombre,
          codigo_barras: form.codigo,
          id_categoria: parseInt(form.categoria, 10),
          precio: parseFloat(form.precio),
          costo: parseFloat(form.costo),
          descripcion: form.descripcion,
          imagen_url: form.imagenUrl,
          existencias: 0,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Producto agregado con éxito');
        // Navegamos con reload=true para que la lista se recargue
        navigate('/admin?reload=true');
      } else {
        alert('Error al agregar producto: ' + (data.error || 'Desconocido'));
      }
    } catch (error) {
      console.error('Error al agregar producto:', error);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div className="form-container">
      <h2>Agregar nuevo producto</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        {/* Campos del formulario */}
        <div className="form-group">
          <label>Nombre*</label>
          <input
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre del producto"
            required
          />
        </div>
        <div className="form-group">
          <label>Categoría*</label>
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una categoría</option>
            {categoriasFijas.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Código de barras*</label>
          <input
            name="codigo"
            type="text"
            placeholder="Ej. 7500000000000"
            maxLength={13}
            pattern="\d{13}"
            value={form.codigo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Precio*</label>
          <input
            name="precio"
            type="number"
            step="0.01"
            value={form.precio}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Costo*</label>
          <input
            name="costo"
            type="number"
            step="0.01"
            value={form.costo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group" style={{ flex: '1 1 100%' }}>
          <label>Descripción*</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group" style={{ flex: '1 1 100%' }}>
          <label>URL de la imagen*</label>
          <input
            name="imagenUrl"
            type="url"
            placeholder="https://..."
            value={form.imagenUrl}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-button" style={{ flex: '1 1 100%', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn">Agregar Producto</button>
        </div>
      </form>
    </div>
  );
};

export default AgregarProducto;
