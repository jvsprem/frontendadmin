import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/" replace />;

  const userRole = user.role || user.user?.role;

  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;