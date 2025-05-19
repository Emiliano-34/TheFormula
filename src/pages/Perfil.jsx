import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/authContext';
import './Perfil.css';

const Perfil = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    actualPassword: '',
    nuevaPassword: '',
    confirmarPassword: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await fetch(`http://localhost:3001/api/users/${user.id}`);
      const data = await res.json();
      setFormData(prev => ({
        ...prev,
        nombre: data.NOMBRE,
        apellido: data.APELLIDO,
        telefono: data.TELEFONO
      }));
    };
    fetchUserData();
  }, [user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.nuevaPassword !== formData.confirmarPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    await fetch(`http://localhost:3001/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono
      })
    });

    alert('Cambios guardados');
  };

  return (
    <>
      <Header />
      <div className="perfil-container">
        <aside className="perfil-sidebar">
          <h3>Gestionar Cuenta</h3>
          <ul>
            <li className="activo">Mi perfil</li>
            <li>Dirección de envío</li>
            <li>Métodos de pago</li>
            <li onClick={logout}>Cerrar sesión</li>
          </ul>
        </aside>

        <main className="perfil-content">
          <div className="perfil-header">
            <h2>Editar tu perfil</h2>
            <div className="perfil-user">
              Bienvenido! <span className="nombre-usuario">{user?.nombre} {user?.apellido}</span><br />
              <button className="cerrar-sesion" onClick={logout}>Cerrar sesión</button>
            </div>
          </div>

          <form className="perfil-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} />
              <input name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} />
            </div>

            <div className="form-row">
              <input name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />
            </div>

            <h4>Cambiar contraseña</h4>
            <div className="form-row">
              <input type="password" name="actualPassword" placeholder="Contraseña actual" onChange={handleChange} />
              <input type="password" name="nuevaPassword" placeholder="Nueva contraseña" onChange={handleChange} />
              <input type="password" name="confirmarPassword" placeholder="Confirmar nueva contraseña" onChange={handleChange} />
            </div>

            <div className="form-actions">
              <button type="button" className="cancelar-btn">Cancelar</button>
              <button type="submit" className="guardar-btn">Guardar cambios</button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
};

export default Perfil;
