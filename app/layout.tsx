import type { Metadata } from "next";
import I18nProvider from "./components/I18nProvider";
import LanguageSwitcher from "./components/LanguageSwitcher";
import HtmlLangSync from "./components/HtmlLangSync";
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
    <html lang="en" suppressHydrationWarning>
      <body>
        <I18nProvider>
          <HtmlLangSync />
          <NavBar />
          <LanguageSwitcher />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
