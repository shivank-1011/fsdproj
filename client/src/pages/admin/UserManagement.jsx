import { useEffect, useState } from "react";
import { useAdminStore } from "../../context/adminStore";
import { format } from "date-fns";
import { Loader2, ShieldAlert, ShieldCheck, Search, Users } from "lucide-react";
import { LoadingState, ErrorState, EmptyState } from "../../components/UIState";
import "./Admin.css";

export default function UserManagement() {
    const { users, fetchUsers, totalPages, banUser, unbanUser, isLoading, error } = useAdminStore();
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers(page, 10);
    }, [fetchUsers, page]);

    const handleBanToggle = (userId, currentStatus) => {
        if (currentStatus) {
            if (window.confirm("Are you sure you want to unban this user?")) {
                unbanUser(userId);
            }
        } else {
            if (window.confirm("Are you sure you want to ban this user? They will not be able to log in or purchase items.")) {
                banUser(userId);
            }
        }
    };

    const filteredUsers = users.filter((u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title" style={{ marginBottom: 0 }}>User Management</h1>

                <div className="admin-search-wrapper">
                    <Search className="admin-search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="admin-search-input"
                    />
                </div>
            </div>

            {error && (
                <div style={{ marginBottom: 'var(--spacing-6)' }}>
                    <ErrorState message={error} onRetry={() => fetchUsers(page, 10)} />
                </div>
            )}

            <div className="admin-table-container glass">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Joined At</th>
                            <th>Status</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="admin-table-empty" style={{ padding: 0 }}>
                                    <LoadingState message="Loading users..." />
                                </td>
                            </tr>
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div style={{ fontWeight: "var(--font-weight-bold)", color: "var(--color-text)" }}>
                                            {user.name || "Unknown"}
                                        </div>
                                        <div style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
                                            {user.email}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`admin-badge role-${user.role.toLowerCase()}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                                    </td>
                                    <td>
                                        {user.isBanned ? (
                                            <span className="admin-badge status-banned">
                                                <span className="status-dot red"></span> Banned
                                            </span>
                                        ) : (
                                            <span className="admin-badge status-active">
                                                <span className="status-dot green"></span> Active
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        {user.role !== 'ADMIN' && (
                                            <button
                                                onClick={() => handleBanToggle(user.id, user.isBanned)}
                                                className={`admin-action-btn ${user.isBanned ? "unban" : "ban"}`}
                                            >
                                                {user.isBanned ? (
                                                    <><ShieldCheck size={16} /> Unban</>
                                                ) : (
                                                    <><ShieldAlert size={16} /> Ban</>
                                                )}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="admin-table-empty" style={{ padding: 0 }}>
                                    <EmptyState title="No Users Found" message="No users found matching your criteria." icon={Users} />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="admin-pagination">
                        <span style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
                            Page {page} of {totalPages}
                        </span>
                        <div style={{ display: "flex", gap: "var(--spacing-2)" }}>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="admin-pagination-btn"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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
