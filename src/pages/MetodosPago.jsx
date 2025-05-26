import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/authContext';
import SidebarCuenta from '../components/SidebarCuenta';
import './Perfil.css'; // reutilizamos estilos del perfil para mantener consistencia

const MetodosPago = () => {
  const { user } = useAuth();
  const [tarjeta, setTarjeta] = useState({
    titular: '',
    numero: '',
    vencimiento: '',
    cvv: ''
  });

  useEffect(() => {
    const fetchTarjeta = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/users/${user.id}/pago`);
        const data = await res.json();
        if (data.success && data.metodo) {
          setTarjeta(data.metodo);
        }
      } catch (error) {
        console.error('Error al obtener el método de pago:', error);
      }
    };

    if (user?.id) fetchTarjeta();
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTarjeta(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:3001/api/users/${user.id}/pago`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tarjeta)
      });
      alert('Método de pago actualizado correctamente');
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
            <input name="titular" placeholder="Nombre del titular" value={tarjeta.titular} onChange={handleChange} required />
            <input name="numero" placeholder="Número de tarjeta" maxLength={16} value={tarjeta.numero} onChange={handleChange} required />
            <input name="vencimiento" placeholder="MM/AA" value={tarjeta.vencimiento} onChange={handleChange} required />
            <input name="cvv" placeholder="CVV" maxLength={4} value={tarjeta.cvv} onChange={handleChange} required />
            <button type="submit">Guardar método de pago</button>
          </form>
        </main>
      </div>
    </>
  );
};

export default MetodosPago;
