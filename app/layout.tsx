export const metadata = { title: "Luke — Editor", description: "Minimal edits. Maximum impact." };

import "./globals.css";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-50">
        {children}
      </body>
    </html>
  );
}
