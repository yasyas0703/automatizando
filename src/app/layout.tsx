import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Gerador de Produtos 3D",
  description: "Automatize a criação de listings para Shopee e Mercado Livre",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen">
          <header className="border-b border-zinc-800 px-6 py-4">
            <div className="max-w-6xl mx-auto flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center text-xl">
                🎲
              </div>
              <div>
                <h1 className="text-lg font-bold">Gerador de Produtos 3D</h1>
                <p className="text-xs text-zinc-500">Shopee &amp; Mercado Livre</p>
              </div>
            </div>
          </header>
          <main className="max-w-6xl mx-auto p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
