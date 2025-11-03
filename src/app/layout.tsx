import type { Metadata } from "next";
import { Exo } from "next/font/google";
import "./globals.css";

const exo = Exo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-exo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Concapay Admin",
  description: "Painel administrativo Concapay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="pt-BR" className={exo.variable}>
        <body className={`antialiased font-primary ${exo.className}`} suppressHydrationWarning>
          {children}
        </body>
      </html>
  );
}
