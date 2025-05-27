import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/authContext';
import SidebarCuenta from '../components/SidebarCuenta';
import './Perfil.css';

const MetodosPago = () => {
  const { user } = useAuth();

  const [metodos, setMetodos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [formulario, setFormulario] = useState({
    titular: '',
    numero: '',
    vencimiento: '',
    tipoId: ''
  });

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = String(date.getFullYear()).slice(-2);
    return `${mes}/${anio}`;
  };

  const fetchMetodos = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/users/${user.id}/pago`);
      const data = await res.json();
      if (data.success && Array.isArray(data.metodos)) {
        setMetodos(data.metodos);
      }
    } catch (err) {
      console.error('Error al obtener métodos:', err);
    }
  };

  const fetchTipos = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/tipos-pago');
      const data = await res.json();
      if (data.success) setTipos(data.tipos);
    } catch (err) {
      console.error('Error al obtener tipos:', err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchTipos();
      fetchMetodos();
    }
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:3001/api/users/${user.id}/pago`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulario)
      });

      await fetchMetodos();
      setFormulario({ titular: '', numero: '', vencimiento: '', tipoId: '' });
      setMostrarFormulario(false);
      setEditandoId(null);
    } catch (err) {
      console.error('Error al guardar método de pago:', err);
    }
  };

  const handleEditar = (metodo) => {
    const tipo = tipos.find(t => t.nombre === metodo.tipo);
    setFormulario({
      titular: metodo.titular,
      numero: '',
      vencimiento: formatearFecha(metodo.vencimiento),
      tipoId: tipo?.id_tipo || ''
    });
    setEditandoId(metodo.id_metodo);
    setMostrarFormulario(true);
  };

  const handleEliminar = async (idMetodo) => {
    if (!window.confirm('¿Estás seguro de eliminar este método de pago?')) return;

    try {
      await fetch(`http://localhost:3001/api/users/${user.id}/pago/${idMetodo}`, {
  method: 'DELETE'
});

      await fetchMetodos();
    } catch (err) {
      console.error('Error al eliminar método:', err);
    }
  };

  const mostrarUltimos4 = (numeroEnmascarado) => {
    const ultimos4 = numeroEnmascarado?.slice(-4) || '';
    return `**** **** **** ${ultimos4}`;
  };

  return (
    <>
      <Header />
      <div className="perfil-container">
        <SidebarCuenta active="pago" />
        <main className="perfil-content">
          <h2>Métodos de Pago</h2>
          <button onClick={() => {
            setFormulario({ titular: '', numero: '', vencimiento: '', tipoId: '' });
            setMostrarFormulario(true);
            setEditandoId(null);
          }}>
            Agregar método de pago
          </button>

          <div className="grid-metodos">
            {metodos.map((metodo) => (
              <div key={metodo.id_metodo} className="metodo-card">
                <p><strong>Titular:</strong> {metodo.titular}</p>
                <p><strong>Vencimiento:</strong> {formatearFecha(metodo.vencimiento)}</p>
                <p><strong>Número:</strong> {mostrarUltimos4(metodo.numero_enmascarado)}</p>
                <p><strong>Tipo:</strong> {metodo.tipo}</p>
                <button onClick={() => handleEditar(metodo)}>Editar método de pago</button>
                <button onClick={() => handleEliminar(metodo.id_metodo)} style={{ marginLeft: '0.5rem', backgroundColor: '#c0392b', color: 'white' }}>
                  Eliminar
                </button>

                {editandoId === metodo.id_metodo && mostrarFormulario && (
                  <form onSubmit={handleSubmit} className="perfil-form" style={{ marginTop: '1rem' }}>
                    <input name="titular" placeholder="Titular" value={formulario.titular} onChange={handleChange} required />
                    <input name="numero" placeholder="Número de tarjeta" maxLength={16} value={formulario.numero} onChange={handleChange} required />
                    <input name="vencimiento" placeholder="MM/AA" value={formulario.vencimiento} onChange={handleChange} required />
                    <select name="tipoId" value={formulario.tipoId} onChange={handleChange} required>
                      <option value="">Selecciona tipo</option>
                      {tipos.map((tipo) => (
                        <option key={tipo.id_tipo} value={tipo.id_tipo}>{tipo.nombre}</option>
                      ))}
                    </select>
                    <button type="submit">Guardar</button>
                  </form>
                )}
              </div>
            ))}
          </div>

          {mostrarFormulario && editandoId === null && (
            <form onSubmit={handleSubmit} className="perfil-form" style={{ marginTop: '2rem' }}>
              <h3>Nuevo método de pago</h3>
              <input name="titular" placeholder="Titular" value={formulario.titular} onChange={handleChange} required />
              <input name="numero" placeholder="Número de tarjeta" maxLength={16} value={formulario.numero} onChange={handleChange} required />
              <input name="vencimiento" placeholder="MM/AA" value={formulario.vencimiento} onChange={handleChange} required />
              <select name="tipoId" value={formulario.tipoId} onChange={handleChange} required>
                <option value="">Selecciona tipo</option>
                {tipos.map((tipo) => (
                  <option key={tipo.id_tipo} value={tipo.id_tipo}>{tipo.nombre}</option>
                ))}
              </select>
              <button type="submit">Guardar método de pago</button>
            </form>
          )}
        </main>
      </div>
    </>
  );
};

export default MetodosPago;
