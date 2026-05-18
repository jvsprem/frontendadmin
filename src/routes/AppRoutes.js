import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

import AdminDashboard from "../pages/admin/AdminDashboard";
import UserDashboard from "../pages/user/UserDashboard";

import ProtectedRoute from "../components/ProtectedRoute";
import Users from "../pages/admin/Users";
import Orders from "../pages/admin/Orders";
import Vendors from "../pages/admin/Vendors";
import Distributors from "../pages/admin/Distributors";
import DeliveryBoys from "../pages/admin/DeliveryBoys";
import Pricing from "../pages/admin/Pricing";
import Payments from "../pages/admin/Payments";
import Subscriptions from "../pages/admin/Subscriptions";
import CmsSettings from "../pages/admin/CmsSettings";
import Brands from "../pages/admin/Brands";
import ProductsOffers from "../pages/admin/ProductsOffers";


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
  


<Route path="/admin/users" element={<ProtectedRoute roles={["admin", "support"]}><Users /></ProtectedRoute>} />
<Route path="/admin/orders" element={<ProtectedRoute roles={["admin", "support"]}><Orders /></ProtectedRoute>} />
<Route path="/admin/vendors" element={<ProtectedRoute role="admin"><Vendors /></ProtectedRoute>} />
<Route path="/admin/distributors" element={<ProtectedRoute role="admin"><Distributors /></ProtectedRoute>} />
<Route path="/admin/delivery-boys" element={<ProtectedRoute role="admin"><DeliveryBoys /></ProtectedRoute>} />
<Route path="/admin/pricing" element={<ProtectedRoute role="admin"><Pricing /></ProtectedRoute>} />
<Route path="/admin/brands" element={<ProtectedRoute role="admin"><Brands /></ProtectedRoute>} />
<Route path="/admin/products" element={<ProtectedRoute role="admin"><ProductsOffers /></ProtectedRoute>} />
<Route path="/admin/payments" element={<ProtectedRoute role="admin"><Payments /></ProtectedRoute>} />
<Route path="/admin/subscriptions" element={<ProtectedRoute role="admin"><Subscriptions /></ProtectedRoute>} />
<Route path="/admin/settings/cms" element={<ProtectedRoute role="admin"><CmsSettings /></ProtectedRoute>} />


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
