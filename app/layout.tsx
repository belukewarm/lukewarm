export const metadata = { title: "Luke — Editor", description: "Minimal edits. Maximum impact." };

import "./globals.css";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
