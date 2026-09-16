import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Living Index — Museum-Grade Archival Framework",
  description: "A serverless, zero-maintenance digital collection framework for independent collectors and curators, driven by a version-controlled Git database.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
