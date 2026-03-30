import { useState, useContext, useEffect } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    if (user) {
      const role = user.role || user.user?.role;

      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/user", { replace: true });
      }
    }
  }, [user, navigate]);

  // ✅ Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      login(res.data);

      const role = res.data.role || res.data.user?.role;

      if (role === "admin") {
        navigate("/admin", { replace: true });
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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back 👋</h2>

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <button style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* <div style={{ marginTop: "10px" }}>
          <Link to="/forgot">Forgot Password?</Link>
        </div> */}

        <div style={{ marginTop: "10px" }}>
          New user? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

// 🎨 Styles
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f6fa",
  },
  card: {
    padding: "30px",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    width: "300px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Login;