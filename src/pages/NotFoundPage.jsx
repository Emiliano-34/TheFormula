import React from 'react';
import './NotFoundPage.css';
import TopBanner from '../components/TopBanner';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (  
    <div className="notfound-wrapper">
      {/* Barra superior */}
      <TopBanner 
        text="Regístrate y obtén 20% de descuento en tu primera compra"
        buttonText="Comprar Ahora"
      />
      <Header />

      {/* Contenido del error */}
      <main className="notfound-container">
        <h1 className="notfound-title">404 Not Found</h1>
        <p className="notfound-message">
          Visitaste una página no encontrada. Regresa a la página de inicio
        </p>
        <button className="notfound-button" onClick={() => navigate('/')}>
          Volver al Inicio
        </button>
      </main>
    </div>
  );
};

export default NotFoundPage;
