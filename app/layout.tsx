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
  title: "Latin World Cup",
  description: "The ultimate tournament for Latin fans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* [추가] 0. 예전 승인된 온클릭 광고 (이게 있어야 돈이 됩니다!) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='10716566',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
          }}
        />

        {/* 1. Surprising tag (In-Page Push) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='10716658',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
          }}
        />
        
        {/* 2. Superior tag (Push Notifications) */}
        <script src="https://5gvci.com/act/files/tag.min.js?z=10716656" data-cfasync="false" async></script>

        {/* 3. Great tag (Vignette Banner) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='10716622',s.src='https://gizokraijaw.net/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}