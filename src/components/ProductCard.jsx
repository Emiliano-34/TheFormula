import React from 'react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext.jsx';
import './ProductCard.css';

const ProductCard = ({ product, isDeal = false }) => {
  const { addToCart } = useCart();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  if (!product || typeof product !== 'object') return null;

  const {
    id = 0,
    name = 'Producto sin nombre',
    price = 0,
    originalPrice,
    image = '/placeholder.png',
    rating = 0,
    reviews = 0,
    discountPercent = null
  } = product;

  const handleAddToCart = () => {
    const cartProduct = { id, name, price, image };
    addToCart(cartProduct);
  };

  const handleToggleFavorite = () => {
    if (isFavorite(id)) {
      removeFromFavorites(id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <div className="product-card">
      {isDeal && discountPercent !== null && (
        <div className="discount-badge">-{discountPercent}%</div>
      )}

      <button className="favorite-icon" onClick={handleToggleFavorite}>
        {isFavorite(id) ? '❤️' : '🤍'}
      </button>

      <div className="product-image-container">
        <img
          src={image.startsWith('data:') ? image : image}
          alt={name}
          className="product-image"
        />
      </div>

      <div className="product-info">
        <h3 className="product-title">{name}</h3>
        <div className="price-container">
          <span className="current-price">${Number(price).toFixed(2)}</span>
          {originalPrice && (
            <span className="original-price">${Number(originalPrice).toFixed(2)}</span>
          )}
        </div>
        <div className="rating">
          {'★'.repeat(Math.round(rating))} {reviews ? `(${reviews})` : ''}
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Añadir al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
