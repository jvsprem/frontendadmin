import { useCallback, useEffect, useState } from "react";
import API from "../../api/axios";
import AdminLayout from "./AdminLayout";
import styles from "./adminStyles";

const policyTypes = [
  { value: "terms_and_conditions", label: "Terms & Conditions" },
  { value: "refund_policy", label: "Refund Policy" },
  { value: "about", label: "About" },
];

const CmsSettings = () => {
  const [policies, setPolicies] = useState([]);
  const [selectedType, setSelectedType] = useState("terms_and_conditions");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedPolicy = policies.find((policy) => policy.type === selectedType);

  const fetchPolicies = useCallback(async () => {
    const res = await API.get("/settings/policies");
    const nextPolicies = res.data.policies || [];
    setPolicies(nextPolicies);
    const current = nextPolicies.find((policy) => policy.type === selectedType) || nextPolicies[0];
    if (current) {
      setSelectedType(current.type);
      setTitle(current.title || "");
      setContent(current.content || "");
    }
  }, [selectedType]);

  useEffect(() => {
    fetchPolicies().catch(console.error);
  }, [fetchPolicies]);

  useEffect(() => {
    if (!selectedPolicy) return;
    setTitle(selectedPolicy.title || "");
    setContent(selectedPolicy.content || "");
  }, [selectedPolicy]);

  const insertTag = (tag) => {
    setContent((value) => `${value}\n<${tag}></${tag}>`);
  };

  const savePolicy = async () => {
    setSaving(true);
    try {
      const res = await API.post("/settings/policies", {
        type: selectedType,
        title,
        content,
      });
      setPolicies((current) => {
        const exists = current.some((policy) => policy.type === selectedType);
        if (!exists) return [...current, res.data.policy];
        return current.map((policy) => policy.type === selectedType ? res.data.policy : policy);
      });
      alert("Mobile app policy updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Unable to save policy");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Settings CMS</h1>
          <p style={styles.subtitle}>Update mobile app Terms, Refund Policy, and About content without publishing a new app build.</p>
        </div>
        <button style={styles.button} onClick={savePolicy} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div style={styles.toolbar}>
        <select style={styles.select} value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          {policyTypes.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        <input style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Policy title" />
        <button style={styles.secondaryButton} onClick={() => insertTag("h1")}>H1</button>
        <button style={styles.secondaryButton} onClick={() => insertTag("p")}>Paragraph</button>
        <button style={styles.secondaryButton} onClick={() => insertTag("strong")}>Bold</button>
        <button style={styles.secondaryButton} onClick={() => insertTag("ul")}>List</button>
      </div>

      <div style={styles.card}>
        <label style={styles.label}>HTML Content</label>
        <textarea
          style={{ ...styles.textarea, minHeight: "300px", fontFamily: "monospace" }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="<h1>Terms & Conditions</h1><p>Policy content...</p>"
        />
        <p style={styles.subtitle}>
          Last updated: {selectedPolicy?.updatedAt ? new Date(selectedPolicy.updatedAt).toLocaleString() : "-"}
        </p>
      </div>
    </AdminLayout>
  );
};

export default CmsSettings;
