import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  TrendingUp,
  Sparkles,
  Truck,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Star,
} from "lucide-react";
import { useProductStore } from "../context/productStore";
import ProductCard from "../components/ProductCard";
import { LoadingState } from "../components/UIState";

const Home = () => {
  const { products, fetchProducts, isLoading } = useProductStore();

  useEffect(() => {
    // Fetch latest 4 products for the landing page
    fetchProducts({ limit: 4, sortBy: "createdAt", order: "desc" });
  }, [fetchProducts]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-12)",
      }}
    >
      {/* Hero Section */}
      <section
        className="glass"
        style={{
          padding: "var(--spacing-12) var(--spacing-8)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "var(--spacing-6)",
          minHeight: "450px",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-10%",
            width: "300px",
            height: "300px",
            background: "var(--color-primary)",
            opacity: "0.1",
            filter: "blur(100px)",
            borderRadius: "50%",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-2)",
            color: "var(--color-primary)",
          }}
        >
          <Sparkles size={20} />
          <span
            style={{
              fontWeight: "var(--font-weight-bold)",
              fontSize: "var(--font-size-sm)",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            New Collection 2024
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: "900",
            lineHeight: "1.1",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          Elevate Your Lifestyle with{" "}
          <span style={{ color: "var(--color-primary)" }}>UnityMart</span>
        </h1>

        <p
          style={{
            fontSize: "var(--font-size-lg)",
            color: "var(--color-text-muted)",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Discover a curated collection of premium products designed for the
          modern individual. Quality meets minimalism.
        </p>

        <div
          style={{
            display: "flex",
            gap: "var(--spacing-4)",
            marginTop: "var(--spacing-4)",
          }}
        >
          <Link
            to="/products"
            className="button-primary"
            style={{ textDecoration: "none", padding: "16px 32px" }}
          >
            Shop Now <ArrowRight size={20} />
          </Link>
          <Link
            to="/products?sortBy=price&order=asc"
            className="button-secondary"
            style={{ textDecoration: "none", padding: "16px 32px" }}
          >
            View Deals
          </Link>
        </div>
      </section>

      {/* Trust Badges */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "var(--spacing-6)",
        }}
      >
        {[
          {
            icon: <Truck size={32} />,
            title: "Free Shipping",
            desc: "On all orders over ₹999",
          },
          {
            icon: <ShieldCheck size={32} />,
            title: "Secure Payment",
            desc: "100% protected checkout",
          },
          {
            icon: <Headphones size={32} />,
            title: "24/7 Support",
            desc: "Dedicated help center",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="glass"
            style={{
              padding: "var(--spacing-6)",
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-4)",
              transition: "transform 0.3s ease",
            }}
          >
            <div style={{ color: "var(--color-primary)" }}>{item.icon}</div>
            <div>
              <h4
                style={{
                  fontWeight: "var(--font-weight-bold)",
                  marginBottom: "4px",
                }}
              >
                {item.title}
              </h4>
              <p
                style={{
                  fontSize: "var(--font-size-sm)",
                  color: "var(--color-text-muted)",
                }}
              >
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Featured Categories */}
      <section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "var(--spacing-6)",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "var(--font-size-2xl)",
                fontWeight: "var(--font-weight-bold)",
              }}
            >
              Shop by Category
            </h2>
            <p style={{ color: "var(--color-text-muted)" }}>
              Find exactly what you're looking for
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "var(--spacing-6)",
          }}
        >
          {[
            {
              name: "Electronics",
              items: "120+ Products",
              icon: <TrendingUp />,
              color: "#3b82f6",
            },
            {
              name: "Fashion",
              items: "450+ Products",
              icon: <ShoppingBag />,
              color: "#ec4899",
            },
            {
              name: "Home Living",
              items: "80+ Products",
              icon: <Star />,
              color: "#10b981",
            },
          ].map((cat, i) => (
            <Link
              key={i}
              to={`/products?search=${cat.name}`}
              className="glass"
              style={{
                padding: "var(--spacing-8)",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-4)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.borderColor = "var(--color-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  backgroundColor: cat.color + "20",
                  color: cat.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cat.icon}
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "var(--font-size-xl)",
                    fontWeight: "var(--font-weight-bold)",
                  }}
                >
                  {cat.name}
                </h3>
                <p
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: "var(--font-size-sm)",
                  }}
                >
                  {cat.items}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Arrivals */}
      <section style={{ marginBottom: "var(--spacing-12)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "var(--spacing-6)",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "var(--font-size-2xl)",
                fontWeight: "var(--font-weight-bold)",
              }}
            >
              Latest Arrivals
            </h2>
            <p style={{ color: "var(--color-text-muted)" }}>
              Fresh picks just for you
            </p>
          </div>
          <Link
            to="/products"
            style={{
              color: "var(--color-primary)",
              textDecoration: "none",
              fontWeight: "var(--font-weight-bold)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <LoadingState message="Fetching latest products..." />
        ) : products && products.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "var(--spacing-6)",
            }}
          >
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div
            className="glass"
            style={{ padding: "var(--spacing-10)", textAlign: "center" }}
          >
            <p style={{ color: "var(--color-text-muted)" }}>
              New products are coming soon! Stay tuned.
            </p>
            <Link
              to="/products"
              className="button-text"
              style={{ marginTop: "var(--spacing-4)" }}
            >
              Browse catalog
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
