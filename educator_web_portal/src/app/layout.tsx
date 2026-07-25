import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skillverse AI — Multilingual Education Portal",
  description: "Enterprise vocational education platform with real-time AI dubbing, automated document translations, and live classroom streams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
