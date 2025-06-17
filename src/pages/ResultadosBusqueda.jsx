import React from 'react';
import { useLocation } from 'react-router-dom';

const ResultadosBusqueda = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Resultados de búsqueda</h1>
      <p>Mostrando resultados para: <strong>{query}</strong></p>
      {/* Aquí puedes mapear los resultados reales */}
    </div>
  );
};

export default ResultadosBusqueda;
