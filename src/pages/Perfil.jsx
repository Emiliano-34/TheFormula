import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/authContext';
import SidebarCuenta from '../components/SidebarCuenta';
import API_URL from '../apiConfig'; // <-- IMPORTANTE: Usando la URL centralizada
import './Perfil.css';

const Perfil = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    nuevaContrasena: '',
    confirmarContrasena: '' // Corregido el nombre para consistencia
  });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) {
        setCargando(false);
        return;
      }
      try {
        // CORRECCIÓN: Apuntando a la URL de producción
        const res = await fetch(`${API_URL}/api/users/${user.id}`);
        const data = await res.json();

        if (data.success && data.user) {
          setFormData(prev => ({
            ...prev,
            nombre: data.user.nombre || '',
            apellido: data.user.apellido || '',
            telefono: data.user.telefono || '',
          }));
        } else {
            throw new Error(data.error || 'No se pudieron cargar los datos del perfil.');
        }
      } catch (err) {
        console.error('❌ Error al cargar datos del usuario:', err);
        setMensaje({ texto: err.message, tipo: 'error' });
      } finally {
        setCargando(false);
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
    setMensaje({ texto: '', tipo: '' });

    if (formData.nuevaContrasena && formData.nuevaContrasena !== formData.confirmarContrasena) {
      setMensaje({ texto: 'Las nuevas contraseñas no coinciden', tipo: 'error' });
      return;
    }

    if (!user?.id) return;

    try {
        // CORRECCIÓN: Apuntando a la URL de producción
        const res = await fetch(`${API_URL}/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: formData.nombre,
            apellido: formData.apellido,
            telefono: formData.telefono,
            nuevaContrasena: formData.nuevaContrasena || undefined // No enviar si está vacío
          })
        });

        const data = await res.json();
        if (data.success) {
          setMensaje({ texto: 'Perfil actualizado correctamente', tipo: 'exito' });
          setFormData(prev => ({ ...prev, nuevaContrasena: '', confirmarContrasena: '' }));
        } else {
          throw new Error(data.error || 'Error al guardar cambios');
        }
    } catch(err) {
        setMensaje({ texto: err.message, tipo: 'error' });
    }
  };

  return (
    <>
      <Header />
      <div className="layout-cuenta">
        <SidebarCuenta active="perfil" />
        <main className="contenido-cuenta">
          <h2>Mi Perfil</h2>
          <p>Edita tu información personal y de contacto.</p>
          
          {mensaje.texto && (
              <div className={`mensaje ${mensaje.tipo}`}>
                  {mensaje.texto}
              </div>
          )}

          {cargando ? <p>Cargando perfil...</p> : (
            <form className="form-perfil" onSubmit={handleSubmit}>
                <div className="form-fila">
                    <div className="form-grupo">
                        <label htmlFor="nombre">Nombre</label>
                        <input id="nombre" type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className="form-grupo">
                        <label htmlFor="apellido">Apellido</label>
                        <input id="apellido" type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-grupo">
                    <label htmlFor="telefono">Teléfono</label>
                    <input id="telefono" type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required maxLength={10} />
                </div>

                <h4>Cambiar contraseña (opcional)</h4>
                <div className="form-grupo">
                    <label htmlFor="nuevaContrasena">Nueva contraseña</label>
                    <input id="nuevaContrasena" type="password" name="nuevaContrasena" value={formData.nuevaContrasena} onChange={handleChange} placeholder="Deja en blanco para no cambiar" />
                </div>
                <div className="form-grupo">
                    <label htmlFor="confirmarContrasena">Confirmar nueva contraseña</label>
                    <input id="confirmarContrasena" type="password" name="confirmarContrasena" value={formData.confirmarContrasena} onChange={handleChange} />
                </div>

                <button type="submit" className="btn-guardar">Guardar Cambios</button>
              </form>
          )}
        </main>
      </div>
    </>
  );
};

export default Perfil;
