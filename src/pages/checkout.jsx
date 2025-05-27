import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/authContext';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    alert('✅ Pedido realizado con éxito');
    clearCart();
    navigate('/');
  };

  const handleAddPaymentMethod = () => {
    navigate('/metodos-pago');
  };

  return (
    <div className="checkout-page">
      <h2 className="checkout-title">Detalles de compra</h2>
      <div className="checkout-grid">
        <div className="left-column">
          <div className="checkout-list">
            {cartItems.map((item) => (
              <div key={item.id} className="checkout-item">
                <div className="item-info">
                  <img
                    src={item.image.startsWith('data:image') ? item.image : `data:image/jpeg;base64,${item.image}`}
                    alt={item.name}
                  />
                  <div>
                    <h4>{item.name}</h4>
                    <p>Cantidad: {item.quantity}</p>
                  </div>
                </div>
                <p className="item-total">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="summary-box">
            <p>Subtotal: ${cartTotal.toFixed(2)}</p>
            <p>Envío: Gratis</p>
            <p className="total">Total: ${cartTotal.toFixed(2)}</p>
          </div>

          <div className="delivery-box">
            <p>
              <strong>Entregamos tu paquete el dia </strong><br />
              en <br />

            </p>
          </div>

          <button className="buy-again-btn" onClick={handlePlaceOrder}>
            Finalizar compra
          </button>
        </div>

        <div className="right-column">
          <div className="payment-details">
            <h4>Detalles del pago</h4>
            <p className="no-payment">No has seleccionado un método de pago.</p>
            <button className="select-method-btn" onClick={handleAddPaymentMethod}>
              Agregar método de pago
            </button>
          </div>

          <div className="help-box">
            <h4>Ayuda con la compra</h4>
            <button className="help-btn">Opinar sobre el producto</button>
            <button className="help-btn">Tengo un problema con mi compra</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;