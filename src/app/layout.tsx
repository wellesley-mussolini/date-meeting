import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { FundoAnimado } from "@/componentes/fundo-animado/FundoAnimado";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "date-meeting",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <FundoAnimado />
        {children}
      </body>
    </html>
  );
}
