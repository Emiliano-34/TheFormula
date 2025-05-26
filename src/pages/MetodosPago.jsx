import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/authContext';
import SidebarCuenta from '../components/SidebarCuenta';
import './Perfil.css';

const MetodosPago = () => {
  const { user } = useAuth();

  const [tarjeta, setTarjeta] = useState({
    titular: '',
    numero: '',
    vencimiento: '',
    tipoId: ''
  });

  const [tipos, setTipos] = useState([]);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const resTipos = await fetch('http://localhost:3001/api/tipos-pago');
        const dataTipos = await resTipos.json();

        if (dataTipos.success && Array.isArray(dataTipos.tipos)) {
          setTipos(dataTipos.tipos);

          const resMetodo = await fetch(`http://localhost:3001/api/users/${user.id}/pago`);
          const dataMetodo = await resMetodo.json();

          if (dataMetodo.success && dataMetodo.metodo) {
  const tipoEncontrado = dataTipos.tipos.find(t => t.nombre === dataMetodo.metodo.tipo);

  let vencimientoFormateado = '';
  if (dataMetodo.metodo.VENCIMIENTO) {
    const venc = new Date(dataMetodo.metodo.VENCIMIENTO);
    const mes = (venc.getMonth() + 1).toString().padStart(2, '0');
    const anio = venc.getFullYear().toString().slice(-2);
    vencimientoFormateado = `${mes}/${anio}`;
  }

  setTarjeta({
    titular: dataMetodo.metodo.TITULAR || '',
    numero: '', // ocultamos el número real
    vencimiento: vencimientoFormateado,
    tipoId: tipoEncontrado ? tipoEncontrado.id_tipo : ''
  });
}

        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    };

    if (user?.id) {
      fetchDatos();
    }
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTarjeta(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3001/api/users/${user.id}/pago`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tarjeta)
      });

      const data = await res.json();

      if (data.success) {
        alert('Método de pago guardado correctamente');
      } else {
        alert('Error al guardar método de pago');
      }
    } catch (err) {
      console.error('Error al guardar método de pago:', err);
      alert('Error al guardar método de pago');
    }
  };

  return (
    <>
      <Header />
      <div className="perfil-container">
        <SidebarCuenta active="pago" />
        <main className="perfil-content">
          <h2>Métodos de Pago</h2>
          <form className="perfil-form" onSubmit={handleSubmit}>
            <input
              name="titular"
              placeholder="Nombre del titular"
              value={tarjeta.titular || ''}
              onChange={handleChange}
              required
            />
            <input
              name="numero"
              placeholder="Número de tarjeta"
              maxLength={16}
              value={tarjeta.numero || ''}
              onChange={handleChange}
              required
            />
            <input
              name="vencimiento"
              placeholder="MM/AA"
              value={tarjeta.vencimiento || ''}
              onChange={handleChange}
              required
            />
            <select
              name="tipoId"
              value={tarjeta.tipoId || ''}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona tipo</option>
              {tipos.map((tipo) => (
                <option key={tipo.id_tipo} value={tipo.id_tipo}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
            <button type="submit">Guardar método de pago</button>
          </form>
        </main>
      </div>
    </>
  );
};

export default MetodosPago;
