import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = ({ toggleSidebar }) => {
  const { logout } = useContext(AuthContext);

  return (
    <div style={styles.nav}>
      
      {/* LEFT SIDE */}
      <div style={styles.left}>
        <button onClick={toggleSidebar} style={styles.menuBtn}>
          ☰
        </button>
        <h3 style={{ margin: 0 }}>Admin Panel</h3>
      </div>

      {/* RIGHT SIDE */}
      <button onClick={logout} style={styles.logoutBtn}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  nav: {
    height: "60px",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between", // 👈 important
    alignItems: "center",
    padding: "0 20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  menuBtn: {
    fontSize: "22px",
    cursor: "pointer",
    border: "none",
    background: "none",
  },
  logoutBtn: {
    padding: "8px 15px",
    background: "red",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Navbar;