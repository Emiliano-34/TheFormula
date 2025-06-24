// src/components/Toast.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import './Toast.css';

const Toast = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) {
    return null;
  }

  return (
    <div className="toast-container">
      <div className="toast-message">{toastMessage}</div>
    </div>
  );
};

export default Toast;