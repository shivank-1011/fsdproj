import { useEffect, useState } from "react";
import { useAdminStore } from "../../context/adminStore";
import { format } from "date-fns";
import { Loader2, CheckCircle, Clock } from "lucide-react";
import "./Admin.css";

export default function StoreApproval() {
  const { stores, fetchStores, totalPages, approveStore, isLoading, error } =
    useAdminStore();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchStores(page, 10);
  }, [fetchStores, page]);

  const handleApprove = (storeId) => {
    if (window.confirm("Are you sure you want to approve this store?")) {
      approveStore(storeId);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>
          Store Approvals
        </h1>
      </div>

      {error && (
        <div
          style={{
            padding: "var(--spacing-4)",
            background: "rgba(239,68,68,0.1)",
            color: "var(--color-error)",
            borderRadius: "var(--radius-md)",
            marginBottom: "var(--spacing-6)",
          }}
        >
          {error}
        </div>
      )}

      <div className="admin-table-container glass">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Store Details</th>
              <th>Owner</th>
              <th>Created At</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && stores.length === 0 ? (
              <tr>
                <td colSpan="5" className="admin-table-empty">
                  <Loader2
                    className="animate-spin"
                    style={{ color: "var(--color-primary)", margin: "0 auto" }}
                    size={24}
                  />
                </td>
              </tr>
            ) : stores.length > 0 ? (
              stores.map((store) => (
                <tr key={store.id}>
                  <td>
                    <div
                      style={{
                        fontWeight: "var(--font-weight-bold)",
                        color: "var(--color-text)",
                      }}
                    >
                      {store.name}
                    </div>
                    <div
                      style={{
                        color: "var(--color-text-muted)",
                        fontSize: "12px",
                        marginTop: "4px",
                        maxWidth: "250px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={store.description}
                    >
                      {store.description || "No description provided."}
                    </div>
                  </td>
                  <td>
                    <div
                      style={{
                        fontWeight: "var(--font-weight-bold)",
                        color: "var(--color-text)",
                      }}
                    >
                      {store.user?.name}
                    </div>
                    <div
                      style={{
                        color: "var(--color-text-muted)",
                        fontSize: "12px",
                      }}
                    >
                      {store.user?.email}
                    </div>
                  </td>
                  <td>{format(new Date(store.createdAt), "MMM d, yyyy")}</td>
                  <td>
                    {store.isVerified ? (
                      <span className="admin-badge status-active">
                        <CheckCircle
                          size={24}
                          style={{ minWidth: "24px", minHeight: "24px" }}
                        />
                        Approved
                      </span>
                    ) : (
                      <span className="admin-badge status-pending">
                        <Clock
                          size={24}
                          style={{ minWidth: "24px", minHeight: "24px" }}
                        />
                        Pending Review
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {!store.isVerified && (
                      <button
                        onClick={() => handleApprove(store.id)}
                        className="admin-action-btn approve"
                      >
                        <CheckCircle
                          size={24}
                          style={{ minWidth: "24px", minHeight: "24px" }}
                        />
                        Approve Store
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="admin-table-empty">
                  No stores found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="admin-pagination">
            <span
              style={{
                color: "var(--color-text-muted)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              Page {page} of {totalPages}
            </span>
            <div style={{ display: "flex", gap: "var(--spacing-2)" }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="admin-pagination-btn"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="admin-pagination-btn"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
