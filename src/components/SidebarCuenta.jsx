// src/components/SidebarCuenta.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const SidebarCuenta = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="perfil-sidebar">
      <h3>Gestión de cuenta</h3>
      <ul>
        <li className={isActive('/perfil') ? 'activo' : ''} onClick={() => navigate('/perfil')}>Mi perfil</li>
        <li className={isActive('/direccion-envio') ? 'activo' : ''} onClick={() => navigate('/direccion-envio')}>Dirección de envío</li>
        <li className={isActive('/metodos-pago') ? 'activo' : ''} onClick={() => navigate('/metodos-pago')}>Métodos de pago</li>
        <li onClick={logout}>Cerrar sesión</li>
      </ul>
    </aside>
  );
};

export default SidebarCuenta;
