"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function NavBar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
  ];

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
        backgroundColor: "#2d3748",
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
              color: isActive ? "#ffffff" : "#a0aec0",
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
    </nav>
  );
}
