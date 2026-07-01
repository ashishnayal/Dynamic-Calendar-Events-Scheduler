import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nettu API Tester",
  description: "Custom UI for testing Nettu Scheduler endpoints",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <nav className="global-nav">
          <div className="nav-links">
            <Link href="/" className="nav-link">API Tester</Link>
            <Link href="/workflow" className="nav-link">Workflow</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
