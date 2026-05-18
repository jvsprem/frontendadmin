import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

const Navbar = ({ toggleSidebar, title = "Admin Panel" }) => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const menuRef = useRef(null);

  useEffect(() => {
    API.get("/notifications")
      .then((res) => setNotificationCount(res.data.unreadCount || 0))
      .catch(() => setNotificationCount(0));
  }, []);

  useEffect(() => {
    const onClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const displayUser = user?.user || user || {};

  return (
    <div style={styles.nav}>
      <div style={styles.left}>
        <button onClick={toggleSidebar} style={styles.menuBtn}>
          ☰
        </button>
        <div style={styles.logoMark}>AZ</div>
        <h3 style={{ margin: 0 }}>{title}</h3>
      </div>

      <div style={styles.right}>
        <button style={styles.iconButton} title="Notifications">
          <span style={styles.bell}>🔔</span>
          {notificationCount > 0 && <span style={styles.badge}>{notificationCount}</span>}
        </button>

        <div ref={menuRef} style={{ position: "relative" }}>
          <button style={styles.avatar} onClick={() => setOpen(!open)} title="Profile">
            {(displayUser.name || "A").slice(0, 1).toUpperCase()}
          </button>
          {open && (
            <div style={styles.menu}>
              <p style={styles.menuName}>{displayUser.name || "Admin"}</p>
              <p style={styles.menuMeta}>{displayUser.role || "Super Admin"}</p>
              <button style={styles.menuItem}>My Profile</button>
              <button style={styles.menuItem}>Settings</button>
              <button onClick={logout} style={{ ...styles.menuItem, color: "#c0392b" }}>Logout</button>
            </div>
          )}
        </div>
      </div>
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
  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoMark: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    background: "#146c94",
    color: "#fff",
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
  },
  menuBtn: {
    fontSize: "22px",
    cursor: "pointer",
    border: "none",
    background: "none",
  },
  iconButton: {
    position: "relative",
    width: "40px",
    height: "40px",
    borderRadius: "20px",
    border: "1px solid #e5e8ec",
    background: "#fff",
    cursor: "pointer",
  },
  bell: {
    fontSize: "18px",
  },
  badge: {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    minWidth: "18px",
    height: "18px",
    borderRadius: "9px",
    background: "#d92d20",
    color: "#fff",
    fontSize: "11px",
    fontWeight: 800,
    display: "grid",
    placeItems: "center",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "20px",
    background: "#17202a",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 800,
  },
  menu: {
    position: "absolute",
    top: "48px",
    right: 0,
    width: "220px",
    background: "#fff",
    border: "1px solid #e5e8ec",
    borderRadius: "8px",
    boxShadow: "0 12px 32px rgba(15, 23, 42, 0.16)",
    padding: "10px",
  },
  menuName: {
    margin: "4px 8px 0",
    fontWeight: 800,
  },
  menuMeta: {
    margin: "2px 8px 8px",
    color: "#667085",
    fontSize: "12px",
  },
  menuItem: {
    display: "block",
    width: "100%",
    padding: "9px 8px",
    border: "none",
    background: "transparent",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "6px",
  },
};

export default Navbar;
