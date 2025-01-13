
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;