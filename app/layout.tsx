import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}
