import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useContext(AuthContext);

  const role = user?.role || user?.user?.role;
  const isSupport = role === "support";

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && window.innerWidth <= 768 && (
        <div
          style={styles.overlay}
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          ...styles.sidebar,
          transform: isOpen
            ? "translateX(0)"
            : "translateX(-100%)",
        }}
      >
        <h2 style={styles.logo}>
          Aqua Admin
        </h2>

        <div style={styles.menuContainer}>
          <Link
            to="/admin"
            style={styles.link}
            onClick={
              window.innerWidth <= 768
                ? toggleSidebar
                : null
            }
          >
            Dashboard
          </Link>

          <Link
            to="/admin/users"
            style={styles.link}
            onClick={
              window.innerWidth <= 768
                ? toggleSidebar
                : null
            }
          >
            Users
          </Link>

          <Link
            to="/admin/orders"
            style={styles.link}
            onClick={
              window.innerWidth <= 768
                ? toggleSidebar
                : null
            }
          >
            Orders
          </Link>

          {!isSupport && (
            <>
              <Link
                to="/admin/vendors"
                style={styles.link}
              >
                Vendors
              </Link>

              <Link
                to="/admin/distributors"
                style={styles.link}
              >
                Distributors
              </Link>

              <Link
                to="/admin/delivery-boys"
                style={styles.link}
              >
                Delivery Boys
              </Link>

              <Link
                to="/admin/pricing"
                style={styles.link}
              >
                Pricing
              </Link>

              <Link
                to="/admin/brands"
                style={styles.link}
              >
                Brand Master
              </Link>

              <Link
                to="/admin/products"
                style={styles.link}
              >
                Products & Offers
              </Link>

              <Link
                to="/admin/payments"
                style={styles.link}
              >
                Payments
              </Link>

              <Link
                to="/admin/subscriptions"
                style={styles.link}
              >
                Subscriptions
              </Link>

              <Link
                to="/admin/settings/cms"
                style={styles.link}
              >
                Settings CMS
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    zIndex: 999,
  },

  sidebar: {
    width: "240px",
    height: "calc(100vh - 60px)",
    background: "#1e272e",
    color: "#fff",
    position: "fixed",
    top: "60px",
    left: 0,
    zIndex: 1000,
    transition: "0.3s ease",
    overflowY: "auto",
    padding: "20px 15px",
    boxSizing: "border-box",
  },

  logo: {
    marginBottom: "25px",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
  },

  menuContainer: {
    display: "flex",
    flexDirection: "column",
  },

  link: {
    color: "#fff",
    textDecoration: "none",
    padding: "12px 15px",
    borderRadius: "8px",
    marginBottom: "8px",
    transition: "0.2s",
    fontSize: "15px",
    background: "transparent",
  },
};

export default Sidebar;