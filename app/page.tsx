export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f4f8",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          background: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ fontSize: "3rem", color: "#2d3748", marginBottom: "0.5rem" }}>
          Hello, World! 👋
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#718096" }}>
          Welcome to this Next.js demo.
        </p>
      </div>
    </main>
  );
}
