import React, { useState } from 'react';
import './ActualizarInventario.css';

const ActualizarInventario = () => {
  const [codigoBarras, setCodigoBarras] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!codigoBarras.trim() || !cantidad || cantidad <= 0) {
      alert('Por favor, ingresa código de barras y cantidad válidos');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/inventario', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo_barras: codigoBarras, cantidad: parseInt(cantidad, 10) }),
      });

      const data = await res.json();

      if (data.success) {
        alert(`Inventario actualizado correctamente. Nuevas existencias: ${data.nuevasExistencias}`);
        setCodigoBarras('');
        setCantidad('');
      } else {
        alert('Error al actualizar inventario: ' + (data.error || 'Desconocido'));
      }
    } catch (error) {
      console.error('Error al actualizar inventario:', error);
      alert('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="top-info">
        <div className="breadcrumb">Home / <span>Admin</span></div>
        <div className="welcome">¡Bienvenido! <span className="admin-name">Admin</span></div>
      </div>

      <h2 className="titulo-formulario">Actualizar Inventario</h2>

      <div className="form-card centered-card">
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Código de barras del producto*</label>
            <input 
              type="text" 
              placeholder="Ej. 7500000000000" 
              required 
              value={codigoBarras} 
              onChange={(e) => setCodigoBarras(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Cantidad a agregar*</label>
            <input 
              type="number" 
              placeholder="Ej. 10" 
              min="1" 
              required 
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </div>

          <div className="form-button">
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActualizarInventario;
