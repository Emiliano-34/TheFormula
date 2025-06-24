import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Buscar.css';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';

const API_URL = import.meta.env.VITE_API_URL + "/api";

const useQuery = () => new URLSearchParams(useLocation().search);

const Buscar = () => {
  const query = useQuery().get('q');
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusqueda = async () => {
      try {
        const res = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setProductos(data.products || []);
        }
      } catch (err) {
        console.error('Error al buscar:', err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchBusqueda();
    }
  }, [query]);

  return (
    <>
      <Header />
      <div className="buscar-container">
        <h2>Resultados de búsqueda</h2>
        <p>Mostrando resultados para: <strong>{query}</strong></p>

        {loading ? (
          <p>Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p>No se encontraron productos.</p>
        ) : (
          <div className="productos-grid">
            {productos.map((p, index) => (
              <ProductCard key={`search-${p.id}-${index}`} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Buscar;
