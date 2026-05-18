import { useCallback, useEffect, useState } from "react";
import API from "../../api/axios";
import AdminDataTable from "../../components/AdminDataTable";
import AdminLayout from "./AdminLayout";
import styles from "./adminStyles";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({ name: "", logoUrl: "" });

  const fetchBrands = useCallback(async () => {
    const res = await API.get("/products/brands", { params: { includeInactive: true } });
    setBrands(res.data.brands || []);
  }, []);

  useEffect(() => {
    fetchBrands().catch(console.error);
  }, [fetchBrands]);

  const submit = async (e) => {
    e.preventDefault();
    await API.post("/products/brands", form);
    setForm({ name: "", logoUrl: "" });
    fetchBrands();
  };

  const toggle = async (brand) => {
    await API.put(`/products/brands/${brand._id}`, { ...brand, active: !brand.active });
    fetchBrands();
  };

  const columns = [
    { key: "logo", label: "Logo", render: (row) => row.logoUrl ? <img src={row.logoUrl} alt={row.name} style={pageStyles.logo} /> : "-" },
    { key: "name", label: "Brand" },
    { key: "active", label: "Active", render: (row) => row.active ? "Yes" : "No" },
    {
      key: "actions",
      label: "Action",
      render: (row) => <button style={styles.secondaryButton} onClick={() => toggle(row)}>{row.active ? "Deactivate" : "Activate"}</button>,
    },
  ];

  return (
    <AdminLayout title="Brand Master">
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Brand Master</h1>
          <p style={styles.subtitle}>Create approved water brands that distributors can select.</p>
        </div>
      </div>

      <form onSubmit={submit} style={styles.formGrid}>
        <input style={styles.input} placeholder="Brand name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input style={styles.input} placeholder="Logo URL" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} />
        <button style={styles.button}>Add Brand</button>
      </form>

      <AdminDataTable columns={columns} rows={brands} />
    </AdminLayout>
  );
};

const pageStyles = {
  logo: {
    width: "44px",
    height: "44px",
    borderRadius: "8px",
    objectFit: "cover",
    border: "1px solid #e5e8ec",
  },
};

export default Brands;
