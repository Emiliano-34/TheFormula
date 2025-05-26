import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/authContext';
import SidebarCuenta from '../components/SidebarCuenta';
import './Perfil.css';

// Lista de estados con su ID (puedes ajustar los IDs según tu tabla ESTADOS)
const estados = [
  { id: 1, nombre: 'Aguascalientes' },
  { id: 2, nombre: 'Baja California' },
  { id: 3, nombre: 'Baja California Sur' },
  { id: 4, nombre: 'Campeche' },
  { id: 5, nombre: 'Chiapas' },
  { id: 6, nombre: 'Chihuahua' },
  { id: 7, nombre: 'Ciudad de México' },
  { id: 8, nombre: 'Coahuila' },
  { id: 9, nombre: 'Colima' },
  { id: 10, nombre: 'Durango' },
  { id: 11, nombre: 'Estado de México' },
  { id: 12, nombre: 'Guanajuato' },
  { id: 13, nombre: 'Guerrero' },
  { id: 14, nombre: 'Hidalgo' },
  { id: 15, nombre: 'Jalisco' },
  { id: 16, nombre: 'Michoacán' },
  { id: 17, nombre: 'Morelos' },
  { id: 18, nombre: 'Nayarit' },
  { id: 19, nombre: 'Nuevo León' },
  { id: 20, nombre: 'Oaxaca' },
  { id: 21, nombre: 'Puebla' },
  { id: 22, nombre: 'Querétaro' },
  { id: 23, nombre: 'Quintana Roo' },
  { id: 24, nombre: 'San Luis Potosí' },
  { id: 25, nombre: 'Sinaloa' },
  { id: 26, nombre: 'Sonora' },
  { id: 27, nombre: 'Tabasco' },
  { id: 28, nombre: 'Tamaulipas' },
  { id: 29, nombre: 'Tlaxcala' },
  { id: 30, nombre: 'Veracruz' },
  { id: 31, nombre: 'Yucatán' },
  { id: 32, nombre: 'Zacatecas' }
];

const DireccionEnvio = () => {
  const { user } = useAuth();
  const [direccion, setDireccion] = useState({
    calle: '',
    numero: '',
    ciudad: '',
    estado: '', // ID del estado
    codigoPostal: ''
  });

  useEffect(() => {
    const fetchDireccion = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/users/${user.id}/direccion`);
        const data = await res.json();
        if (data.success && data.direccion) {
          setDireccion({
            calle: data.direccion.calle || '',
            numero: data.direccion.numero || '',
            ciudad: data.direccion.ciudad || '',
            estado: data.direccion.estado?.toString() || '',
            codigoPostal: data.direccion.codigoPostal || ''
          });
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
      const res = await fetch(`http://localhost:3001/api/users/${user.id}/direccion`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(direccion)
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message || 'Dirección guardada correctamente');
      } else {
        alert('Error al guardar la dirección');
      }
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
            <input name="numero" placeholder="Número exterior" value={direccion.numero} onChange={handleChange} required />
            <input name="ciudad" placeholder="Municipio / Ciudad" value={direccion.ciudad} onChange={handleChange} required />
            <select name="estado" value={direccion.estado} onChange={handleChange} required>
              <option value="">Selecciona un estado</option>
              {estados.map(e => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>
            <input name="codigoPostal" placeholder="Código Postal" value={direccion.codigoPostal} onChange={handleChange} required />
            <button type="submit">Guardar dirección</button>
          </form>
        </main>
      </div>
    </>
  );
};

export default DireccionEnvio;
