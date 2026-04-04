import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Store, LogOut, Home } from "lucide-react";
import { useAuthStore } from "../context/authStore";
import InteractiveBackground from "../components/InteractiveBackground";
import "../pages/admin/Admin.css";

export default function AdminLayout() {
  const location = useLocation();
  const { logout } = useAuthStore();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users Management", href: "/admin/users", icon: Users },
    { name: "Store Approvals", href: "/admin/stores", icon: Store },
    { name: "Back to Home", href: "/", icon: Home },
  ];

  return (
    <div className="admin-layout-container">
      <InteractiveBackground />
      {/* Sidebar */}
      <div className="admin-sidebar glass" style={{ zIndex: 20 }}>
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-sidebar-logo">
            <Home size={24} />
            UnityMart
          </Link>
        </div>

        <div className="admin-nav">
          <div className="admin-nav-title">Admin Panel</div>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`admin-nav-link ${isActive ? "active" : ""}`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="admin-sidebar-footer">
          <button onClick={logout} className="admin-logout-btn">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>

      <div className="admin-main-content">
        <div className="admin-mobile-header">
          <span className="admin-sidebar-logo" style={{ fontSize: "1.25rem" }}>
            UnityMart Admin
          </span>
        </div>

        {/* Main Content Area */}
        <main className="admin-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
