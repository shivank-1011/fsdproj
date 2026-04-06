import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useEffect } from "react";
import { useCartStore } from "../context/cartStore";
import { useAuthStore } from "../context/authStore";

import InteractiveBackground from "../components/InteractiveBackground";

const MainLayout = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { cart, fetchCart } = useCartStore();
  const { user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const cartItemCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); // Optional: clear search after submitting
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        padding: "var(--spacing-4)",
      }}
    >
      <InteractiveBackground />
      <header
        className="glass main-header"
        style={{
          padding: "var(--spacing-4)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--spacing-6)",
          gap: "var(--spacing-4)",
          position: "relative",
          zIndex: 110,
          overflow: "visible",
        }}
      >
        {/* Logo / App Name */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1
            style={{
              fontSize: "var(--font-size-xl)",
              fontWeight: "var(--font-weight-bold)",
              color: "var(--color-primary)",
              margin: 0,
            }}
          >
            UnityMart
          </h1>
        </Link>

        {/* Global Search Bar */}
        <form
          className="main-search-form"
          onSubmit={handleSearch}
          style={{
            flex: 1,
            maxWidth: "500px",
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "12px",
              color: "var(--color-text-muted)",
            }}
          />
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 16px 10px 40px",
              border: "none",
              borderRadius: "24px",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              color: "var(--color-text)",
              fontSize: "var(--font-size-md)",
              boxShadow:
                "inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.8)",
              outline: "none",
            }}
          />
        </form>

        {/* Navigation - Desktop & Mobile */}
        <nav className={`main-nav ${isMobileMenuOpen ? "mobile-open" : ""}`}>
          <Link
            to="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              textDecoration: "none",
              color: "var(--color-text)",
              fontWeight: "var(--font-weight-medium)",
            }}
          >
            Products
          </Link>
          {(user?.role === "SELLER" || user?.role === "ADMIN") && (
            <Link
              to="/seller"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                textDecoration: "none",
                color: "var(--color-primary)",
                fontWeight: "var(--font-weight-bold)",
              }}
            >
              Seller Dashboard
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                textDecoration: "none",
                color: "var(--color-primary)",
                fontWeight: "var(--font-weight-bold)",
              }}
            >
              Admin Dashboard
            </Link>
          )}
          <Link
            to="/account"
            onClick={() => setIsMobileMenuOpen(false)}
            title="My Account"
            style={{
              textDecoration: "none",
              color: "var(--color-text)",
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-full)",
                background:
                  "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(235, 94, 40, 0.3)",
              }}
            >
              <User size={18} color="#ffffff" />
            </div>
          </Link>
          <Link
            to="/cart"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              textDecoration: "none",
              color: "var(--color-text)",
              position: "relative",
            }}
          >
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  backgroundColor: "var(--color-primary)",
                  color: "#ffffff",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  borderRadius: "var(--radius-full)",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          style={{
            background: "none",
            border: "none",
            color: "var(--color-text)",
            cursor: "pointer",
            padding: "4px",
            flexShrink: 0,
          }}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      <main
        className="glass"
        style={{
          flex: 1,
          padding: "var(--spacing-6)",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          marginBottom: "var(--spacing-6)",
        }}
      >
        <Outlet />
      </main>

      <footer
        className="glass"
        style={{
          padding: "var(--spacing-4)",
          textAlign: "center",
          color: "var(--color-text-muted)",
        }}
      >
        <p>&copy; {new Date().getFullYear()} UnityMart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
