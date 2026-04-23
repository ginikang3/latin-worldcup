import type { Metadata } from "next";
import localFont from "next/font/local"; // 원래 쓰시던 로컬 폰트 방식으로 복구
import "./globals.css";
import React from "react";
import Script from "next/script";

// 폰트 설정 원상복구 (경로와 변수명 원래대로 수정)
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  // SEO 최적화 타이틀 및 설명만 업데이트
  title: "Mundial K-Pop Idol 2026 | Tarot y Compatibilidad de Amor",
  description: "¡Vota por tu idol favorito! Descubre tu destino con el Tarot Idol y mide tu compatibilidad con tu bias. El juego definitivo para fans de K-Pop.",
  keywords: ["mundial kpop", "ideal type worldcup", "tarot kpop", "compatibilidad kpop", "kpop bias"],
  
  openGraph: {
    title: "Mundial K-Pop Idol & K-Tarot 2026",
    description: "¿Quién es tu idol ideal? ¡Mide tu compatibilidad y juega ahora!",
    url: "https://www.kpop-bias.com", // 새로 산 도메인 반영
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
        {/* 기존 광고 스크립트 그대로 유지 */}
        <Script
          id="monetag-vignette"
          src="https://izcle.com/vignette.min.js"
          data-zone="10716622"
          strategy="afterInteractive"
        />
      </head>
      {/* 폰트 변수 적용부 원상복구 */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}