import styles from "../pages/admin/adminStyles";

const AdminDataTable = ({ columns, rows, emptyText = "No records found" }) => {
  const safeRows = Array.isArray(rows) ? rows.filter(Boolean) : [];

  return (
    <div style={styles.tableWrap}>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} style={styles.th}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {safeRows.length === 0 ? (
            <tr>
              <td style={styles.td} colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          ) : (
            safeRows.map((row, index) => (
              <tr key={row._id || index}>
                {columns.map((column) => (
                  <td key={column.key} style={styles.td}>
                    {column.render ? column.render(row) : row?.[column.key] || "-"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDataTable;
