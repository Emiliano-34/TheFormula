import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.rol !== 'admin') {
    return <Navigate to="PanelAdmin" />;
  }

  return children;
};

export default AdminRoute;
