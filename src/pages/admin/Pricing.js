import { useCallback, useEffect, useState } from "react";
import API from "../../api/axios";
import AdminLayout from "./AdminLayout";
import styles from "./adminStyles";

const floorDefaults = [
  { floor: "0", rate: 0 },
  { floor: "1", rate: 0 },
  { floor: "2", rate: 0 },
  { floor: "3", rate: 0 },
];

const Pricing = () => {
  const [rates, setRates] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [form, setForm] = useState({ distributorId: "", caneRate: floorDefaults, depositAmount: 0, deliveryRange: 2000, onlineStatus: true });

  const fetchData = useCallback(async () => {
    const [ratesRes, distributorsRes] = await Promise.all([
      API.get("/admin/pricing"),
      API.get("/admin/distributors"),
    ]);
    setRates(ratesRes.data.rates || []);
    setDistributors(distributorsRes.data.users || []);
  }, []);

  useEffect(() => {
    fetchData().catch(console.error);
  }, [fetchData]);

  const loadRate = (rate) => {
    setForm({
      distributorId: rate.distributor?._id || "",
      caneRate: rate.caneRate?.length ? rate.caneRate : floorDefaults,
      depositAmount: rate.depositAmount || 0,
      deliveryRange: rate.deliveryRange || 2000,
      onlineStatus: rate.onlineStatus !== false,
      holidays: rate.holidays || "",
    });
  };

  const setFloorRate = (index, value) => {
    const caneRate = [...form.caneRate];
    caneRate[index] = { ...caneRate[index], rate: Number(value) || 0 };
    setForm({ ...form, caneRate });
  };

  const savePricing = async (e) => {
    e.preventDefault();
    await API.put("/admin/pricing", form);
    fetchData();
  };

  return (
    <AdminLayout>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Pricing Matrix</h1>
          <p style={styles.subtitle}>Set distributor-specific rates. The app can fall back to area or base pricing when no custom distributor rate exists.</p>
        </div>
      </div>

      <form style={styles.card} onSubmit={savePricing}>
        <div style={styles.formGrid}>
          <select style={styles.select} value={form.distributorId} onChange={(e) => setForm({ ...form, distributorId: e.target.value })} required>
            <option value="">Select distributor</option>
            {distributors.map((distributor) => <option key={distributor._id} value={distributor._id}>{distributor.name}</option>)}
          </select>
          <input style={styles.input} type="number" value={form.depositAmount} onChange={(e) => setForm({ ...form, depositAmount: e.target.value })} placeholder="Deposit amount" />
          <input style={styles.input} type="number" value={form.deliveryRange} onChange={(e) => setForm({ ...form, deliveryRange: e.target.value })} placeholder="Delivery range meters" />
          <select style={styles.select} value={String(form.onlineStatus)} onChange={(e) => setForm({ ...form, onlineStatus: e.target.value === "true" })}>
            <option value="true">Online</option>
            <option value="false">Offline</option>
          </select>
        </div>
        <div style={styles.formGrid}>
          {form.caneRate.map((rate, index) => (
            <input key={rate.floor} style={styles.input} type="number" value={rate.rate} onChange={(e) => setFloorRate(index, e.target.value)} placeholder={`Floor ${rate.floor} rate`} />
          ))}
        </div>
        <button style={styles.button}>Save Pricing</button>
      </form>

      <div style={{ ...styles.tableWrap, marginTop: "16px" }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Distributor</th>
              <th style={styles.th}>Rates</th>
              <th style={styles.th}>Deposit</th>
              <th style={styles.th}>Range</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((rate) => (
              <tr key={rate._id}>
                <td style={styles.td}>{rate.distributor?.name || "-"}</td>
                <td style={styles.td}>{(rate.caneRate || []).map((item) => `F${item.floor}: Rs. ${item.rate}`).join(", ") || "-"}</td>
                <td style={styles.td}>Rs. {rate.depositAmount || 0}</td>
                <td style={styles.td}>{rate.deliveryRange || 0} m</td>
                <td style={styles.td}>{rate.onlineStatus === false ? "Offline" : "Online"}</td>
                <td style={styles.td}><button style={styles.secondaryButton} onClick={() => loadRate(rate)}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Pricing;
