import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/authContext';
import SidebarCuenta from '../components/SidebarCuenta';
import API_URL from '../apiConfig'; // <-- IMPORTANTE: Usando la URL centralizada
import './DireccionEnvio.css'; // Usaremos su propio CSS

const estadosDeMexico = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas',
    'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango',
    'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco',
    'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla',
    'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora',
    'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
];

const DireccionEnvio = () => {
    const { user } = useAuth();
    const [direccion, setDireccion] = useState({
        calle: '',
        numero_exterior: '',
        numero_interior: '',
        colonia: '',
        codigo_postal: '',
        ciudad: '',
        estado: '',
        pais: 'México',
        referencias: ''
    });
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchDireccion = async () => {
            if (!user?.id) {
                setCargando(false);
                return;
            };
            try {
                // CORRECCIÓN: Apuntando a la URL de producción
                const res = await fetch(`${API_URL}/api/users/${user.id}/direccion`);
                const data = await res.json();
                if (data.success && data.direccion) {
                    const dirCompleta = {
                        calle: data.direccion.calle || '',
                        numero_exterior: data.direccion.numero_exterior || '',
                        numero_interior: data.direccion.numero_interior || '',
                        colonia: data.direccion.colonia || '',
                        codigo_postal: data.direccion.codigo_postal || '',
                        ciudad: data.direccion.ciudad || '',
                        estado: data.direccion.estado || '',
                        pais: data.direccion.pais || 'México',
                        referencias: data.direccion.referencias || ''
                    };
                    setDireccion(dirCompleta);
                }
            } catch (error) {
                console.error('Error al obtener dirección:', error);
                setMensaje({ texto: 'No se pudo cargar la dirección guardada.', tipo: 'error' });
            } finally {
                setCargando(false);
            }
        };
        fetchDireccion();
    }, [user?.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDireccion(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ texto: '', tipo: '' });
        if (!user?.id) return;

        try {
            // CORRECCIÓN: Apuntando a la URL de producción
            const res = await fetch(`${API_URL}/api/users/${user.id}/direccion`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(direccion)
            });

            const data = await res.json();
            if (data.success) {
                setMensaje({ texto: data.message || 'Dirección guardada correctamente', tipo: 'exito' });
            } else {
                throw new Error(data.error || 'Error al guardar la dirección');
            }
        } catch (error) {
            setMensaje({ texto: error.message, tipo: 'error' });
            console.error('Error:', error);
        }
    };

    return (
        <>
            <Header />
            <div className="layout-cuenta">
                <SidebarCuenta active="direccion" />
                <main className="contenido-cuenta">
                    <h2>Mi Dirección de Envío</h2>
                    <p>Asegúrate de que tus datos estén correctos para recibir tus pedidos sin problemas.</p>
                    
                    {mensaje.texto && (
                        <div className={`mensaje ${mensaje.tipo}`}>
                            {mensaje.texto}
                        </div>
                    )}

                    {cargando ? <p>Cargando dirección...</p> : (
                        <form className="form-direccion" onSubmit={handleSubmit}>
                            <div className="form-grupo">
                                <label htmlFor="calle">Calle</label>
                                <input id="calle" name="calle" placeholder="Av. Siempre Viva" value={direccion.calle} onChange={handleChange} required />
                            </div>
                            <div className="form-fila">
                                <div className="form-grupo">
                                    <label htmlFor="numero_exterior">Número Exterior</label>
                                    <input id="numero_exterior" name="numero_exterior" placeholder="742" value={direccion.numero_exterior} onChange={handleChange} required />
                                </div>
                                <div className="form-grupo">
                                    <label htmlFor="numero_interior">Número Interior (Opcional)</label>
                                    <input id="numero_interior" name="numero_interior" placeholder="Depto. 3" value={direccion.numero_interior} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-grupo">
                                <label htmlFor="colonia">Colonia</label>
                                <input id="colonia" name="colonia" placeholder="Springfield" value={direccion.colonia} onChange={handleChange} required />
                            </div>
                            <div className="form-fila">
                                <div className="form-grupo">
                                    <label htmlFor="codigo_postal">Código Postal</label>
                                    <input id="codigo_postal" name="codigo_postal" placeholder="12345" value={direccion.codigo_postal} onChange={handleChange} required />
                                </div>
                                <div className="form-grupo">
                                    <label htmlFor="ciudad">Ciudad / Municipio</label>
                                    <input id="ciudad" name="ciudad" placeholder="Cualquier lugar" value={direccion.ciudad} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-grupo">
                                <label htmlFor="estado">Estado</label>
                                <select id="estado" name="estado" value={direccion.estado} onChange={handleChange} required>
                                    <option value="">Selecciona un estado</option>
                                    {estadosDeMexico.map(e => <option key={e} value={e}>{e}</option>)}
                                </select>
                            </div>
                            <div className="form-grupo">
                                <label htmlFor="referencias">Referencias Adicionales</label>
                                <textarea id="referencias" name="referencias" placeholder="Ej: Entre calle A y calle B, casa color verde." value={direccion.referencias} onChange={handleChange}></textarea>
                            </div>
                            <button type="submit" className="btn-guardar">Guardar Dirección</button>
                        </form>
                    )}
                </main>
            </div>
        </>
    );
};

export default DireccionEnvio;