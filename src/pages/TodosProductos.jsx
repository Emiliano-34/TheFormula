// src/pages/TodosProductos.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './TodosProductos.css';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';

const useQuery = () => new URLSearchParams(useLocation().search);

const TodosProductos = () => {
  const query = useQuery();
  const location = useLocation();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(false);

  const cargarProductos = () => {
    setLoading(true);
    fetch('http://localhost:3001/api/products/all')
      .then(res => res.json())
      .then(data => {
        setProductos(data.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar productos:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    cargarProductos();

    fetch('http://localhost:3001/api/products/categories')
      .then(res => res.json())
      .then(data => setCategorias(data.categories || []))
      .catch(err => console.error('Error al cargar categorías:', err));
  }, []);

  useEffect(() => {
    const categoriaId = query.get('categoria');
    if (categoriaId) {
      setFiltro(categoriaId);
    }
  }, [location.search]);

  const productosFiltrados = filtro
    ? productos.filter(p => p.categoriaId === parseInt(filtro))
    : productos;

  return (
    <>
      <Header />
      <div className="productos-container">
        <h2>Todos los productos</h2>

        {loading && <p>Cargando productos...</p>}

        <div className="filtros">
          <label>Filtrar por categoría:</label>
          <select value={filtro} onChange={e => setFiltro(e.target.value)}>
            <option value="">Todas</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="grid-productos">
          {productosFiltrados.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </>
  );
};

export default TodosProductos;