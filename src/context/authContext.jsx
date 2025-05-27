import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (correo, contrasena) => {
    try {
      const response = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          correo: correo.trim().toLowerCase(),
          contrasena
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el inicio de sesión');
      }

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

      return { success: true };
      
    } catch (err) {
      console.error('Login error:', err);
      return { 
        success: false, 
        error: err.message.includes('Failed to fetch') ? 
          'No se puede conectar al servidor' : 
          err.message
      };
    }
  };

  const register = async (form) => {
    try {
      const response = await fetch('http://localhost:3001/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          correo: form.correo.trim().toLowerCase(),
          telefono: form.telefono,
          contrasena: form.contrasena
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar');
      }

      return { success: true };
    } catch (err) {
      console.error('Register error:', err);
      return {
        success: false,
        error: err.message.includes('Failed to fetch')
          ? 'No se puede conectar al servidor'
          : err.message
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);

      const normalizedUser = {
        id: parsed.id,
        nombre: parsed.nombre ?? parsed.NOMBRE ?? '',
        apellido: parsed.apellido ?? parsed.APELLIDO ?? '',
        correo: parsed.correo ?? parsed.CORREO ?? '',
        telefono: parsed.telefono ?? parsed.TELEFONO ?? '',
        rol:
          parsed.rol?.toLowerCase?.() ??
          parsed.ROL?.toLowerCase?.() ??
          (parsed.admin === 1 || parsed.admin === true || parsed.admin === '1' ||
           parsed.ADMIN === 1 || parsed.ADMIN === true || parsed.ADMIN === '1'
            ? 'admin'
            : 'user')
      };

      console.log("✅ Usuario normalizado:", normalizedUser);

      setUser(normalizedUser);
    } catch (err) {
      console.error('❌ Error al parsear usuario almacenado:', err);
    }
  }
}, []);


  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
