import { useEffect, useState } from "react";
import API from "../../api/axios";
import AdminLayout from "./AdminLayout";
import styles from "./adminStyles";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [routeSummary, setRouteSummary] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
       const [statsRes, routeRes] = await Promise.all([
          API.get("/admin/dashboard/counts"),
          API.get("/admin/payments/route-summary"),
        ]);
        setStats(statsRes.data.data);
        setRouteSummary(routeRes.data.summary || {});
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Live operating summary for orders, collections, and network capacity.</p>
        </div>
      </div>
      <div style={styles.grid}>
        {[
          ["Orders", stats.ordersCount],
          ["Pending Orders", stats.pendingOrders],
          ["Delivered", stats.deliveredOrders],
          ["Cancelled", stats.canceledOrders],
          ["Vendors", stats.vendorsCount],
          ["Distributors", stats.distributorsCount],
          ["Delivery Boys", stats.deliveryBoysCount],
          ["COD Due", stats.codDueOrders],
          ["Total Revenue", `Rs. ${stats.totalRevenue || 0}`],
          ["Subscriptions", `Rs. ${routeSummary.subscriptionsCollected || 0}`],
          ["Route Volume", `Rs. ${routeSummary.onlineOrderVolume || 0}`],
          ["Distributor Share", `Rs. ${routeSummary.distributorShare || 0}`],
        ].map(([label, value]) => (
          <div key={label} style={styles.card}>
            <p style={styles.statLabel}>{label}</p>
            <p style={styles.statValue}>{value || 0}</p>
          </div>
        ))}
      </div>
      <div style={styles.card}>
        <p style={styles.statLabel}>Today Revenue</p>
        <p style={styles.statValue}>Rs. {stats.todayRevenue || 0}</p>
        <div style={{ height: "12px", background: "#eaf2f8", borderRadius: "999px", overflow: "hidden" }}>
          <div
            style={{
              width: `${Math.min(((stats.todayRevenue || 0) / Math.max(stats.totalRevenue || 1, 1)) * 100, 100)}%`,
              height: "100%",
              background: "#146c94",
            }}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
