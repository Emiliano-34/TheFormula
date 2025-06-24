import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/authContext';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (e, id) => {
    const quantity = parseInt(e.target.value);
    if (quantity >= 1) {
      updateQuantity(id, quantity);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/iniciar-sesion', { state: { from: '/carrito' } });
      return;
    }
    // Proceed to checkout logic here
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Tu carrito está vacío</h2>
        <Link to="/" className="continue-shopping-btn">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      {!user && (
        <div className="guest-notice">
          <p>Estás comprando como invitado</p>
          <Link to="/registro">Regístrate para guardar tu carrito</Link>
        </div>
      )}

      <h2 className="cart-title">Carrito</h2>
      
      <div className="cart-header">
        <span>Producto</span>
        <span>Precio</span>
        <span>Cantidad</span>
        <span>Subtotal</span>
      </div>

      {cartItems.map(item => (
        <div key={item.id} className="cart-item">
          <div className="product-info">
            <img 
              src={item.image.startsWith('data:image') ? item.image : `data:image/jpeg;base64,${item.image}`} 
              alt={item.name} 
              className="product-image"
            />
            <div>
              <h3>{item.name}</h3>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="remove-btn"
              >
                Eliminar
              </button>
            </div>
          </div>
          <span>${item.price.toFixed(2)}</span>
          <select
            value={item.quantity}
            onChange={(e) => handleQuantityChange(e, item.id)}
            className="quantity-select"
          >
            {[...Array(10).keys()].map(n => (
              <option key={n + 1} value={n + 1}>{n + 1}</option>
            ))}
          </select>
          <span>${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}

      <div className="cart-actions">
        <Link to="/" className="continue-shopping-btn">
          Seguir comprando
        </Link>
        <button onClick={clearCart} className="clear-cart-btn">
          Vaciar carrito
        </button>
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <h3>Resumen de compra</h3>
          <p>Subtotal: ${cartTotal.toFixed(2)}</p>
          <p>Envío: Gratis</p>
          <p className="total">Total: ${cartTotal.toFixed(2)}</p>
          <button 
            onClick={handleCheckout}
            className="checkout-btn"
          >
            {user ? 'Continuar con la compra' : 'Iniciar sesión para comprar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;