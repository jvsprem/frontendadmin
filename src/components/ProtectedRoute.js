import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role, roles }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/" replace />;

  const userRole = user.role || user.user?.role;

  const allowedRoles = roles || (role ? [role] : null);

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
