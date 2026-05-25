import { useEffect, useState } from "react";
import API from "../../api/axios";
import AdminLayout from "./AdminLayout";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
 const [form, setForm] = useState({
  name: "",
  email: "",
  password: "",
  role: "distributor",
  phone: "",
  doorNumber: "",
  street: "",
  area: "",
  address: "",
});
  const [editId, setEditId] = useState(null);

  const [errors, setErrors] = useState({});
const [success, setSuccess] = useState("");

const [currentPage, setCurrentPage] =
  useState(1);

const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


const validateForm = () => {
  let newErrors = {};

  // Name
  if (!form.name.trim()) {
    newErrors.name = "Name is required";
  } else if (!/^[A-Za-z ]+$/.test(form.name)) {
    newErrors.name =
      "Only alphabets allowed";
  }

  // Email
  if (!form.email.trim()) {
    newErrors.email = "Email is required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      form.email
    )
  ) {
    newErrors.email =
      "Invalid email format";
  }

  // Phone
  if (!form.phone.trim()) {
    newErrors.phone =
      "Phone number required";
  } else if (
    !/^[0-9]+$/.test(form.phone)
  ) {
    newErrors.phone =
      "Only numbers allowed";
  } else if (
    form.phone.length < 10 ||
    form.phone.length > 12
  ) {
    newErrors.phone =
      "Phone must be 10-12 digits";
  }

  // Address
 if (
  !form.address.trim() &&
  !form.doorNumber.trim()
) {
  newErrors.address =
    "Address required";
}

  // Password
  if (!editId && !form.password.trim()) {
    newErrors.password =
      "Password required";
  } else if (
    form.password &&
    form.password.length < 6
  ) {
    newErrors.password =
      "Minimum 6 characters";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

 const handleSubmit = async (e) => {
  e.preventDefault();

  setSuccess("");
  setErrors({});

  // Validation
  if (!validateForm()) return;

  try {

    // Final Address
    const finalForm = {
      ...form,
      address: form.address
        ? form.address
        : `${form.doorNumber || ""}, ${
            form.street || ""
          }, ${form.area || ""}`,
    };

    // Remove empty password while updating
    if (editId && !finalForm.password) {
      delete finalForm.password;
    }

    if (editId) {

      await API.put(
        `/admin/update/${editId}`,
        finalForm
      );

      setSuccess(
        "User updated successfully"
      );

    } else {

      await API.post(
        "/admin/create-user",
        finalForm
      );

      setSuccess(
        "User created successfully"
      );
    }

    // Reset form
    setForm({
      name: "",
      email: "",
      password: "",
      role: "distributor",
      phone: "",
      doorNumber: "",
      street: "",
      area: "",
      address: "",
    });

    setEditId(null);

    fetchUsers();

  } catch (err) {

    console.log(err);

    alert(
      err.response?.data?.message ||
        "Something went wrong"
    );
  }
};

  const handleEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      phone: user.phone || "",
doorNumber: user.doorNumber || "",
street: user.street || "",
area: user.area || "",
address: user.address || "",
    });
    setEditId(user._id);
  };

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

  // 🔥 RESET PASSWORD
const handleResetPassword = async (id) => {
  const newPassword = prompt(
    "Enter new password"
  );

  if (!newPassword) return;

  if (newPassword.length < 6) {
    alert(
      "Password must be minimum 6 characters"
    );
    return;
  }

  try {
    const res = await API.put(
      `/admin/reset-password/${id}`,
      {
        password: newPassword,
      }
    );

    alert(
      res.data?.message ||
        "Password updated successfully"
    );

  } catch (err) {
    alert(
      err.response?.data?.message ||
        "Password update failed"
    );
  }
};

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.toLowerCase().includes(search.toLowerCase())
  );
const indexOfLastUser =
  currentPage * usersPerPage;

const indexOfFirstUser =
  indexOfLastUser - usersPerPage;

const currentUsers =
  filteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

const totalPages = Math.ceil(
  filteredUsers.length / usersPerPage
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

      {success && (
  <div style={styles.success}>
    {success}
  </div>
)}

      {/* 📝 FORM */}
      <form onSubmit={handleSubmit} style={styles.form}>
      <div>
  <input
    name="name"
    placeholder="Name"
    value={form.name}
    onChange={handleChange}
    style={styles.input}
  />

  {errors.name && (
    <p style={styles.error}>
      {errors.name}
    </p>
  )}
</div>
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" placeholder="Password" value={form.password} onChange={handleChange} />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="admin">Admin</option>
          <option value="support">Support</option>
          <option value="vendor">Vendor</option>
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
         {currentUsers.map((u) => (
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

                {/* 🔥 RESET PASSWORD BUTTON */}
                <button
                  onClick={() => handleResetPassword(u._id)}
                  style={styles.resetBtn}
                >
                  Reset Password
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.pagination}>
  <button
    disabled={currentPage === 1}
    onClick={() =>
      setCurrentPage((prev) => prev - 1)
    }
    style={{
      ...styles.pageBtn,
      opacity:
        currentPage === 1 ? 0.5 : 1,
    }}
  >
    Previous
  </button>

  <span style={styles.pageText}>
    Page {currentPage} of {totalPages}
  </span>

  <button
    disabled={
      currentPage === totalPages
    }
    onClick={() =>
      setCurrentPage((prev) => prev + 1)
    }
    style={{
      ...styles.pageBtn,
      opacity:
        currentPage === totalPages
          ? 0.5
          : 1,
    }}
  >
    Next
  </button>
</div>
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

  pageText: {
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
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
  },
  td: {
    border: "1px solid #ccc",
    padding: "10px",
  },
input: {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
},

error: {
  color: "red",
  fontSize: "13px",
  marginTop: "4px",
},

success: {
  background: "#d4edda",
  color: "#155724",
  padding: "10px",
  borderRadius: "5px",
  marginBottom: "15px",
},

pagination: {
  marginTop: "20px",
  display: "flex",
  gap: "10px",
},

pageBtn: {
  padding: "8px 12px",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px",
},

  button: {
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
  },
  editBtn: {
    marginRight: "5px",
    background: "orange",
    color: "#fff",
    border: "none",
    padding: "5px",
  },
  deleteBtn: {
    marginRight: "5px",
    background: "red",
    color: "#fff",
    border: "none",
    padding: "5px",
  },
  resetBtn: {
    background: "purple",
    color: "#fff",
    border: "none",
    padding: "5px",
  },
};

export default Users;
