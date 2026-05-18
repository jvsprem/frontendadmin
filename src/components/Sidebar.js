import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ isOpen }) => {
  const { user } = useContext(AuthContext);
  const role = user?.role || user?.user?.role;
  const isSupport = role === "support";

  return (
    <div
      style={{
        ...styles.sidebar,
        left: isOpen ? "0" : "-220px", // 👈 slide effect
      }}
    >
      <h2 style={styles.logo}>Aqua Admin</h2>

      <Link to="/admin/users" style={styles.link}>Users</Link>
      <Link to="/admin/orders" style={styles.link}>Orders</Link>
      {!isSupport && (
        <>
          <Link to="/admin" style={styles.link}>Dashboard</Link>
          <Link to="/admin/vendors" style={styles.link}>Vendors</Link>
          <Link to="/admin/distributors" style={styles.link}>Distributors</Link>
          <Link to="/admin/delivery-boys" style={styles.link}>Delivery Boys</Link>
          <Link to="/admin/pricing" style={styles.link}>Pricing</Link>
          <Link to="/admin/brands" style={styles.link}>Brand Master</Link>
          <Link to="/admin/products" style={styles.link}>Products & Offers</Link>
          <Link to="/admin/payments" style={styles.link}>Payments</Link>
          <Link to="/admin/subscriptions" style={styles.link}>Subscriptions</Link>
          <Link to="/admin/settings/cms" style={styles.link}>Settings CMS</Link>
        </>
      )}
    </div>
  );
};

const styles = {
 sidebar: {
  width: "220px",
  height: "100vh",
  background: "#1e272e",
  color: "#fff",
  padding: "20px",
  position: "fixed",
  top: "60px",   // 👈 FIX (push below navbar)
  left: 0,
  transition: "0.3s",
},
  logo: {
    marginBottom: "30px",
  },
  link: {
    display: "block",
    color: "#fff",
    marginBottom: "15px",
    textDecoration: "none",
  },
};

export default Sidebar;
