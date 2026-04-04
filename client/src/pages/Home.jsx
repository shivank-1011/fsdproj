const Home = () => {
  return (
    <div>
      <h2
        style={{
          fontSize: "var(--font-size-2xl)",
          marginBottom: "var(--spacing-4)",
          color: "var(--color-primary)",
        }}
      >
        Warm Minimalist Light
      </h2>
      <p style={{ marginBottom: "var(--spacing-6)" }}>
        A fresh, airy palette of Cream, Beige, and Vibrant Orange.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "var(--spacing-6)",
        }}
      >
        <div className="glass" style={{ padding: "var(--spacing-6)" }}>
          <h3
            style={{
              fontSize: "var(--font-size-lg)",
              fontWeight: "var(--font-weight-bold)",
              marginBottom: "var(--spacing-2)",
              color: "var(--color-primary)",
            }}
          >
            Cream Foundation
          </h3>
          <p>Soft, warm backgrounds that are easy on the eyes.</p>
        </div>
        <div className="glass" style={{ padding: "var(--spacing-6)" }}>
          <h3
            style={{
              fontSize: "var(--font-size-lg)",
              fontWeight: "var(--font-weight-bold)",
              marginBottom: "var(--spacing-2)",
            }}
          >
            Clear Typography
          </h3>
          <p>Deep Charcoal text ensures excellent readability.</p>
        </div>
        <div className="glass" style={{ padding: "var(--spacing-6)" }}>
          <h3
            style={{
              fontSize: "var(--font-size-lg)",
              fontWeight: "var(--font-weight-bold)",
              marginBottom: "var(--spacing-2)",
            }}
          >
            Orange Energy
          </h3>
          <p>Vibrant accents providing life to the minimalist design.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
