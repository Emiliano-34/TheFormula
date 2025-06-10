import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper from './PasoStepper';
import './DetallesProducto.css';

const categoriasFijas = [
  { id: 1, nombre: 'Proteínas' },
  { id: 2, nombre: 'Vitaminas' },
  { id: 3, nombre: 'Pre-entrenadores' },
  { id: 4, nombre: 'Creatinas' },
  { id: 5, nombre: 'Omegas y Probióticos' },
];

const DetallesProducto = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    categoria: '',
    codigo: '',
    precio: '',
    costo: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(form).every((v) => v.trim() !== '')) {
      // Aquí puedes hacer llamada a backend para guardar producto nuevo
      navigate('/admin/Imagen');
    } else {
      alert('Por favor, complete todos los campos');
    }
  };

  return (
    <div className="form-container">
      <div className="top-info">
        <div className="breadcrumb">Home / <span>Admin</span></div>
        <div className="welcome">¡Bienvenido! <span className="admin-name">Admin</span></div>
      </div>

      <h2 className="titulo-formulario">Nuevo Producto</h2>

      <Stepper currentStep={2} />

      <div className="form-card">
        <form className="form-grid" onSubmit={handleSubmit}>
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
              pattern="\d{13}"
              maxLength={13}
              value={form.codigo}
              onChange={handleChange}
              required
              title="El código debe contener exactamente 13 dígitos numéricos"
            />
          </div>

          <div className="form-group">
            <label>Precio*</label>
            <input
              name="precio"
              type="number"
              placeholder="Ej. $100.00"
              value={form.precio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ flex: '1 1 100%' }}>
            <label>Costo*</label>
            <input
              name="costo"
              type="number"
              placeholder="Ej. $50.00"
              value={form.costo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-button">
            <button type="submit" className="btn">Siguiente</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DetallesProducto;
