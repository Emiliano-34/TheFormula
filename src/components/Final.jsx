// src/components/Final.js
import React from 'react';
import Stepper from './PasoStepper';
import './Final.css';
import check from '../assets/check.png'; // Asegúrate de tener esta imagen

const Final = () => {
  return (
    <div className="form-container">
      <div className="top-info">
        <div className="breadcrumb">Home / <span>Admin</span></div>
        <div className="welcome">¡Bienvenido! <span className="admin-name">Admin</span></div>
      </div>

      <h2 className="titulo-formulario">Nuevo Producto</h2>

      <Stepper currentStep={6} />

      <div className="final-card">
        <img src={check} alt="check" className="check-icon" />

        <p className="success-message">
          ¡El nuevo producto ha sido guardado exitosamente!
        </p>

        <div className="final-buttons">
          <button className="btn btn-outline">Ver producto</button>
          <button className="btn btn-filled">Comenzar venta</button>
        </div>
      </div>
    </div>
  );
};

export default Final;
