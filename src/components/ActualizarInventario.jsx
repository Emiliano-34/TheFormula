// src/components/ActualizarInventario.js
import React from 'react';
import './ActualizarInventario.css';

const ActualizarInventario = () => {
  return (
    <div className="form-container">
      <div className="top-info">
        <div className="breadcrumb">Home / <span>Admin</span></div>
        <div className="welcome">¡Bienvenido! <span className="admin-name">Admin</span></div>
      </div>

      <h2 className="titulo-formulario">Actualizar Inventario</h2>

      <div className="form-card centered-card">
        <form className="form-grid">
          <div className="form-group">
            <label>SKU del producto*</label>
            <input type="text" placeholder="Ej. 123456" required />
          </div>

          <div className="form-group">
            <label>Cantidad a agregar*</label>
            <input type="number" placeholder="Ej. 10" min="1" required />
          </div>

          <div className="form-button">
            <button type="submit" className="btn">Actualizar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActualizarInventario;
