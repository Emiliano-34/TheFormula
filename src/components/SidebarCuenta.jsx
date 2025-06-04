import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const SidebarCuenta = () => {
  const { logout } = useAuth();

  return (
    <aside className="perfil-sidebar">
      <h3>Gestión de cuenta</h3>
      <ul>
        <li>
          <NavLink to="/perfil" className={({ isActive }) => isActive ? 'activo' : ''}>Mi perfil</NavLink>
        </li>
        <li>
          <NavLink to="/direccion-envio" className={({ isActive }) => isActive ? 'activo' : ''}>Dirección de envío</NavLink>
        </li>
        <li>
          <NavLink to="/metodos-pago" className={({ isActive }) => isActive ? 'activo' : ''}>Métodos de pago</NavLink>
        </li>
        <li>
          <NavLink to="/historial-pedidos" className={({ isActive }) => isActive ? 'activo' : ''}>Historial de pedidos</NavLink>
        </li>
        <li onClick={logout}>Cerrar sesión</li>
      </ul>
    </aside>
  );
};

export default SidebarCuenta;
