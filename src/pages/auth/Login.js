import { useState, useContext, useEffect } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  FaTint,
  FaEnvelope,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Auto Redirect
  useEffect(() => {
    if (user) {
      const role = user.role || user.user?.role;

      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else if (role === "support") {
        navigate("/admin/orders", { replace: true });
      } else {
        navigate("/user", { replace: true });
      }
    }
  }, [user, navigate]);

  // ✅ Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please enter email & password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      login(res.data);

      const role = res.data.role || res.data.user?.role;

      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else if (role === "support") {
        navigate("/admin/orders", { replace: true });
      } else {
        navigate("/user", { replace: true });
      }

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Responsive CSS */}
      <style>
        {`
          @media (max-width: 900px) {
            .login-container {
              flex-direction: column;
            }

            .left-section {
              height: 35vh;
              width: 100%;
            }

            .right-section {
              width: 100%;
              padding: 20px;
            }

            .login-card {
              width: 100% !important;
              max-width: 400px;
              padding: 30px 20px !important;
            }

            .brand-title {
              font-size: 28px !important;
            }

            .brand-text {
              font-size: 15px !important;
              line-height: 24px !important;
            }
          }

          @media (max-width: 500px) {
            .left-section {
              height: 30vh;
            }

            .login-title {
              font-size: 26px !important;
            }

            .input-box {
              height: 50px !important;
            }

            .login-btn {
              height: 50px !important;
              font-size: 15px !important;
            }
          }
        `}
      </style>

      <div className="login-container" style={styles.container}>

        {/* LEFT */}
        <div className="left-section" style={styles.leftSection}>
          <div style={styles.overlay}>
            <div style={styles.brandBox}>
              <div style={styles.logoCircle}>
                <FaTint size={40} color="#fff" />
              </div>

              <h1 className="brand-title" style={styles.brandTitle}>
                Water Supply Admin
              </h1>

              <p className="brand-text" style={styles.brandText}>
                Manage customers, distributors, delivery
                tracking, can returns and payments easily.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right-section" style={styles.rightSection}>
          <div className="login-card" style={styles.card}>

            <h2 className="login-title" style={styles.loginTitle}>
              Welcome Back 👋
            </h2>

            <p style={styles.subtitle}>
              Login to continue your business dashboard
            </p>

            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div className="input-box" style={styles.inputBox}>
                <FaEnvelope style={styles.icon} />

                <input
                  type="email"
                  placeholder="Enter Email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  style={styles.input}
                  required
                />
              </div>

              {/* Password */}
              <div className="input-box" style={styles.inputBox}>
                <FaLock style={styles.icon} />

                <input
                  type="password"
                  placeholder="Enter Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  style={styles.input}
                  required
                />
              </div>

              {/* Button */}
              <button
                className="login-btn"
                type="submit"
                style={styles.button}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}

                {!loading && (
                  <FaArrowRight style={{ marginLeft: 10 }} />
                )}
              </button>
            </form>

            <div style={styles.bottomText}>
              New User?{" "}
              <Link to="/register" style={styles.link}>
                Create Account
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

// 🎨 STYLES
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    width: "100%",
    fontFamily: "Arial, sans-serif",
    background: "#f4f7fb",
  },

  // LEFT
  leftSection: {
    flex: 1,
    backgroundImage:
      "url('https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=1200&auto=format&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  overlay: {
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(rgba(0,123,255,0.75), rgba(0,70,160,0.85))",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
  },

  brandBox: {
    textAlign: "center",
    color: "#fff",
    maxWidth: "450px",
  },

  logoCircle: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 20px",
    backdropFilter: "blur(5px)",
  },

  brandTitle: {
    fontSize: "42px",
    fontWeight: "bold",
    marginBottom: "15px",
  },

  brandText: {
    fontSize: "18px",
    lineHeight: "30px",
  },

  // RIGHT
  rightSection: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  card: {
    width: "420px",
    background: "#fff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
  },

  loginTitle: {
    fontSize: "34px",
    marginBottom: "10px",
    color: "#222",
  },

  subtitle: {
    color: "#666",
    marginBottom: "30px",
  },

  inputBox: {
    height: "55px",
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "0 15px",
    marginBottom: "20px",
    background: "#fafafa",
  },

  icon: {
    color: "#007bff",
    marginRight: "10px",
  },

  input: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "15px",
  },

  button: {
    width: "100%",
    height: "55px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg, #007bff, #0056d2)",
    color: "#fff",
    fontSize: "17px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "0.3s",
  },

  bottomText: {
    marginTop: "25px",
    textAlign: "center",
    color: "#666",
  },

  link: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Login;