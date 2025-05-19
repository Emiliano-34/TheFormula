import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AgregarProducto.css';

function AgregarProducto() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/detalles');
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
        <div className="step">04</div>
        <div className="line"></div>
        <div className="step">05</div>
      </div>

      <form onSubmit={handleSubmit}>
        <label>Nombre del producto*</label>
        <input type="text" placeholder="Ingrese el nombre del producto" required />

        <p>Tipo de producto*</p>
        <label>
          <input type="radio" name="tipo" required /> Producto con inventario
        </label>
        <small>Objetos físicos cuya cantidad debe ser controlada en inventario.</small>

        <label>
          <input type="radio" name="tipo" /> Producto sin inventario
        </label>
        <small>Producto físico que no se gestiona mediante control de inventario; su cantidad no se rastrea.</small>

        <label>
          <input type="radio" name="tipo" /> Producto serializado
        </label>
        <small>Producto físico que no se gestiona mediante control de inventario; su cantidad no se rastrea.</small>

        <button className="btn" type="submit">Siguiente</button>
      </form>
    </div>
  );
}

export default AgregarProducto;
