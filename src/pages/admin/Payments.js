import { useCallback, useEffect, useState } from "react";
import API from "../../api/axios";
import AdminDataTable from "../../components/AdminDataTable";
import StatusBadge from "../../components/StatusBadge";
import AdminLayout from "./AdminLayout";
import styles from "./adminStyles";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({});

  const fetchPayments = useCallback(async () => {
    const [paymentsRes, summaryRes] = await Promise.all([
      API.get("/admin/payments"),
      API.get("/admin/payments/route-summary"),
    ]);
    setPayments(paymentsRes.data.payments || []);
    setSummary(summaryRes.data.summary || {});
  }, []);

  useEffect(() => {
    fetchPayments().catch(console.error);
  }, [fetchPayments]);

  const markCollected = async (order) => {
    const amount = prompt("Collected amount", order.totalAmount || 0);
    if (!amount) return;
    await API.patch(`/admin/payments/${order._id}/collect`, { amount });
    fetchPayments();
  };

  const processRefund = async (order) => {
    const amount = prompt("Refund amount", order.totalAmount || 0);
    if (!amount) return;
    const ok = window.confirm("Process refund and reverse all Razorpay Route transfers?");
    if (!ok) return;

    try {
      await API.post(`/admin/orders/${order._id}/refund`, {
        amount: Number(amount),
        reason: "admin_processed_refund",
      });
      alert("Refund processed");
      fetchPayments();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to process refund");
    }
  };

  const downloadReport = async () => {
    const res = await API.get("/admin/reports/download", {
      params: { type: "monthly_revenue", format: "csv" },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "monthly_revenue.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const columns = [
    { key: "vendor", label: "Vendor", render: (row) => row.vendor?.name || "-" },
    { key: "distributor", label: "Distributor", render: (row) => row.distributor?.name || "-" },
    { key: "orderId", label: "Order ID", render: (row) => row._id },
    { key: "assignedDeliveryBoy", label: "Delivery Boy", render: (row) => row.assignedDeliveryBoy?.name || "-" },
    { key: "totalAmount", label: "Amount", render: (row) => `Rs. ${row.totalAmount || 0}` },
    { key: "distributorShare", label: "Distributor Share", render: (row) => `Rs. ${row.distributorShare || 0}` },
    { key: "paymentStatus", label: "Payment", render: (row) => <StatusBadge value={row.paymentStatus} /> },
    { key: "status", label: "Order", render: (row) => <StatusBadge value={row.status} /> },
    { key: "settlement", label: "Settlement", render: (row) => row.paymentMethod === "online" ? (row.refund?.status === "processed" ? "Refunded" : "Pending/Route") : "COD" },
    {
      key: "actions",
      label: "Action",
      render: (row) => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {row.paymentMethod === "cod" && row.paymentStatus !== "paid" && (
            <button style={styles.button} onClick={() => markCollected(row)}>Mark Collected</button>
          )}
          {row.paymentMethod === "online" && row.paymentStatus === "paid" && row.refund?.status !== "processed" && (
            <button style={styles.cancelBtn} onClick={() => processRefund(row)}>Process Refund</button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Payments & Reports</h1>
          <p style={styles.subtitle}>Track subscription revenue, order Route volume, settlements, and refunds.</p>
        </div>
        <button style={styles.button} onClick={downloadReport}>Export CSV</button>
      </div>
      <div style={styles.grid}>
        {[
          ["Subscriptions Collected", summary.subscriptionsCollected],
          ["Online Order Volume", summary.onlineOrderVolume],
          ["Distributor Share", summary.distributorShare],
          ["Platform Fee", summary.platformFee],
          ["Refunds Processed", summary.refundsProcessed],
        ].map(([label, value]) => (
          <div key={label} style={styles.card}>
            <p style={styles.statLabel}>{label}</p>
            <p style={styles.statValue}>Rs. {value || 0}</p>
          </div>
        ))}
      </div>
      <AdminDataTable columns={columns} rows={payments} />
    </AdminLayout>
  );
};

export default Payments;
