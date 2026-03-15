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
        {/* [삭제됨] 0번 온클릭 광고와 1번 인페이지 푸시를 여기서 제거했습니다. */}
        {/* 그래야 유저가 이름 적을 때 광고가 안 터집니다. */}

        {/* 2. Superior tag (Push Notifications) - 이건 클릭이랑 상관없으니 유지 */}
        <script src="https://5gvci.com/act/files/tag.min.js?z=10716656" data-cfasync="false" async></script>

        {/* 3. Great tag (Vignette Banner) - 화면 상단 배너 유지 */}
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