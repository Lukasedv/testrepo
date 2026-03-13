import { NAV_HEIGHT } from "../constants";

export default function About() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: `calc(100vh - ${NAV_HEIGHT})`,
        fontFamily: "Arial, sans-serif",
        backgroundColor: "var(--color-bg-page)",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          background: "var(--color-bg-card)",
          borderRadius: "12px",
          boxShadow: "0 4px 16px var(--color-card-shadow)",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", color: "var(--color-text-heading)", marginBottom: "0.5rem" }}>
          About Us
        </h1>
        <p style={{ fontSize: "1.2rem", color: "var(--color-text-body)" }}>
          About Us — Coming Soon
        </p>
      </div>
    </main>
  );
}

