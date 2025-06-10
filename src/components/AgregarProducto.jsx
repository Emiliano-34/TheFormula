import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AgregarProducto.css';

function AgregarProducto() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/admin/detalles');
  };

  return (
    <div className="form-container">
      <div className="top-info">
        <div className="breadcrumb">Home / <span>Admin</span></div>
        <div className="welcome">¡Bienvenido! <span className="admin-name">Admin</span></div>
      </div>

      <h2>Nuevo Producto</h2>
      <div className="stepper">
        <div className="step active">01</div>
        <div className="line"></div>
        <div className="step">02</div>
        <div className="line"></div>
        <div className="step">03</div>
        <div className="line"></div>
      </div>

      <form onSubmit={handleSubmit}>
        <label>Nombre del producto*</label>
        <input type="text" placeholder="Ingrese el nombre del producto" required />

        <button className="btn" type="submit">Siguiente</button>
      </form>
    </div>
  );
}

export default AgregarProducto;
