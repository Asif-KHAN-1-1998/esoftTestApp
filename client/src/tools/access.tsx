import { Navigate } from 'react-router-dom';
import { JSX } from 'react';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/auth" replace />;
  } else {
    return children;
  }
};

export default PrivateRoute;
