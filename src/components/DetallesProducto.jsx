import React from 'react';
import Stepper from './PasoStepper';
import { Link } from 'react-router-dom';
import './DetallesProducto.css';

const DetallesProducto = () => {
  return (
    <div className="form-container">
      <div className="top-info">
        <div className="breadcrumb">Home / <span>Admin</span></div>
        <div className="welcome">¡Bienvenido! <span className="admin-name">Admin</span></div>
      </div>

      <h2 className="titulo-formulario">Nuevo Producto</h2>

      <Stepper currentStep={2} />

      <div className="form-card">
        <form className="form-grid">
          <div className="form-group">
            <label>categoría*</label>
            <select required>
              <option value="">Selecciona una categoría</option>
              <option value="proteina">Proteína</option>
              <option value="vitaminas">Vitaminas</option>
            </select>
          </div>

          <div className="form-group">
            <label>SKU*</label>
            <input type="text" placeholder="Ej. 123456" required />
          </div>

          <div className="form-group">
  <label>Código de barras*</label>
  <input
    type="number"
    placeholder="Ej. 7500000000000"
    pattern="\d{13}"
    maxLength={13}
    required
    title="El código debe contener exactamente 13 dígitos numéricos"
  />
</div>


          <div className="form-group">
            <label>Precio*</label>
            <input type="number" placeholder="Ej. $100.00" required />
          </div>

          <div className="form-group" style={{ flex: '1 1 100%' }}>
            <label>Costo*</label>
            <input type="number" placeholder="Ej. $50.00" required />
          </div>

          <div className="form-button">
          <Link to="/paso3">
          <button type="button" className="btn">Siguiente</button>
          </Link>

          </div>
        </form>
      </div>
    </div>
  );
};

export default DetallesProducto;
