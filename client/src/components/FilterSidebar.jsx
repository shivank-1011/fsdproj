import { Search, SlidersHorizontal } from "lucide-react";

const FilterSidebar = ({ filters, onFilterChange, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const inputStyle = {
    width: "100%",
    padding: "var(--spacing-3)",
    paddingLeft: "40px",
    border: "none",
    borderRadius: "var(--radius-md)",
    backgroundColor: "var(--color-bg-base)",
    color: "var(--color-text)",
    fontSize: "var(--font-size-md)",
    boxShadow:
      "inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.8)",
    outline: "none",
  };

  const selectStyle = {
    width: "100%",
    padding: "var(--spacing-3)",
    border: "none",
    borderRadius: "var(--radius-md)",
    backgroundColor: "var(--color-bg-base)",
    color: "var(--color-text)",
    fontSize: "var(--font-size-md)",
    boxShadow:
      "inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.8)",
    outline: "none",
    appearance: "none",
    cursor: "pointer",
  };

  return (
    <div
      className="glass"
      style={{
        padding: "var(--spacing-6)",
        position: "sticky",
        top: "var(--spacing-6)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "var(--spacing-6)",
          paddingBottom: "var(--spacing-4)",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <SlidersHorizontal
          size={20}
          style={{
            marginRight: "var(--spacing-2)",
            color: "var(--color-primary)",
          }}
        />
        <h2
          style={{
            fontSize: "var(--font-size-lg)",
            fontWeight: "var(--font-weight-bold)",
          }}
        >
          Filters
        </h2>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "var(--spacing-6)" }}>
        <label
          style={{
            display: "block",
            marginBottom: "var(--spacing-2)",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          Search Products
        </label>
        <div style={{ position: "relative" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-text-muted)",
            }}
          />
          <input
            type="text"
            name="search"
            value={filters.search || ""}
            onChange={handleChange}
            placeholder="Search..."
            style={inputStyle}
          />
        </div>
      </div>

      {/* Price Range (Max Price) */}
      <div style={{ marginBottom: "var(--spacing-6)" }}>
        <label
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "var(--spacing-2)",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          <span>Max Price</span>
          <span style={{ color: "var(--color-primary)", fontWeight: "bold" }}>
            ₹{filters.maxPrice || "5000"}
          </span>
        </label>
        <div style={{ position: "relative", paddingTop: "var(--spacing-2)" }}>
          <input
            type="range"
            name="maxPrice"
            min="0"
            max="100000"
            step="50"
            value={filters.maxPrice || 5000}
            onChange={handleChange}
            style={{
              width: "100%",
              appearance: "none",
              height: "8px",
              background: "rgba(0,0,0,0.1)",
              borderRadius: "4px",
              outline: "none",
              cursor: "pointer",
            }}
          />
          {/* Add some custom css within the component or globally for the thumb, but modern browsers provide decent defaults */}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "4px",
            fontSize: "var(--font-size-xs)",
            color: "var(--color-text-muted)",
          }}
        >
          <span>₹0</span>
          <span>₹100000+</span>
        </div>
      </div>

      {/* Sort By */}
      <div style={{ marginBottom: "var(--spacing-6)" }}>
        <label
          style={{
            display: "block",
            marginBottom: "var(--spacing-2)",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          Sort By
        </label>
        <div style={{ position: "relative" }}>
          <select
            name="sortBy"
            value={filters.sortBy || ""}
            onChange={handleChange}
            style={selectStyle}
          >
            <option value="">Newest</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* Order Default */}
      <div style={{ marginBottom: "var(--spacing-6)" }}>
        <label
          style={{
            display: "block",
            marginBottom: "var(--spacing-2)",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          Order
        </label>
        <div style={{ position: "relative" }}>
          <select
            name="order"
            value={filters.order || "asc"}
            onChange={handleChange}
            style={selectStyle}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <button
        onClick={onReset}
        style={{
          width: "100%",
          marginTop: "var(--spacing-4)",
          borderRadius: "20px",
          border: "1px solid var(--color-primary)",
          background: "var(--color-primary)",
          color: "#ffffff",
          fontSize: "12px",
          fontWeight: "bold",
          padding: "12px 15px",
          letterSpacing: "1px",
          textTransform: "uppercase",
          cursor: "pointer",
          boxShadow: "0 4px 15px rgba(235, 94, 40, 0.3)",
          transition: "all 0.2s ease-in-out",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-primary-hover)";
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(235, 94, 40, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-primary)";
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(235, 94, 40, 0.3)";
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "scale(0.95)";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
