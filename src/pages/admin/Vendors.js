import { useCallback, useEffect, useState } from "react";
import API from "../../api/axios";
import AdminDataTable from "../../components/AdminDataTable";
import StatusBadge from "../../components/StatusBadge";
import AdminLayout from "./AdminLayout";
import styles from "./adminStyles";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const fetchVendors = useCallback(async () => {
    const res = await API.get("/admin/vendors", { params: { search, status } });
    setVendors(res.data.users || []);
  }, [search, status]);

  useEffect(() => {
    fetchVendors().catch(console.error);
  }, [fetchVendors]);

  const toggleStatus = async (vendor) => {
    const nextStatus = vendor.status === "inactive" ? "active" : "inactive";
    await API.patch(`/admin/vendors/${vendor._id}/status`, { status: nextStatus });
    fetchVendors();
  };

  const columns = [
    { key: "name", label: "Vendor" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
    { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status || "active"} /> },
    {
      key: "actions",
      label: "Action",
      render: (row) => (
        <button style={styles.secondaryButton} onClick={() => toggleStatus(row)}>
          {row.status === "inactive" ? "Activate" : "Deactivate"}
        </button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Vendors</h1>
          <p style={styles.subtitle}>Search vendors and control whether they can place orders.</p>
        </div>
      </div>
      <div style={styles.toolbar}>
        <input style={styles.input} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, phone, email" />
        <select style={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <AdminDataTable columns={columns} rows={vendors} />
    </AdminLayout>
  );
};

export default Vendors;
