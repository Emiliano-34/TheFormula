import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import SidebarCuenta from '../components/SidebarCuenta';
import './Perfil.css';

const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const res = await fetch('http://localhost:3001/api/pedidos');
        const data = await res.json();
        if (data.success) {
          setPedidos(data.pedidos);
        }
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
      }
    }
    fetchPedidos();
  }, []);

  return (
    <>
      <Header />
      <div className="perfil-container">
        <SidebarCuenta />
        <main className="perfil-content">
          <h2>Historial de pedidos</h2>
          {pedidos.length === 0 ? (
            <p>No hay pedidos realizados todavía.</p>
          ) : (
            pedidos.map(pedido => (
              <div key={pedido.id} className="pedido-item">
                <p><strong>ID pedido:</strong> {pedido.id}</p>
                <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleDateString()}</p>
                <p><strong>ID Dirección:</strong> {pedido.direccionId}</p>
                <p><strong>Estado:</strong> {pedido.estado}</p>
                <p><strong>Total:</strong> ${Number(pedido.total || 0).toFixed(2)}</p>

              </div>
            ))
          )}
        </main>
      </div>
    </>
  );
};

export default HistorialPedidos;
