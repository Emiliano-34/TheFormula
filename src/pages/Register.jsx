import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import './Register.css';

function Register() {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    contrasena: '',
    confirmar: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'telefono') {
      const soloNumeros = value.replace(/\D/g, '');
      setForm(prev => ({ ...prev, [name]: soloNumeros }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (form.contrasena !== form.confirmar) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (!/^(55|56|81|33)\d{8}$/.test(form.telefono)) {
      setError('Introduce un número mexicano válido de 10 dígitos (Ej. 5512345678)');
      setIsLoading(false);
      return;
    }

    const result = await register(form);

    if (!result.success) {
      setError(result.error);
      setIsLoading(false);
    } else {
      navigate('/login', {
        state: {
          registrationSuccess: true,
          email: form.correo
        }
      });
    }
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
          <Link to="/login">Iniciar sesión</Link>
          <Link className="actual" to="/register">Regístrate</Link>
        </nav>
        <div className="search-box">
          <input type="text" placeholder="¿Qué estás buscando?" />
          <button>🔍</button>
        </div>
      </header>

      <main className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h2>Crea tu cuenta</h2>
            <Link to="/login" className="login-link">Ya tengo cuenta</Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre(s)</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Apellidos</label>
                <input
                  type="text"
                  name="apellidos"
                  value={form.apellidos}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Correo</label>
              <input
                type="email"
                name="correo"
                placeholder="ejemplo@gmail.com"
                value={form.correo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                placeholder="Ej. 5512345678"
                value={form.telefono}
                onChange={handleChange}
                maxLength={10}
                required
              />
            </div>

            <div className="form-group">
              <label>Crear contraseña</label>
              <input
                type="password"
                name="contrasena"
                value={form.contrasena}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirmar contraseña</label>
              <input
                type="password"
                name="confirmar"
                value={form.confirmar}
                onChange={handleChange}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-buttons">
              <button
                type="button"
                className="cancel"
                onClick={() => navigate('/')}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="create"
                disabled={isLoading}
              >
                {isLoading ? 'Registrando...' : 'Crear cuenta'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default Register;
