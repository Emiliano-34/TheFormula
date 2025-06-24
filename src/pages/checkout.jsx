import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/authContext';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (!user?.id) {
      alert('Debes iniciar sesión para realizar la compra');
      return;
    }
    if (!cartItems.length) {
      alert('El carrito está vacío');
      return;
    }

    // Usar un ID fijo o luego el real
    const direccionId = 1;

const pedido = {
  userId: user.id,
  direccionId,
  productos: cartItems.map(item => ({
    id: item.id,
    quantity: item.quantity,
  })),
  total: cartTotal,
};

console.log('Pedido que se enviará:', pedido);




    try {
const res = await fetch('http://localhost:3001/api/pedidos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(pedido),
});


      const data = await res.json();

      if (data.success) {
        alert('✅ Pedido realizado con éxito');
        clearCart();
        navigate('/historial-pedidos');
      } else {
        alert('❌ Error al guardar el pedido: ' + (data.error || 'Desconocido'));
      }
    } catch (error) {
      console.error('Error al realizar pedido:', error);
      alert('❌ Error de conexión');
    }
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
            <p><strong>Entregamos tu paquete el día</strong><br />en tu dirección registrada.</p>
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
