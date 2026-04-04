import { useEffect, useRef } from "react";

const InteractiveBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      // Normalize mouse position from -1 to 1
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = (e.clientY / innerHeight) * 2 - 1;

      // Update CSS variables for mouse position
      containerRef.current.style.setProperty("--mouse-x", x);
      containerRef.current.style.setProperty("--mouse-y", y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        overflow: "hidden",
        pointerEvents: "none",
        "--mouse-x": 0, // Initial value
        "--mouse-y": 0, // Initial value
      }}
    >
      {/* Small Blob */}
      <div className="blob blob-sm" />

      {/* Medium Blob */}
      <div className="blob blob-md" />

      {/* Large Blob */}
      <div className="blob blob-lg" />
    </div>
  );
};

export default InteractiveBackground;
