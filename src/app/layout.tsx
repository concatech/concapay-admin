import type { Metadata } from "next";
import { Exo } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query-client";

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
          <QueryProvider>
            {children}
          </QueryProvider>
        </body>
      </html>
  );
}
