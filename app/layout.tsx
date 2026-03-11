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
  title: "Latin World Cup", // 형님 사이트 제목에 맞게 수정하셔도 됩니다!
  description: "The ultimate tournament for Latin fans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* 몬태그 광고 코드 시작 */}
        <script 
          src="https://quge5.com/88/tag.min.js" 
          data-zone="218829" 
          async 
          data-cfasync="false"
        ></script>
        {/* 몬태그 광고 코드 끝 */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}