// src/components/ProtectedRoute.jsx
import { useAuth } from '../context/authContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ guestAllowed = false }) => {
  const { user } = useAuth();
  
  // If route requires auth but no user is logged in
  if (!guestAllowed && !user) {
    return <Navigate to="/iniciar-sesion" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;