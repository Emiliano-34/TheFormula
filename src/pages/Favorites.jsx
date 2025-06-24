import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import './Favorites.css';

const Favorites = () => {
  const { favorites } = useFavorites();

  return (
    <>
      <Header />
      <div className="favorites-page">
        <div className="container">
          <h2 className="favorites-title">Tus productos favoritos</h2>

          {favorites.length === 0 ? (
            <p className="no-favorites">No has agregado productos a favoritos aún.</p>
          ) : (
            <div className="products-grid">
              {favorites.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Favorites;
