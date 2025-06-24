import { useState, useEffect } from 'react'; 
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import './Login.css';

const Login = () => {
  const [form, setForm] = useState({
    correo: '',
    contrasena: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.registrationSuccess) {
      setError(`¡Registro exitoso! Por favor inicia sesión con ${location.state.email}`);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const result = await login(form.correo, form.contrasena);
    
    if (!result.success) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser?.rol === 'admin') {
      navigate('/admin/agregar-producto');
    } else {
      navigate('/');
    }

    setIsLoading(false);
  };  

  return (
    <>
      <div className="top-banner">
        Regístrate ahora y ahorra 20% en tu primera compra <a href="#">Comprar ahora</a>
      </div>

      <header className="main-header">
        <div className="logo">THE FORMULA</div>
        <nav className="main-nav">
          <Link to="/">Inicio</Link>
          <Link className="actual" to="/login">Iniciar sesión</Link>
          <Link to="/register">Regístrate</Link>
        </nav>
        <div className="search-box">
          <input type="text" placeholder="¿Qué estás buscando?" />
          <button>🔍</button>
        </div>
      </header>

      <main className="login-container">
        <div className="login-card">
          <div className="login-content">
            <div className="login-image">
              <img src="/src/assets/Proteins-hero-indybest.png" alt="Suplementos" />
            </div>
            <div className="login-form-side">
              <div className="login-header">
                <h2>Iniciar sesión</h2>
              </div>
              
              {error && (
                <div className="error-message" style={{
                  color: error.includes('¡Registro exitoso!') ? 'green' : '#d0342c',
                  padding: '10px',
                  marginBottom: '15px',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Correo electrónico o teléfono celular</label>
                  <input
                    type="text"
                    name="correo"
                    placeholder="ejemplo@gmail.com"
                    value={form.correo}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    name="contrasena"
                    value={form.contrasena}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-buttons">
                  <button 
                    type="submit" 
                    className="create"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                  </button>
                </div>
              </form>

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/register" style={{ color: '#d0342c' }}>
                  ¿No tienes cuenta? Regístrate
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;
