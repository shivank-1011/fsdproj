import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreStore } from "../../context/storeStore";

export default function StoreCreation() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { createStore, isLoading, error } = useStoreStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStore({ name, description });
      navigate("/seller");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="glass"
      style={{
        padding: "var(--spacing-8)",
        borderRadius: "var(--radius-xl)",
        maxWidth: "500px",
        margin: "var(--spacing-10) auto 0",
      }}
    >
      <h2
        style={{
          fontSize: "var(--font-size-2xl)",
          fontWeight: "var(--font-weight-bold)",
          marginBottom: "var(--spacing-6)",
          color: "var(--color-primary)",
          textAlign: "center",
        }}
      >
        Create Your Store
      </h2>
      {error && (
        <div
          style={{
            color: "var(--color-error)",
            marginBottom: "var(--spacing-4)",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-4)",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "var(--spacing-1)",
              color: "var(--color-text-muted)",
              fontSize: "var(--font-size-sm)",
            }}
          >
            Store Name
          </label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="glass"
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "none",
              outline: "none",
              color: "var(--color-text)",
              borderRadius: "var(--radius-md)",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "var(--spacing-1)",
              color: "var(--color-text-muted)",
              fontSize: "var(--font-size-sm)",
            }}
          >
            Description
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="glass"
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "none",
              outline: "none",
              color: "var(--color-text)",
              borderRadius: "var(--radius-md)",
            }}
          />
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="button-primary"
          style={{
            marginTop: "var(--spacing-2)",
            width: "100%",
            padding: "16px",
            borderRadius: "var(--radius-xl)",
          }}
        >
          {isLoading ? "Creating..." : "Create Store"}
        </button>
      </form>
    </div>
  );
}
