import { Link } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  return (
    <div
      style={{
        ...styles.sidebar,
        left: isOpen ? "0" : "-220px", // 👈 slide effect
      }}
    >
      <h2 style={styles.logo}>Aqua Admin 💧</h2>

      <Link to="/admin" style={styles.link}>Dashboard</Link>
      <Link to="/admin/users" style={styles.link}>Users</Link>
      <Link to="/admin/customers" style={styles.link}>Customers</Link>
      <Link to="/admin/orders" style={styles.link}>Orders</Link>
      <Link to="/admin/delivery" style={styles.link}>Delivery Boys</Link>
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