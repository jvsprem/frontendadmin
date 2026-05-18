import { useCallback, useEffect, useState } from "react";
import API from "../../api/axios";
import AdminDataTable from "../../components/AdminDataTable";
import AdminLayout from "./AdminLayout";
import styles from "./adminStyles";

const Distributors = () => {
  const [distributors, setDistributors] = useState([]);
  const [search, setSearch] = useState("");
  const [areas, setAreas] = useState({});

  const fetchDistributors = useCallback(async () => {
    const res = await API.get("/admin/distributors", { params: { search } });
    const users = res.data.users || [];
    setDistributors(users);
    setAreas(Object.fromEntries(users.map((user) => [user._id, (user.assignedAreas || []).join(", ")])));
  }, [search]);

  useEffect(() => {
    fetchDistributors().catch(console.error);
  }, [fetchDistributors]);

  const saveAreas = async (id) => {
    const list = (areas[id] || "").split(",").map((item) => item.trim()).filter(Boolean);
    await API.put(`/admin/distributors/${id}/assign-area`, { areas: list });
    fetchDistributors();
  };

  const createLinkedAccount = async (distributor) => {
    const ok = window.confirm(`Create Razorpay linked account for ${distributor.name}?`);
    if (!ok) return;

    try {
      await API.post(`/admin/distributors/${distributor._id}/linked-account`);
      alert("Linked account created");
      fetchDistributors();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to create linked account");
    }
  };

  const linkExistingAccount = async (distributor) => {
    if (!distributor?._id) return;
    const accountId = window.prompt(
      `Paste the Razorpay linked account ID for ${distributor.name}`,
      distributor.razorpayRoute?.accountId || ""
    );
    if (!accountId) return;

    try {
      await API.post(`/admin/distributors/${distributor._id}/linked-account`, {
        accountId: accountId.trim(),
      });
      alert("Linked account saved");
      fetchDistributors();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to link account");
    }
  };

  const syncLinkedAccount = async (distributor) => {
    if (!distributor?.razorpayRoute?.accountId) {
      alert("No linked account exists for this distributor");
      return;
    }

    try {
      await API.patch(`/admin/distributors/${distributor._id}/linked-account/sync`);
      fetchDistributors();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to sync linked account");
    }
  };

  const editLinkedAccount = async (distributor) => {
    if (!distributor?.razorpayRoute?.accountId) {
      alert("No linked account exists for this distributor");
      return;
    }

    const name = window.prompt("Business name", distributor.name || "");
    if (!name) return;
    const phone = window.prompt("Phone", distributor.phone || "");
    if (!phone) return;
    const address = window.prompt("Registered address", distributor.address || "");
    if (!address) return;

    try {
      await API.patch(`/admin/distributors/${distributor._id}/linked-account`, {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      alert("Linked account updated");
      fetchDistributors();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to update linked account");
    }
  };

  const toggleLinkedAccount = async (distributor) => {
    if (!distributor?.razorpayRoute?.accountId) {
      alert("No linked account exists for this distributor");
      return;
    }

    const currentlyEnabled = distributor.razorpayRoute?.isEnabled !== false;
    const action = currentlyEnabled ? "disable" : "enable";
    const ok = window.confirm(`Do you want to ${action} Route payouts for ${distributor.name}?`);
    if (!ok) return;

    try {
      await API.patch(`/admin/distributors/${distributor._id}/linked-account/toggle`, {
        enabled: !currentlyEnabled,
      });
      fetchDistributors();
    } catch (err) {
      alert(err.response?.data?.message || `Unable to ${action} linked account`);
    }
  };

  const unlinkLinkedAccount = async (distributor) => {
    if (!distributor?.razorpayRoute?.accountId) {
      alert("No linked account exists for this distributor");
      return;
    }

    const ok = window.confirm(
      `Unlink Razorpay account ${distributor.razorpayRoute?.accountId} from ${distributor.name}? This only removes the app mapping.`
    );
    if (!ok) return;

    try {
      await API.delete(`/admin/distributors/${distributor._id}/linked-account`);
      fetchDistributors();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to unlink account");
    }
  };

  const grantTrial = async (distributor) => {
    const ok = window.confirm(
      `Grant 1-month free trial to ${distributor.name}? This resets the expiry date to 30 days from today and bypasses the payment gate.`
    );
    if (!ok) return;

    try {
      await API.post(`/subscription/admin/distributors/${distributor._id}/grant-trial`);
      alert("Free trial granted");
      fetchDistributors();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to grant trial");
    }
  };

  const columns = [
    { key: "name", label: "Distributor" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status", render: (row) => row.status || "active" },
    { key: "accountStatus", label: "Account Status", render: (row) => row.razorpayRoute?.accountStatus || "not_created" },
    { key: "kyc", label: "KYC Status", render: (row) => row.razorpayRoute?.kycStatus || "not_started" },
    {
      key: "routeEnabled",
      label: "Route",
      render: (row) => row.razorpayRoute?.accountId
        ? row.razorpayRoute?.isEnabled === false ? "disabled" : "enabled"
        : "not_created",
    },
    { key: "linkedAccount", label: "Linked Account", render: (row) => row.razorpayRoute?.accountId || "-" },
    { key: "bank", label: "Bank", render: (row) => row.bankDetails?.accountNumberLast4 ? `****${row.bankDetails.accountNumberLast4}` : "-" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
    {
      key: "assignedAreas",
      label: "Areas",
      render: (row) => (
        <input
          style={{ ...styles.input, minWidth: "260px" }}
          value={areas[row._id] || ""}
          onChange={(e) => setAreas({ ...areas, [row._id]: e.target.value })}
          placeholder="Area 1, Area 2"
        />
      ),
    },
    {
      key: "actions",
      label: "Action",
      render: (row) => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button style={styles.button} onClick={() => saveAreas(row._id)}>Save Areas</button>
          {row.razorpayRoute?.accountId ? (
            <>
              <button style={styles.secondaryButton} onClick={() => syncLinkedAccount(row)}>Sync KYC</button>
              <button style={styles.secondaryButton} onClick={() => editLinkedAccount(row)}>Edit Account</button>
              <button style={styles.secondaryButton} onClick={() => toggleLinkedAccount(row)}>
                {row.razorpayRoute?.isEnabled === false ? "Enable Route" : "Disable Route"}
              </button>
              <button style={styles.secondaryButton} onClick={() => unlinkLinkedAccount(row)}>Unlink</button>
            </>
          ) : (
            <>
              <button style={styles.button} onClick={() => createLinkedAccount(row)}>Create Linked Account</button>
              <button style={styles.secondaryButton} onClick={() => linkExistingAccount(row)}>Link Existing Account</button>
            </>
          )}
          <button
            style={styles.secondaryButton}
            title="This will reset the distributor's expiry date to 30 days from today and bypass the payment gate."
            onClick={() => grantTrial(row)}
          >
            Grant 1-Month Free Trial
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Distributors</h1>
          <p style={styles.subtitle}>Map distributors to service areas used by delivery assignment and pricing.</p>
        </div>
      </div>
      <div style={styles.toolbar}>
        <input style={styles.input} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search distributor" />
      </div>
      <AdminDataTable columns={columns} rows={distributors} />
    </AdminLayout>
  );
};

export default Distributors;
