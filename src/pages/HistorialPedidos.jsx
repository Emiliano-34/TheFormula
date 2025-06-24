import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext.jsx';
import Header from '../components/Header';
import SidebarCuenta from '../components/SidebarCuenta';
import API_URL from '../apiConfig'; // <-- IMPORTANTE: Usando la URL centralizada
import './HistorialPedidos.css'; // Usaremos su propio CSS

const HistorialPedidos = () => {
    const { user } = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPedidos = async () => {
            if (!user?.id) return;
            setLoading(true);
            setError(null);
            
            try {
                // CORRECCIÓN: Apuntando a la URL de producción y al endpoint correcto por usuario
                const res = await fetch(`${API_URL}/api/pedidos/usuario/${user.id}`);
                const data = await res.json();
                
                if (data.success) {
                    setPedidos(data.pedidos || []);
                } else {
                    throw new Error(data.error || 'No se pudieron cargar los pedidos.');
                }
            } catch (error) {
                console.error('Error al cargar pedidos:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPedidos();
    }, [user?.id]);

    return (
        <>
            <Header />
            <div className="layout-cuenta">
                <SidebarCuenta active="historial" />
                <main className="contenido-cuenta">
                    <h2>Mi Historial de Pedidos</h2>
                    <p>Aquí puedes ver todos los pedidos que has realizado en la tienda.</p>
                    
                    {loading && <p>Cargando historial...</p>}
                    {error && <div className="mensaje error">{error}</div>}
                    
                    {!loading && !error && (
                        <div className="pedidos-lista">
                            {pedidos.length === 0 ? (
                                <p>No has realizado ningún pedido todavía.</p>
                            ) : (
                                pedidos.map(pedido => (
                                    <div key={pedido.ID_PEDIDO} className="pedido-card">
                                        <div className="pedido-header">
                                            <div>
                                                <span className="pedido-label">PEDIDO REALIZADO</span>
                                                <span>{new Date(pedido.FECHA_PEDIDO).toLocaleDateString()}</span>
                                            </div>
                                            <div>
                                                <span className="pedido-label">TOTAL</span>
                                                <span>${Number(pedido.TOTAL || 0).toFixed(2)}</span>
                                            </div>
                                            <div>
                                                <span className="pedido-label">PEDIDO N.º</span>
                                                <span>{pedido.ID_PEDIDO}</span>
                                            </div>
                                        </div>
                                        <div className="pedido-body">
                                            <h4 className={`pedido-estado estado-${(pedido.ESTADO || '').toLowerCase()}`}>
                                                {pedido.ESTADO}
                                            </h4>
                                            {/* Aquí podrías mapear y mostrar los productos del pedido si la API los devuelve */}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default HistorialPedidos;
