import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/authContext';
import SidebarCuenta from '../components/SidebarCuenta';
import './Perfil.css'; // usa los estilos del perfil para mantener la coherencia visual

const DireccionEnvio = () => {
  const { user } = useAuth();
  const [direccion, setDireccion] = useState({
    calle: '',
    numero: '',
    ciudad: '',
    estado: '',
    codigoPostal: ''
  });

  useEffect(() => {
    const fetchDireccion = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/users/${user.id}/direccion`);
        const data = await res.json();
        if (data.success && data.direccion) {
          setDireccion(data.direccion);
        }
      } catch (error) {
        console.error('Error al obtener dirección:', error);
      }
    };

    if (user?.id) fetchDireccion();
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDireccion(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:3001/api/users/${user.id}/direccion`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(direccion)
      });
      alert('Dirección guardada correctamente');
    } catch (error) {
      alert('Error al guardar la dirección');
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="perfil-container">
        <SidebarCuenta active="direccion" />
        <main className="perfil-content">
          <h2>Dirección de envío</h2>
          <form className="perfil-form" onSubmit={handleSubmit}>
            <input name="calle" placeholder="Calle" value={direccion.calle} onChange={handleChange} required />
            <input name="numero" placeholder="Número" value={direccion.numero} onChange={handleChange} required />
            <input name="ciudad" placeholder="Ciudad" value={direccion.ciudad} onChange={handleChange} required />
            <input name="estado" placeholder="Estado" value={direccion.estado} onChange={handleChange} required />
            <input name="codigoPostal" placeholder="Código Postal" value={direccion.codigoPostal} onChange={handleChange} required />
            <button type="submit">Guardar dirección</button>
          </form>
        </main>
      </div>
    </>
  );
};

export default DireccionEnvio;
