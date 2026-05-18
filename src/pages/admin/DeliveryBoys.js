import { useCallback, useEffect, useState } from "react";
import API from "../../api/axios";
import AdminDataTable from "../../components/AdminDataTable";
import AdminLayout from "./AdminLayout";
import styles from "./adminStyles";

const emptyForm = { name: "", email: "", phone: "", password: "", distributor: "", address: "" };

const DeliveryBoys = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [distributorId, setDistributorId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const fetchData = useCallback(async () => {
    const [boysRes, distributorsRes] = await Promise.all([
      API.get("/admin/delivery-boys", { params: { distributorId } }),
      API.get("/admin/distributors"),
    ]);
    setDeliveryBoys(boysRes.data.deliveryBoys || []);
    setDistributors(distributorsRes.data.users || []);
  }, [distributorId]);

  useEffect(() => {
    fetchData().catch(console.error);
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await API.put(`/admin/delivery-boys/${editId}`, form);
    } else {
      await API.post("/admin/delivery-boys", form);
    }
    setForm(emptyForm);
    setEditId(null);
    fetchData();
  };

  const editDeliveryBoy = (deliveryBoy) => {
    setEditId(deliveryBoy._id);
    setForm({
      name: deliveryBoy.name || "",
      email: deliveryBoy.email || "",
      phone: deliveryBoy.phone || "",
      password: "",
      distributor: deliveryBoy.distributor?._id || deliveryBoy.distributor || "",
      address: deliveryBoy.address || "",
    });
  };

  const deleteDeliveryBoy = async (id) => {
    if (!window.confirm("Delete this delivery boy?")) return;
    await API.delete(`/admin/delivery-boys/${id}`);
    fetchData();
  };

  const columns = [
    { key: "name", label: "Delivery Boy" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "distributor", label: "Parent Distributor", render: (row) => row.distributor?.name || "-" },
    { key: "address", label: "Address" },
    {
      key: "actions",
      label: "Action",
      render: (row) => (
        <>
          <button style={styles.secondaryButton} onClick={() => editDeliveryBoy(row)}>Edit</button>{" "}
          <button style={styles.dangerButton} onClick={() => deleteDeliveryBoy(row._id)}>Delete</button>
        </>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Delivery Boys</h1>
          <p style={styles.subtitle}>Create delivery staff and attach each one to a parent distributor.</p>
        </div>
      </div>

      <form style={styles.formGrid} onSubmit={handleSubmit}>
        <input style={styles.input} placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input style={styles.input} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input style={styles.input} placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <input style={styles.input} placeholder={editId ? "New password optional" : "Password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editId} />
        <select style={styles.select} value={form.distributor} onChange={(e) => setForm({ ...form, distributor: e.target.value })} required>
          <option value="">Select distributor</option>
          {distributors.map((distributor) => <option key={distributor._id} value={distributor._id}>{distributor.name}</option>)}
        </select>
        <input style={styles.input} placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <button style={styles.button}>{editId ? "Update" : "Create"}</button>
        {editId && <button type="button" style={styles.secondaryButton} onClick={() => { setEditId(null); setForm(emptyForm); }}>Cancel Edit</button>}
      </form>

      <div style={styles.toolbar}>
        <select style={styles.select} value={distributorId} onChange={(e) => setDistributorId(e.target.value)}>
          <option value="">All distributors</option>
          {distributors.map((distributor) => <option key={distributor._id} value={distributor._id}>{distributor.name}</option>)}
        </select>
      </div>
      <AdminDataTable columns={columns} rows={deliveryBoys} />
    </AdminLayout>
  );
};

export default DeliveryBoys;
