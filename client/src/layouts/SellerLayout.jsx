import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Store, Package, LogOut, Home } from "lucide-react";
import InteractiveBackground from "../components/InteractiveBackground";
import { useAuthStore } from "../context/authStore";
import "./SellerLayout.css";

const SellerLayout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navItems = [
    { path: "/seller", label: "Dashboard", icon: LayoutDashboard },
    { path: "/seller/products", label: "Products", icon: Package },
    { path: "/", label: "Back to Home", icon: Home },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <InteractiveBackground />

      {/* Sidebar */}
      <aside
        className="glass"
        style={{
          width: "260px",
          padding: "var(--spacing-6)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-8)",
          borderRight: "1px solid rgba(255, 255, 255, 0.2)",
          zIndex: 10,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "var(--font-size-xl)",
              fontWeight: "var(--font-weight-bold)",
              color: "var(--color-primary)",
            }}
          >
            Seller Dashboard
          </h1>
        </div>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-4)",
            flex: 1,
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/" &&
                item.path !== "/seller" &&
                location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`seller-nav-link ${isActive ? "active" : ""}`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button onClick={handleLogout} className="seller-logout-btn">
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: "var(--spacing-8)",
          overflowY: "auto",
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SellerLayout;
