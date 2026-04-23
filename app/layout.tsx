import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import Script from "next/script";

// 기존 폰트 설정 그대로 유지
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 오직 여기만 최적화된 내용으로 수정했습니다.
export const metadata: Metadata = {
  title: "Mundial K-Pop Idol 2026 | Tarot y Compatibilidad de Amor",
  description: "¡Vota por tu idol favorito! Descubre tu destino con el Tarot Idol y mide tu compatibilidad con tu bias. El juego definitivo para fans de K-Pop.",
  keywords: ["mundial kpop", "ideal type worldcup", "tarot kpop", "compatibilidad kpop", "kpop bias", "kpop latam"],
  
  openGraph: {
    title: "Mundial K-Pop Idol & K-Tarot 2026",
    description: "¿Quién es tu idol ideal? ¡Mide tu compatibilidad y juega ahora!",
    url: "https://www.kpop-bias.com",
    siteName: "Latin Worldcup",
    locale: "es_MX",
    type: "website",
  },

  verification: {
    google: "n0h7YBDy8iiuMhb1xrE4NYG3wWCD66K11XfK0bNBRT4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* ✅ 기존 광고 스크립트 구조 절대 유지 */}
        <Script
          id="monetag-vignette"
          src="https://izcle.com/vignette.min.js"
          data-zone="10716622"
          strategy="afterInteractive"
        />
      </head>
      {/* 기존 body 클래스 그대로 유지 */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}