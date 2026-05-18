import styles from "../pages/admin/adminStyles";

const palette = {
  active: { background: "#e8f6ef", color: "#176b3a" },
  inactive: { background: "#f2f4f7", color: "#667085" },
  pending: { background: "#fff4df", color: "#9a5b00" },
  accepted: { background: "#e8f3ff", color: "#175cd3" },
  assigned: { background: "#e8f3ff", color: "#175cd3" },
  delivered: { background: "#e8f6ef", color: "#176b3a" },
  paid: { background: "#e8f6ef", color: "#176b3a" },
  due: { background: "#fff4df", color: "#9a5b00" },
  canceled: { background: "#fdecec", color: "#b42318" },
  cancelled: { background: "#fdecec", color: "#b42318" },
  rejected: { background: "#fdecec", color: "#b42318" },
};

const StatusBadge = ({ value }) => {
  const normalized = String(value || "unknown").toLowerCase();
  return (
    <span style={{ ...styles.badge, ...(palette[normalized] || palette.inactive) }}>
      {value || "Unknown"}
    </span>
  );
};

export default StatusBadge;
