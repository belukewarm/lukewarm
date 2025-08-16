import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lukewarm Split",
  description: "Split Uber Eats / grocery orders fairly — items by person, fees split evenly."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-grid">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-28 -left-24 h-96 w-96 rounded-full blur-3xl" style={{background: "radial-gradient(closest-side, #0ea5e9 0%, transparent 60%)"}} />
          <div className="absolute bottom-[-10rem] right-[-8rem] h-[28rem] w-[28rem] rounded-full blur-3xl" style={{background: "radial-gradient(closest-side, #a78bfa 0%, transparent 60%)"}} />
        </div>
        <div className="max-w-6xl mx-auto px-5 py-7">{children}</div>
      </body>
    </html>
  );
}
