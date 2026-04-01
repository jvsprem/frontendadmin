import { useEffect, useState, useCallback } from "react";
import API from "../../api/axios";
import AdminLayout from "./AdminLayout";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // ✅ Fetch orders (defined BEFORE useEffect)
  const fetchOrders = useCallback(async () => {
    try {
      const res = await API.get("/admin/orders", {
        params: { status, page },
      });

      setOrders(res.data.orders);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    }
  }, [status, page]);

  // ✅ useEffect (no warning now)
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ✅ Cancel order
  const handleCancel = async (id) => {
    const reason = prompt("Enter cancellation reason:");
    if (!reason) return;

    try {
      await API.put(`/admin/orders/cancel/${id}`, { reason });
      alert("Order canceled");
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // 🎨 Status Badge
  const getStatusStyle = (status) => {
    switch (status) {
      case "delivered":
        return { background: "#28a745", color: "#fff" }; // green
      case "pending":
        return { background: "#ffc107", color: "#000" }; // yellow
      case "canceled":
        return { background: "#dc3545", color: "#fff" }; // red
      default:
        return {};
    }
  };

  return (
    <AdminLayout>
      <h2>Orders</h2>

      {/* 🔍 FILTER */}
      <select
        value={status}
        onChange={(e) => {
          setPage(1); // reset page
          setStatus(e.target.value);
        }}
        style={styles.filter}
      >
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="delivered">Delivered</option>
        <option value="canceled">Canceled</option>
      </select>

      {/* 📊 TABLE */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Vendor</th>
            <th style={styles.th}>Distributor</th>
            <th style={styles.th}>Delivery Boy</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Cancel Reason</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o, i) => (
            <tr
              key={o._id}
              style={{
                background: i % 2 === 0 ? "#fff" : "#f9f9f9",
              }}
            >
              <td style={styles.td}>{o.vendor?.name}</td>
              <td style={styles.td}>{o.distributor?.name}</td>
              <td style={styles.td}>{o.assignedDeliveryBoy?.name}</td>

              {/* 🟢 STATUS BADGE */}
              <td style={styles.td}>
                <span style={{ ...styles.badge, ...getStatusStyle(o.status) }}>
                  {o.status}
                </span>
              </td>

              {/* ❗ CANCEL REASON */}
              <td style={styles.td}>
                {o.status === "canceled" ? o.cancellationReason : "-"}
              </td>

              <td style={styles.td}>
  {new Date(o.createdAt).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })}
</td>
              <td style={styles.td}>
                {o.status === "pending" && (
                  <button
                    style={styles.cancelBtn}
                    onClick={() => handleCancel(o._id)}
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔢 PAGINATION */}
      <div style={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        <span>
          Page {page} / {pages}
        </span>

        <button disabled={page === pages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </AdminLayout>
  );
};

// 🎨 Styles
const styles = {
  filter: {
    padding: "8px",
    marginBottom: "15px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
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
  badge: {
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "12px",
    textTransform: "capitalize",
  },
  cancelBtn: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
  pagination: {
    marginTop: "15px",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
};

export default Orders;