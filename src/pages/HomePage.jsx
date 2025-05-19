import React, { useEffect, useState } from 'react';
import TopBanner from '../components/TopBanner';
import Header from '../components/Header';
import PromoBanner from '../components/PromoBanner';
import ProductCard from '../components/ProductCard';
import CategoryList from '../components/CategoryList';
import './HomePage.css';

const API_URL = import.meta.env.VITE_API_URL;

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [flashDeals, setFlashDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, dealsRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/products/featured`),
          fetch(`${API_URL}/products/flash-deals`),
          fetch(`${API_URL}/products/categories`)
        ]);

        if (!featuredRes.ok) throw new Error('Error en productos destacados');
        if (!dealsRes.ok) throw new Error('Error en ofertas');
        if (!categoriesRes.ok) throw new Error('Error en categorías');

        const featuredData = await featuredRes.json();
        const dealsData = await dealsRes.json();
        const categoriesData = await categoriesRes.json();

        if (featuredData?.success && Array.isArray(featuredData.products)) {
          setFeaturedProducts(featuredData.products);
        }

        if (dealsData?.success && Array.isArray(dealsData.products)) {
          setFlashDeals(dealsData.products);
        }

        if (categoriesData?.success && Array.isArray(categoriesData.categories)) {
          setCategories(categoriesData.categories);
        }
      } catch (err) {
        console.error('Error al cargar:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const diff = endOfDay - now;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (error) return <div className="error-message">Error: {error}</div>;
  if (loading) return <div className="loading-message">Cargando...</div>;

  return (
    <div className="home-page">
      <TopBanner 
        text="Regístrate y obtén 20% de descuento en tu primera compra"
        buttonText="Comprar Ahora"
      />
      <Header />
      <PromoBanner text="25% OFF EN PRODUCTOS MARCA MUTANT - Hoy" />

      <section className="flash-deals">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Ofertas fugaces</h2>
            <div className="countdown-timer">
              {['days', 'hours', 'minutes', 'seconds'].map((unit, i) => (
                <React.Fragment key={unit}>
                  <div className="time-block">
                    <span className="time-value">{timeLeft[unit]}</span>
                    <span className="time-label">{unit.charAt(0).toUpperCase() + unit.slice(1)}</span>
                  </div>
                  {i < 3 && <span className="time-separator">:</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="products-grid">
            {flashDeals.map(product => (
              <ProductCard key={product.id} product={product} isDeal={true} />
            ))}
          </div>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Productos Destacados</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <button className="view-all-btn">Ver Todos Los Productos</button>
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
