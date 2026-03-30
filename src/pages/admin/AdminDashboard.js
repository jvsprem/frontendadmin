import { useEffect, useState } from "react";
import API from "../../api/axios";
import AdminLayout from "./AdminLayout";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
       const res = await API.get("/admin/dashboard/counts");
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <h2>Dashboard</h2>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Orders</h3>
          <p>{stats.ordersCount || 0}</p>
        </div>

        <div style={styles.card}>
          <h3>Distributors</h3>
          <p>{stats.distributorsCount || 0}</p>
        </div>

        <div style={styles.card}>
          <h3>Delivery Boys</h3>
          <p>{stats.deliveryBoysCount || 0}</p>
        </div>
      </div>
    </AdminLayout>
  );
};

const styles = {
  grid: {
    display: "flex",
    gap: "20px",
  },
  card: {
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    width: "200px",
  },
};

export default AdminDashboard;