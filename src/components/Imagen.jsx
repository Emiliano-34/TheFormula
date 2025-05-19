// src/components/Imagen.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper from './PasoStepper';
import './Imagen.css';

import iconoImagen from '../assets/imagen.png';
import iconoAgregar from '../assets/agregar.png';

const Imagen = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);

  const handleFinish = () => {
    navigate('/Final');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  return (
    <div className="form-container">
      <div className="top-info">
        <div className="breadcrumb">Home / <span>Admin</span></div>
        <div className="welcome">¡Bienvenido! <span className="admin-name">Admin</span></div>
      </div>

      <h2 className="titulo-formulario">Nuevo Producto</h2>

      <Stepper currentStep={5} />

      <div className="form-card centered-card">
        <form className="form-grid">
          <div className="form-group image-upload">
            <div className="image-section">
              <div className="image-item">
                <label className="label-text">Imágen*</label>
                <img
                  src={preview || iconoImagen}
                  alt="Vista previa"
                  className="icono"
                />
              </div>
              <div className="image-item">
                <label className="label-text">Agregar imágen</label>
                <label htmlFor="file-upload" className="upload-label">
                  <img src={iconoAgregar} alt="Agregar" className="icono" />
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    hidden
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="form-group" style={{ flex: '1 1 100%' }}>
            <label>Descripción</label>
            <textarea placeholder="Añada una descripción" rows={3}></textarea>
          </div>

          <div className="form-group" style={{ flex: '1 1 100%' }}>
            <label>Comentarios</label>
            <input type="text" placeholder="En días" />
          </div>

          <div className="form-button">
            <button type="button" className="btn" onClick={handleFinish}>Finalizar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Imagen;
