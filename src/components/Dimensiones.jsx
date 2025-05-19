import React from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper from './PasoStepper';
import './Dimensiones.css';

const Dimensiones = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/pasoMarca'); // 🔁 Ruta corregida
  };

  return (
    <div className="form-container">
      <div className="top-info">
        <div className="breadcrumb">Home / <span>Admin</span></div>
        <div className="welcome">¡Bienvenido! <span className="admin-name">Admin</span></div>
      </div>

      <h2 className="titulo-formulario">Nuevo Producto</h2>

      <Stepper currentStep={3} />

      <div className="form-card centered-card">
        <form className="form-grid">
          <div className="form-group">
            <label>Altura*</label>
            <input type="number" placeholder="0 cm" required />
          </div>

          <div className="form-group">
            <label>Longitud*</label>
            <input type="number" placeholder="0 cm" required />
          </div>

          <div className="form-group">
            <label>Ancho*</label>
            <input type="number" placeholder="0 cm" required />
          </div>

          <div className="form-group">
            <label>Peso*</label>
            <input type="number" placeholder="0 g" required />
          </div>

          <div className="form-button">
            <button type="button" className="btn" onClick={handleNext}>
              Siguiente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dimensiones;
