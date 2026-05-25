import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import API from "../../api/axios";
import AdminDataTable from "../../components/AdminDataTable";
import StatusBadge from "../../components/StatusBadge";
import AdminLayout from "./AdminLayout";
import styles from "./adminStyles";

const Vendors = () => {

  const [vendors, setVendors] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  // Pagination
  const [currentPage, setCurrentPage] =
    useState(1);

  const rowsPerPage = 10;

  // Fetch Vendors
  const fetchVendors = useCallback(
    async () => {
      try {

        const res = await API.get(
          "/admin/vendors"
        );

        setVendors(
          res.data.users || []
        );

      } catch (err) {
        console.error(err);
      }
    },
    []
  );

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  // Reset page on search/filter
  useEffect(() => {
    setCurrentPage(1);
  }, [search, status]);

  // Toggle Status
  const toggleStatus = async (
    vendor
  ) => {

    try {

      const nextStatus =
        vendor.status ===
        "inactive"
          ? "active"
          : "inactive";

      await API.patch(
        `/admin/vendors/${vendor._id}/status`,
        {
          status: nextStatus,
        }
      );

      // Instant UI Update
      setVendors((prev) =>
        prev.map((v) =>
          v._id === vendor._id
            ? {
                ...v,
                status: nextStatus,
              }
            : v
        )
      );

    } catch (err) {

      console.error(err);

      alert(
        "Status update failed"
      );
    }
  };

  // Search + Filter
  const filteredRows = useMemo(
    () => {
      return vendors.filter(
        (vendor) => {

          const matchesSearch =
            vendor.name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            vendor.email
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            vendor.phone
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesStatus =
            !status ||
            vendor.status ===
              status;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    },
    [vendors, search, status]
  );

  // Pagination
  const indexOfLastRow =
    currentPage * rowsPerPage;

  const indexOfFirstRow =
    indexOfLastRow -
    rowsPerPage;

  const currentRows =
    filteredRows.slice(
      indexOfFirstRow,
      indexOfLastRow
    );

  const totalPages = Math.ceil(
    filteredRows.length /
      rowsPerPage
  );

  // Table Columns
  const columns = [
    {
      key: "name",
      label: "Vendor",
    },

    {
      key: "phone",
      label: "Phone",
    },

    {
      key: "email",
      label: "Email",
    },

    {
      key: "address",
      label: "Address",
    },

    {
      key: "status",
      label: "Status",

      render: (row) => (
        <StatusBadge
          value={
            row.status
              ? row.status.toLowerCase()
              : "active"
          }
        />
      ),
    },

    {
      key: "actions",
      label: "Action",

      render: (row) => (
        <button
          style={
            row.status ===
            "inactive"
              ? styles.activateBtn
              : styles.deactivateBtn
          }
          onClick={() =>
            toggleStatus(row)
          }
        >
          {row.status ===
          "inactive"
            ? "Activate"
            : "Deactivate"}
        </button>
      ),
    },
  ];

  return (
    <AdminLayout>

      <div style={styles.pageHeader}>
        <div>

          <h1 style={styles.title}>
            Vendors
          </h1>

          <p style={styles.subtitle}>
            Search vendors and
            control whether they
            can place orders.
          </p>

        </div>
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>

        <input
          style={styles.input}
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Search name, phone, email"
        />

        <select
          style={styles.select}
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }
        >
          <option value="">
            All Status
          </option>

          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>

        </select>
      </div>

      {/* Total Count */}
      <div style={styles.countText}>
        Total Vendors:
        {" "}
        {filteredRows.length}
      </div>

      {/* Table */}
      <AdminDataTable
        columns={columns}
        rows={currentRows}
      />

      {/* Pagination */}
      <div style={styles.pagination}>

        <button
          disabled={
            currentPage <= 1
          }
          onClick={() =>
            setCurrentPage(
              (prev) => prev - 1
            )
          }
          style={{
            ...styles.pageBtn,
            opacity:
              currentPage <= 1
                ? 0.5
                : 1,
          }}
        >
          Previous
        </button>

        <span
          style={styles.pageText}
        >
          Page {currentPage} of{" "}
          {totalPages || 1}
        </span>

        <button
          disabled={
            currentPage >=
              totalPages ||
            totalPages === 0
          }
          onClick={() =>
            setCurrentPage(
              (prev) => prev + 1
            )
          }
          style={{
            ...styles.pageBtn,
            opacity:
              currentPage >=
                totalPages ||
              totalPages === 0
                ? 0.5
                : 1,
          }}
        >
          Next
        </button>

      </div>

    </AdminLayout>
  );
};

export default Vendors;