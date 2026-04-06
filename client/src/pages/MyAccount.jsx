import { useAuthStore } from "../context/authStore";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  Calendar,
  LogOut,
  ShoppingBag,
} from "lucide-react";

// eslint-disable-next-line no-unused-vars
function InfoRow({ Icon, label, value }) {
  return (
    <div
      className="glass"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-4)",
        padding: "var(--spacing-4)",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "var(--radius-md)",
          backgroundColor: "rgba(235, 94, 40, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={20} color="var(--color-primary)" />
      </div>
      <div>
        <p
          style={{
            fontSize: "var(--font-size-sm)",
            color: "var(--color-text-muted)",
            marginBottom: "2px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontSize: "var(--font-size-base)",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--color-text)",
          }}
        >
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

const MyAccount = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "ADMIN":
        return { bg: "rgba(239, 68, 68, 0.1)", text: "#ef4444" };
      case "SELLER":
        return { bg: "rgba(235, 94, 40, 0.1)", text: "var(--color-primary)" };
      default:
        return { bg: "rgba(34, 197, 94, 0.1)", text: "#22c55e" };
    }
  };

  const roleBadge = getRoleBadgeColor(user?.role);
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div style={{ padding: "var(--spacing-4)" }}>
      {/* Page Header */}
      <h1
        style={{
          fontSize: "var(--font-size-2xl)",
          fontWeight: "var(--font-weight-bold)",
          color: "var(--color-primary)",
          marginBottom: "var(--spacing-6)",
        }}
      >
        My Account
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: "var(--spacing-6)",
          alignItems: "start",
        }}
        className="account-layout"
      >
        {/* Left — Avatar / Identity Card */}
        <div
          className="glass"
          style={{
            padding: "var(--spacing-6)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--spacing-4)",
            textAlign: "center",
          }}
        >
          {/* Avatar Circle */}
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "var(--radius-full)",
              background:
                "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 20px rgba(235, 94, 40, 0.3)",
            }}
          >
            <User size={40} color="#ffffff" />
          </div>

          {/* Name */}
          <div>
            <h2
              style={{
                fontSize: "var(--font-size-xl)",
                fontWeight: "var(--font-weight-bold)",
                color: "var(--color-text)",
                marginBottom: "var(--spacing-1)",
              }}
            >
              {user?.name || "User"}
            </h2>
            <p
              style={{
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-muted)",
              }}
            >
              {user?.email}
            </p>
          </div>

          {/* Role Badge */}
          <span
            style={{
              backgroundColor: roleBadge.bg,
              color: roleBadge.text,
              fontSize: "var(--font-size-sm)",
              fontWeight: "var(--font-weight-bold)",
              padding: "4px 16px",
              borderRadius: "var(--radius-full)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {user?.role || "USER"}
          </span>

          {/* Divider */}
          <div
            style={{
              width: "100%",
              height: "1px",
              backgroundColor: "rgba(0,0,0,0.08)",
            }}
          />

          {/* Quick Actions */}
          {(user?.role === "SELLER" || user?.role === "ADMIN") && (
            <button
              onClick={() => navigate("/seller")}
              className="button-secondary"
              style={{ width: "100%", gap: "var(--spacing-2)" }}
            >
              <ShoppingBag size={16} />
              Seller Dashboard
            </button>
          )}
          {user?.role === "ADMIN" && (
            <button
              onClick={() => navigate("/admin")}
              className="button-secondary"
              style={{ width: "100%", gap: "var(--spacing-2)" }}
            >
              <Shield size={16} />
              Admin Panel
            </button>
          )}

          <button
            onClick={handleLogout}
            className="button-primary"
            style={{ width: "100%", gap: "var(--spacing-2)" }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        {/* Right — Info Rows */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-3)",
          }}
        >
          <h3
            style={{
              fontSize: "var(--font-size-lg)",
              fontWeight: "var(--font-weight-bold)",
              color: "var(--color-text)",
              marginBottom: "var(--spacing-2)",
            }}
          >
            Account Details
          </h3>

          <InfoRow Icon={User} label="Full Name" value={user?.name} />
          <InfoRow Icon={Mail} label="Email Address" value={user?.email} />
          <InfoRow Icon={Shield} label="Account Role" value={user?.role} />
          <InfoRow Icon={Calendar} label="Member Since" value={joinedDate} />
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
