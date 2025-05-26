import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/authContext';
import './Perfil.css';

const Perfil = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    nuevaContrasena: '',
    confirmarPassword: ''
  });

useEffect(() => {
  const fetchUserData = async () => {
    if (!user || !user.id) {
      //console.log('❌ user.id no está definido:', user);
      return;
    }

    try {
      //console.log('✅ Buscando datos del usuario con ID:', user.id);  // ← AQUI
      const res = await fetch(`http://localhost:3001/api/users/${user.id}`);
      const data = await res.json();
      //console.log('📦 Datos del backend:', data); // ← AQUI

      if (data.success && data.user) {
        setFormData(prev => ({
          ...prev,
          nombre: data.user.nombre ?? '',
          apellido: data.user.apellido ?? '',
          telefono: data.user.telefono ?? '',
        }));
      }
    } catch (err) {
      //console.error('❌ Error al cargar datos del usuario:', err);
    }
  };

  fetchUserData();
}, [user]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.nuevaContrasena && formData.nuevaContrasena !== formData.confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const res = await fetch(`http://localhost:3001/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        nuevaContrasena: formData.nuevaContrasena
      })
    });

    const data = await res.json();
    if (data.success) {
      alert('Perfil actualizado correctamente');
    } else {
      alert('Error al guardar cambios');
    }
  };

  return (
    <>
      <Header />
      <div className="perfil-container">
        <aside className="perfil-sidebar">
          <h3>Gestión de cuenta</h3>
          <ul>
            <li className="activo">Mi perfil</li>
            <li onClick={() => navigate('/direccion-envio')}>Dirección de envío</li>
            <li onClick={() => navigate('/metodos-pago')}>Métodos de pago</li>
            <li onClick={logout}>Cerrar sesión</li>
          </ul>
        </aside>

        <main className="perfil-content">
          <h2>Editar perfil</h2>
          <form className="perfil-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              required
              autoComplete="off"
            />
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Apellido"
              required
              autoComplete="off"
            />
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Teléfono"
              required
              maxLength={10}
              autoComplete="off"
            />

            <h4>Cambiar contraseña</h4>
            <input
              type="password"
              name="nuevaContrasena"
              value={formData.nuevaContrasena}
              onChange={handleChange}
              placeholder="Nueva contraseña"
              autoComplete="new-password"
            />
            <input
              type="password"
              name="confirmarPassword"
              value={formData.confirmarPassword}
              onChange={handleChange}
              placeholder="Confirmar nueva contraseña"
              autoComplete="new-password"
            />

            <button type="submit">Guardar cambios</button>
          </form>
        </main>
      </div>
    </>
  );
};

export default Perfil;
