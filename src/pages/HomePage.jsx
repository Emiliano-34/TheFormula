// src/pages/HomePage.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBanner from '../components/TopBanner';
import Header from '../components/Header';
import PromoBanner from '../components/PromoBanner';
import ProductCard from '../components/ProductCard';
import CategoryList from '../components/CategoryList';
import './HomePage.css';

// --- CORRECCIÓN CLAVE AQUÍ ---
// La variable de entorno ya contiene la URL completa de tu backend
const API_URL = import.meta.env.VITE_API_URL;

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [adminDeals, setAdminDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Si API_URL no está definida, no intentar hacer fetch
        if (!API_URL) {
          throw new Error("La URL de la API no está configurada. Revisa tus variables de entorno.");
        }

        const [featuredRes, ofertasRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/api/products/featured`),
          fetch(`${API_URL}/api/products/ofertas`),
          fetch(`${API_URL}/api/categorias`) // <-- Ruta corregida
        ]);

        if (!featuredRes.ok) throw new Error('Error en productos destacados');
        if (!ofertasRes.ok) throw new Error('Error en ofertas admin');
        if (!categoriesRes.ok) throw new Error('Error en categorías');

        const featuredData = await featuredRes.json();
        const ofertasData = await ofertasRes.json();
        const categoriesData = await categoriesRes.json();

        if (featuredData.success) setFeaturedProducts(featuredData.products);
        if (ofertasData.success) setAdminDeals(ofertasData.products.map(p => ({ ...p, isDeal: true })));
        if (categoriesData.success) setCategories(categoriesData.categories);

      } catch (err) {
        console.error('Error al cargar:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) return <div className="error-message">Error: {error}</div>;
  if (loading) return <div className="loading-message">Cargando...</div>;

  return (
    // ... (El resto del return se mantiene igual)
    <div className="home-page">
      <TopBanner 
        text="Regístrate y obtén 20% de descuento en tu primera compra"
        buttonText="Comprar Ahora"
      />
      <Header />
      <div className="promo-banner">
      <p>25% DE DESCUENTO EN PRODUCTOS MUTANT - Hoy</p>
    </div>

      <section className="admin-deals">
        <div className="container">
          <h2 className="section-title">Ofertas Especiales</h2>
          <div className="products-grid">
            {adminDeals.map((product, index) => (
              <ProductCard key={`admin-<span class="math-inline">\{product\.id\}\-</span>{index}`} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Productos Destacados</h2>
          <div className="products-grid">
            {featuredProducts.map((product, index) => (
              <ProductCard key={`featured-<span class="math-inline">\{product\.id\}\-</span>{index}`} product={product} />
            ))}
          </div>
          <button className="view-all-btn" onClick={() => navigate('/todos-productos')}>
            Ver Todos Los Productos
          </button>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Buscar por categorías</h2>
          {Array.isArray(categories) && categories.length > 0 && (
            <CategoryList categories={categories} />
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;