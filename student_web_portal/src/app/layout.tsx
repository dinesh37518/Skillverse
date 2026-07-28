import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillVerse AI — Student Learning Portal",
  description: "AI-powered student learning platform with Speech-to-Speech dubbing, empathetic AI tutor, 23 Indian languages, and real-time live classes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
