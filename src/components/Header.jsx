import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import busqueda from '../assets/busqueda.png';
import corazon from '../assets/corazon.png';
import carrito from '../assets/carrito.png';
import usuario from '../assets/usuario.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

function Header() {
  const { user, logout } = useAuth();
  const [showPanel, setShowPanel] = useState(false);
  const [query, setQuery] = useState('');
  const panelRef = useRef();
  const navigate = useNavigate();

  const togglePanel = () => setShowPanel(prev => !prev);

  const handleSearch = () => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length > 0) {
      navigate(`/buscar?q=${encodeURIComponent(trimmedQuery)}`);
      setQuery('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate('/')}>THE FORMULA</div>

      <nav>
        <Link to="/">Inicio</Link>
        {!user && (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Regístrate</Link>
          </>
        )}
        {user?.rol === 'admin' && <Link to="/admin">Panel de admin</Link>}
      </nav>

      <div className="icons">
        <div className="search-container">
          <input
            type="text"
            placeholder="¿Qué estás buscando?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="search-btn">
            <img src={busqueda} alt="Buscar" className="search-icon" />
          </button>
        </div>

        <button onClick={() => navigate('/favoritos')}>
          <img src={corazon} alt="Favoritos" />
        </button>

        <button onClick={() => navigate('/cart')}>
          <img src={carrito} alt="Carrito" />
        </button>

        {user && (
          <div className="user-panel-container" ref={panelRef}>
            <button onClick={togglePanel}>
              <img src={usuario} alt="Usuario" />
            </button>

            {showPanel && (
              <div className="user-panel">
                <p>Hola, {user.nombre}</p>
                <p style={{ fontSize: '12px', color: '#888' }}>Rol: {user.rol}</p>
                <button onClick={() => navigate('/perfil')}>Ver perfil</button>

                {user.rol === 'admin' && (
                  <button onClick={() => navigate('/admin')}>Panel de admin</button>
                )}

                <button className="logout-btn" onClick={logout}>Cerrar sesión</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
