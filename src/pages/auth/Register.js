import { useState } from "react";
import API from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "", // default role
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/register", form);

      alert(res.data.message || "Registered Successfully");

      navigate("/", { replace: true }); // 👈 go to login

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account 🚀</h2>

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />

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

          <input
            style={styles.input}
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <input
            style={styles.input}
            placeholder="Address"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />

          {/* Role Selection */}
          <select
            style={styles.input}
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
          > <option value="">Select</option>
            <option value="admin">Admin</option>
            <option value="distributor">Distributor</option>
            <option value="deliveryBoy">Delivery Boy</option>
          </select>

          <button style={styles.button} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div style={{ marginTop: "10px" }}>
          Already have account? <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  );
};

// 🎨 Styles (same as login)
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
    width: "320px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Register;