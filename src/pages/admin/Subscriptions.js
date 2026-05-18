import { useCallback, useEffect, useState } from "react";
import API from "../../api/axios";
import AdminDataTable from "../../components/AdminDataTable";
import StatusBadge from "../../components/StatusBadge";
import AdminLayout from "./AdminLayout";
import styles from "./adminStyles";

const Subscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [history, setHistory] = useState([]);
  const [saving, setSaving] = useState(false);
  const [freeTrialEnabled, setFreeTrialEnabled] = useState(false);

  const fetchSubscriptions = useCallback(async () => {
    const [settingsRes, historyRes] = await Promise.all([
      API.get("/subscription/admin/settings"),
      API.get("/subscription/admin/history"),
    ]);

    setPlans(settingsRes.data.plans || []);
    setFreeTrialEnabled(Boolean(settingsRes.data.settings?.freeTrialEnabled));
    setHistory(historyRes.data.history || []);
  }, []);

  useEffect(() => {
    fetchSubscriptions().catch(console.error);
  }, [fetchSubscriptions]);

  const updatePlan = (index, field, value) => {
    const nextPlans = [...plans];
    nextPlans[index] = {
      ...nextPlans[index],
      [field]: field === "amount" || field === "months" ? Number(value) : value,
    };
    setPlans(nextPlans);
  };

  const savePlans = async () => {
    setSaving(true);
    try {
      const res = await API.put("/subscription/admin/settings", { plans, freeTrialEnabled });
      setPlans(res.data.plans || []);
      setFreeTrialEnabled(Boolean(res.data.settings?.freeTrialEnabled));
      alert("Subscription plans updated");
    } catch (err) {
      alert(err.response?.data?.message || "Unable to save plans");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: "distributorId", label: "Distributor", render: (row) => row.distributorId?.name || "-" },
    { key: "plan", label: "Plan", render: (row) => row.plan || row.planType || "-" },
    { key: "amountPaid", label: "Amount", render: (row) => `Rs. ${row.amountPaid ?? row.amount ?? 0}` },
    {
      key: "type",
      label: "Type",
      render: (row) => {
        if (row.type === "admin_granted_trial") return "Admin Granted Trial";
        if (row.type === "free_trial") return "Free Trial";
        return "Online (Razorpay)";
      },
    },
    { key: "startDate", label: "Start Date", render: (row) => row.startDate ? new Date(row.startDate).toLocaleDateString() : "-" },
    { key: "expiryDate", label: "Expiry Date", render: (row) => (row.expiryDate || row.endDate) ? new Date(row.expiryDate || row.endDate).toLocaleDateString() : "-" },
    { key: "paymentStatus", label: "Payment", render: (row) => <StatusBadge value={row.paymentStatus} /> },
    { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
  ];

  return (
    <AdminLayout>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Subscription Settings</h1>
          <p style={styles.subtitle}>Set distributor plans and review Razorpay subscription payments.</p>
        </div>
        <button style={styles.button} onClick={savePlans} disabled={saving}>
          {saving ? "Saving..." : "Save Plans"}
        </button>
      </div>

      <div style={styles.grid}>
        {plans.map((plan, index) => (
          <div key={plan.code} style={styles.card}>
            <p style={styles.statLabel}>{plan.label}</p>
            <input
              style={{ ...styles.input, minWidth: "100%", marginTop: "10px" }}
              value={plan.label}
              onChange={(e) => updatePlan(index, "label", e.target.value)}
            />
            <input
              style={{ ...styles.input, minWidth: "100%", marginTop: "10px" }}
              type="number"
              value={plan.amount}
              onChange={(e) => updatePlan(index, "amount", e.target.value)}
              placeholder="Amount"
            />
            <label style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "10px" }}>
              <input
                type="checkbox"
                checked={plan.active !== false}
                onChange={(e) => updatePlan(index, "active", e.target.checked)}
              />
              Active
            </label>
          </div>
        ))}
      </div>

      <div style={{ ...styles.card, marginBottom: "18px" }}>
        <p style={styles.statLabel}>Free trial</p>
        <label style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "8px" }}>
          <input type="checkbox" checked={freeTrialEnabled} onChange={(e) => setFreeTrialEnabled(e.target.checked)} />
          Enable 1 month free trial for new distributors
        </label>
      </div>

      <h2 style={{ ...styles.title, fontSize: "20px", marginBottom: "12px" }}>Subscription History</h2>
      <AdminDataTable columns={columns} rows={history} />
    </AdminLayout>
  );
};

export default Subscriptions;
