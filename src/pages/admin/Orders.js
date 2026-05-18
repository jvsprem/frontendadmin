import { useEffect, useState, useCallback } from "react";
import API from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";
import AdminLayout from "./AdminLayout";
import styles from "./adminStyles";

const orderTabs = [
  { value: "", label: "All" },
  { value: "current", label: "Current" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "assigned", label: "Assigned" },
  { value: "delivered", label: "Delivered" },
  { value: "canceled", label: "Cancelled" },
];
const cancellableStatuses = ["pending", "accepted", "assigned", "due"];
const cancelReasons = [
  { code: "OUT_OF_STOCK", label: "Out of Stock" },
  { code: "AREA_SERVICEABLE_ISSUE", label: "Area Serviceable Issue" },
  { code: "DISTRIBUTOR_UNAVAILABLE", label: "Distributor Unavailable" },
  { code: "CUSTOMER_REQUEST", label: "Customer Request" },
  { code: "OTHER", label: "Other" },
];
const initiators = [
  { value: "vendor", label: "Vendor" },
  { value: "distributor", label: "Distributor" },
  { value: "customer", label: "Customer" },
  { value: "support", label: "Support Team" },
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [cancelModal, setCancelModal] = useState({
    open: false,
    orderId: null,
    initiator: "vendor",
    reasonCode: "OUT_OF_STOCK",
    adminNote: "",
  });

  // ✅ Fetch orders (defined BEFORE useEffect)
  const fetchOrders = useCallback(async () => {
    try {
      const res = await API.get("/admin/orders", {
        params: { status, page, search },
      });

      setOrders(res.data.orders);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    }
  }, [status, page, search]);

  // ✅ useEffect (no warning now)
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ✅ Cancel order
  const openCancelModal = (order) => {
    setCancelModal({
      open: true,
      orderId: order._id,
      initiator: "vendor",
      reasonCode: "OUT_OF_STOCK",
      adminNote: "",
    });
  };

  const closeCancelModal = () => {
    setCancelModal({ open: false, orderId: null, initiator: "vendor", reasonCode: "OUT_OF_STOCK", adminNote: "" });
  };

  const confirmCancel = async () => {
    if (!cancelModal.initiator || !cancelModal.reasonCode) {
      alert("Please select initiator and reason");
      return;
    }

    try {
      const selectedReason = cancelReasons.find((item) => item.code === cancelModal.reasonCode);
      await API.patch(`/admin/orders/${cancelModal.orderId}/cancel`, {
        status: "cancelled",
        initiator: cancelModal.initiator,
        reason_code: cancelModal.reasonCode,
        admin_note: cancelModal.adminNote,
        reason: `${selectedReason?.label || cancelModal.reasonCode}${cancelModal.adminNote ? ` - ${cancelModal.adminNote}` : ""}`,
      });
      alert("Order canceled");
      closeCancelModal();
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <AdminLayout>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Orders</h1>
          <p style={styles.subtitle}>Tabbed order queue with server-side pagination and admin cancellation reasons.</p>
        </div>
      </div>

      <div style={styles.toolbar}>
        {orderTabs.map((tab) => (
          <button
            key={tab.value || "all"}
            style={tab.value === status ? styles.button : styles.secondaryButton}
            onClick={() => {
              setPage(1);
              setStatus(tab.value);
            }}
          >
            {tab.label}
          </button>
        ))}
        <input
          style={styles.input}
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Search order ID or distributor phone"
        />
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Vendor</th>
              <th style={styles.th}>Order ID</th>
              <th style={styles.th}>Distributor</th>
              <th style={styles.th}>Delivery Boy</th>
              <th style={styles.th}>Amount</th>
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
              <td style={styles.td}>
                <button style={styles.linkButton} onClick={() => openCancelModal(o)}>
                  {o._id}
                </button>
              </td>
              <td style={styles.td}>{o.distributor?.name}</td>
              <td style={styles.td}>{o.assignedDeliveryBoy?.name}</td>
              <td style={styles.td}>Rs. {o.totalAmount || 0}</td>
              <td style={styles.td}>
                <StatusBadge value={o.status} />
              </td>
              <td style={styles.td}>
                {["canceled", "cancelled"].includes(o.status) ? o.cancellationReason : "-"}
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
                {cancellableStatuses.includes(String(o.status || "").toLowerCase()) ? (
                  <button
                    style={styles.cancelBtn}
                    onClick={() => openCancelModal(o)}
                  >
                    Cancel
                  </button>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

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

      {cancelModal.open && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h2 style={{ ...styles.title, fontSize: "20px" }}>Cancel Order</h2>
            <p style={styles.subtitle}>Select a reason and add any operational details.</p>

            <label style={styles.label}>Initiator</label>
            <select
              style={{ ...styles.select, width: "100%", marginBottom: "12px" }}
              value={cancelModal.initiator}
              onChange={(e) => setCancelModal({ ...cancelModal, initiator: e.target.value })}
            >
              {initiators.map((initiator) => (
                <option key={initiator.value} value={initiator.value}>
                  {initiator.label}
                </option>
              ))}
            </select>

            <label style={styles.label}>Reason</label>
            <select
              style={{ ...styles.select, width: "100%", marginBottom: "12px" }}
              value={cancelModal.reasonCode}
              onChange={(e) => setCancelModal({ ...cancelModal, reasonCode: e.target.value })}
            >
              {cancelReasons.map((reason) => (
                <option key={reason.code} value={reason.code}>
                  {reason.label}
                </option>
              ))}
            </select>

            <label style={styles.label}>Custom Note</label>
            <textarea
              style={styles.textarea}
              value={cancelModal.adminNote}
              onChange={(e) => setCancelModal({ ...cancelModal, adminNote: e.target.value })}
              placeholder="Add specific details for this cancellation"
            />

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "16px" }}>
              <button style={styles.secondaryButton} onClick={closeCancelModal}>Close</button>
              <button style={styles.cancelBtn} onClick={confirmCancel}>Confirm Cancellation</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Orders;
