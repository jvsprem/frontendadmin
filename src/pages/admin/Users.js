import { useEffect, useState } from "react";
import API from "../../api/axios";
import AdminLayout from "./AdminLayout";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(""); // ✅ moved inside
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "distributor",
    phone: "",
    address: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Fetch users
  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await API.put(`/admin/update/${editId}`, form);
        alert("User updated");
      } else {
        await API.post("/admin/create-user", form);
        alert("User created");
      }

      setForm({
        name: "",
        email: "",
        password: "",
        role: "distributor",
        phone: "",
        address: "",
      });

      setEditId(null);
      fetchUsers();

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // ✅ Edit
  const handleEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      phone: user.phone || "",
      address: user.address || "",
    });
    setEditId(user._id);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await API.delete(`/admin/delete/${id}`);
      alert("User deleted");
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FILTER LOGIC
  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <h2>Users Management</h2>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search by name, email, phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {/* 📝 FORM */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" placeholder="Password" value={form.password} onChange={handleChange} />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="distributor">Distributor</option>
          <option value="deliveryBoy">Delivery Boy</option>
        </select>

        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />

        <button style={styles.button}>
          {editId ? "Update User" : "Add User"}
        </button>
      </form>

      {/* 📊 TABLE */}
      <table style={styles.table}>
  <thead>
    <tr>
      <th style={styles.th}>Name</th>
      <th style={styles.th}>Email</th>
      <th style={styles.th}>Role</th>
      <th style={styles.th}>Phone</th>
      <th style={styles.th}>Actions</th>
    </tr>
  </thead>

  <tbody>
    {filteredUsers.map((u) => (
      <tr key={u._id}>
        <td style={styles.td}>{u.name}</td>
        <td style={styles.td}>{u.email}</td>
        <td style={styles.td}>{u.role}</td>
        <td style={styles.td}>{u.phone}</td>

        <td style={styles.td}>
          <button onClick={() => handleEdit(u)} style={styles.editBtn}>
            Edit
          </button>
          <button onClick={() => handleDelete(u._id)} style={styles.deleteBtn}>
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </AdminLayout>
  );
};

// 🎨 Styles
const styles = {
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    marginBottom: "20px",
  },
  search: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
table: {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
},
th: {
  border: "1px solid #ccc",
  padding: "10px",
  background: "#f1f1f1",
  textAlign: "left",
},
td: {
  border: "1px solid #ccc",
  padding: "10px",
},
  button: {
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  editBtn: {
    marginRight: "5px",
    background: "orange",
    color: "#fff",
    border: "none",
    padding: "5px",
  },
  deleteBtn: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "5px",
  },
};

export default Users;