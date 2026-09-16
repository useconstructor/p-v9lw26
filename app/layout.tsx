import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AuthGuard | Secure authentication, built for speed",
  description: "Developer friendly registration, login, and user lifecycle management for modern SaaS teams.",
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
