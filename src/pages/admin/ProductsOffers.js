import { useCallback, useEffect, useState } from "react";
import API from "../../api/axios";
import AdminDataTable from "../../components/AdminDataTable";
import StatusBadge from "../../components/StatusBadge";
import AdminLayout from "./AdminLayout";
import styles from "./adminStyles";

const offerLabel = (product) => {
  const offer = product.offer || {};
  if (!offer.enabled) return "-";
  if (offer.offerType === "pack_price") return `Pack of ${product.packSize || offer.minQty} @ Rs. ${offer.specialPrice}`;
  return `Buy ${offer.minQty} for Rs. ${offer.specialPrice}`;
};

const ProductsOffers = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
    const res = await API.get("/products");
    setProducts(res.data.products || []);
  }, []);

  useEffect(() => {
    fetchProducts().catch(console.error);
  }, [fetchProducts]);

  const approve = async (product, approved) => {
    await API.patch(`/products/${product._id}/offer-approval`, {
      approved,
      showOnVendorApp: true,
    });
    fetchProducts();
  };

  const toggleProduct = async (product) => {
    await API.patch(`/products/${product._id}/offer-approval`, {
      approved: product.offer?.approved,
      showOnVendorApp: product.offer?.showOnVendorApp,
      active: !product.active,
    });
    fetchProducts();
  };

  const columns = [
    { key: "brand", label: "Brand", render: (row) => row.brand?.name || "-" },
    { key: "distributor", label: "Distributor Name", render: (row) => row.distributor?.name || "-" },
    { key: "size", label: "Product Size" },
    { key: "basePrice", label: "Price", render: (row) => `Rs. ${row.basePrice || 0}` },
    { key: "offer", label: "Offer", render: offerLabel },
    { key: "active", label: "Active Status", render: (row) => <StatusBadge value={row.active ? "active" : "inactive"} /> },
    { key: "approval", label: "Offer Approval", render: (row) => row.offer?.enabled ? (row.offer?.approved ? "Approved" : "Pending") : "-" },
    {
      key: "actions",
      label: "Action",
      render: (row) => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {row.offer?.enabled && !row.offer?.approved && <button style={styles.button} onClick={() => approve(row, true)}>Approve Offer</button>}
          {row.offer?.enabled && row.offer?.approved && <button style={styles.secondaryButton} onClick={() => approve(row, false)}>Hide Offer</button>}
          <button style={styles.secondaryButton} onClick={() => toggleProduct(row)}>{row.active ? "Deactivate" : "Activate"}</button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Products & Offers">
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Products & Offers</h1>
          <p style={styles.subtitle}>Review distributor products, approve bulk deals, and control storefront visibility.</p>
        </div>
      </div>
      <AdminDataTable columns={columns} rows={products} />
    </AdminLayout>
  );
};

export default ProductsOffers;
