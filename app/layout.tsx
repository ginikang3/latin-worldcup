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
    <html lang="en">
      <head>
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