"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

export default function NavBar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
        padding: "0.75rem 2rem",
        backgroundColor: "var(--color-nav-bg)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        flexWrap: "wrap",
      }}
    >
      {navLinks.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            style={{
              color: isActive
                ? "var(--color-nav-link-active)"
                : "var(--color-nav-link-inactive)",
              textDecoration: isActive ? "underline" : "none",
              fontWeight: isActive ? "700" : "400",
              fontSize: "1rem",
              fontFamily: "Arial, sans-serif",
              padding: "0.25rem 0.5rem",
              borderRadius: "4px",
              transition: "color 0.2s",
            }}
          >
            {label}
          </Link>
        );
      })}

      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.3rem 0.75rem",
          background: "var(--color-toggle-bg)",
          color: "var(--color-toggle-text)",
          border: "1px solid var(--color-toggle-border)",
          borderRadius: "20px",
          cursor: "pointer",
          fontSize: "0.875rem",
          fontFamily: "Arial, sans-serif",
          transition: "background-color 0.2s, color 0.2s",
        }}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
    </nav>
  );
}

