// src/components/PasoMarca.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper from './PasoStepper';
import './PasoMarca.css';

const PasoMarca = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/Imagen');
  };

  return (
    <div className="form-container">
      <div className="top-info">
        <div className="breadcrumb">Home / <span>Admin</span></div>
        <div className="welcome">¡Bienvenido! <span className="admin-name">Admin</span></div>
      </div>

      <h2 className="titulo-formulario">Nuevo Producto</h2>

      <Stepper currentStep={4} />

      <div className="form-card centered-card">
        <form className="form-grid">
          <div className="form-group">
            <label>Marca*</label>
            <input type="text" placeholder="Ingrese marca" required />
          </div>


          <div className="form-group">
            <label>Material*</label>
            <input type="text" placeholder="Ingrese material" required />
          </div>

          <div className="form-group">
            <label>País de origen*</label>
            <select required>
              <option value="">Seleccione un país de origen</option>
              <option value="mexico">México</option>
              <option value="usa">Estados Unidos</option>
              <option value="china">China</option>
              <option value="alemania">Alemania</option>
              <option value="japon">Japón</option>
              <option value="canada">Canadá</option>
              <option value="francia">Francia</option>
              <option value="italia">Italia</option>
              <option value="brasil">Brasil</option>
              <option value="españa">España</option>
            </select>
          </div>

          <div className="form-group" style={{ flex: '1 1 100%' }}>
            <label>Plazo máximo de devolución*</label>
            <input type="text" placeholder="En días" required />
          </div>

          <div className="form-button">
            <button type="button" className="btn" onClick={handleNext}>Siguiente</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasoMarca;
