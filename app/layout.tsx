import type { Metadata } from "next";
import NavBar from "./components/NavBar";

export const metadata: Metadata = {
  title: "Hello World - Next.js Demo",
  description: "A minimal Next.js Hello World demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
