import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

import AdminDashboard from "../pages/admin/AdminDashboard";
import UserDashboard from "../pages/user/UserDashboard";

import ProtectedRoute from "../components/ProtectedRoute";
import Users from "../pages/admin/Users";
import Orders from "../pages/admin/Orders";


const AppRoutes = () => {
  return (
    <BrowserRouter>
     <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/forgot" element={<ForgotPassword />} />

  <Route
    path="/admin"
    element={
      <ProtectedRoute role="admin">
        <AdminDashboard />
      </ProtectedRoute>
    }
  />
  


<Route path="/admin/users" element={<Users />} />
<Route path="/admin/orders" element={<Orders />} />


  <Route
    path="/user"
    element={
      <ProtectedRoute>
        <UserDashboard />
      </ProtectedRoute>
    }
  />
</Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;