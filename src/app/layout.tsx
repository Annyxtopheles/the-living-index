import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atelier des Ombres — Curatorial Registry of Form & Shadow",
  description: "A museum-grade digital collection framework engineered for independent collectors and curators, driven by a version-controlled Git database.",
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
