import React from 'react';
import Header from '../components/Header';
import SidebarCuenta from '../components/SidebarCuenta';
import './Perfil.css'; // Puedes usar el mismo CSS del perfil para estilos

const HistorialPedidos = () => {
  return (
    <>
      <Header />
      <div className="perfil-container">
        <SidebarCuenta />
        <main className="perfil-content">
          <h2>Historial de pedidos</h2>
          {/* Aquí irá la lista de pedidos cuando la implementes */}
          <p>Aquí se mostrarán los pedidos realizados.</p>
        </main>
      </div>
    </>
  );
};

export default HistorialPedidos;
